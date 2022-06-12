import choices      from "app/content.js";
import constants    from "app/constants.js";

import CanvasController from "app/canvascontrol.js";

import CanvasOption from "./canvas-option.js";

const { get_image } = require("./resource-loader.js");

const initial_position = Math.floor(Math.random()*constants.MENU_CHOICES_PER_ROW);
const position_deltas = choices.map((e)=>Math.floor(Math.random()*2)).map((e)=>e?1:-1);
let current_pos = initial_position;
let choices_positions = [];
for(let i=0; i<choices.length; i++){
    current_pos += position_deltas[i];
    if(current_pos < 0){
        current_pos += constants.MENU_CHOICES_PER_ROW;
    }
    if(current_pos >= constants.MENU_CHOICES_PER_ROW){
        current_pos -= constants.MENU_CHOICES_PER_ROW;
    }
    choices_positions.push(current_pos);
}

//////////////////////////////////////////////////////////////////////////////

let HEADER_HEIGHT = 0;

function set_header_height(h){
    HEADER_HEIGHT = h * constants.SCALE_FACTOR;
}

//////////////////////////////////////////////////////////////////////////////

class ChoiceMenuCanvasController extends CanvasController {

    constructor({canvas, image_src, callback}){
        super(canvas);

        this.callback = callback;
        this.scrollspeed = canvas.height / 4000;

        this.row_size = Math.round(canvas.width / 4);

        this.options_instances = choices.map((choice, choice_i)=>{
            return new CanvasOption({
                choice_id: choice.id,
                text: choice.text,
                image_id: choice.pos,
                image_src: image_src,
                row: choice_i,
                col: choices_positions[choice_i],
                size: this.row_size,
                ctx: this.ctx,
                canvas_height: this.canvas.height,
            });
        });


        this.delta_y0_min = canvas.height - this.row_size * this.options_instances.length;
        this.delta_y0_max = canvas.height / 2;
        this.delta_y0 = this.delta_y0_max; //0;
        this.delta_y0_scroll = false;
        this.autoscroll = true;
    }


    animation_frame(){
        const nowtime = new Date().getTime();
        if(this.autoscroll){
            this.delta_y0 -= this.scrollspeed;
        }
        this.delta_y0 += this.delta_y0_scroll;
        this.delta_y0_scroll = 0;

        if(this.delta_y0 < this.delta_y0_min){
            this.delta_y0 = this.delta_y0_min;
        }
        if(this.delta_y0 > this.delta_y0_max){
            this.delta_y0 = this.delta_y0_max;
        }

        // clear whole canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // draw each icon
        this.options_instances.forEach((oi)=>{
            oi.next({ delta_y0: this.delta_y0, nowtime: nowtime });
        });
        // clear header region
        this.ctx.clearRect(0, 0, this.canvas.width, HEADER_HEIGHT);
    }

    bind_events(){
        function on_click(x, y){
            if(y < HEADER_HEIGHT) return; // clicking header region ignored
            // handle a touch-click or mouseclick event
            this.options_instances.forEach((oi)=>oi.handle_click(x, y));
            let selected_ids = this.options_instances    
                .filter((oi)=>oi.choosen)
                .map((oi)=>oi.choice_id)
            ;
            try{
                callback(selected_ids);
            } catch(e){
            }
        }

        let touchscrolled = false;
        let touch_lasty = 0;
        this.canvas.ontouchstart = (e)=>{
            this.autoscroll = false;
            touchscrolled = false;
            this.delta_y0_scroll = 0;
            touch_lasty = e.changedTouches[0].clientY;
            e.preventDefault();
        }

        this.canvas.ontouchend = (e)=>{
            this.autoscroll = true;

            if(!touchscrolled){
                // touch-"clicked" something
                let touch = e.changedTouches[0];
                on_click.call(
                    this,
                    touch.clientX * constants.SCALE_FACTOR,
                    touch.clientY * constants.SCALE_FACTOR
                );
            }

            this.delta_y0_scroll = 0;
            e.preventDefault();
        }

        this.canvas.ontouchmove = (e)=>{
            if(this.autoscroll) return;
            touchscrolled = true;

            const currenty = e.changedTouches[0].clientY;
            this.delta_y0_scroll += (currenty - touch_lasty) * constants.SCALE_FACTOR;
            touch_lasty = currenty;
            e.preventDefault();
        }
        
    }
}






//////////////////////////////////////////////////////////////////////////////

async function start_and_wait_done(canvas, callback){
   
    const image_src = await get_image("options");
    const canvascontrol = new ChoiceMenuCanvasController({
        canvas,
        image_src,
        callback
    });
    canvascontrol.start_animation();

}




//////////////////////////////////////////////////////////////////////////////
export default {
    start_and_wait_done,
    set_header_height,
}
