import choices      from "app/content.js";
import constants    from "app/constants.js";
import utils        from "app/utils";

import CanvasController from "app/canvascontrol.js";

import CanvasOption from "./canvas-option.js";

const { get_image } = require("app/resource-loader.js");
const event_of = require("app/events"); 

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

    constructor({canvas, images, bgcontroller, callback}){
        super(canvas);

        this.canvas = canvas;
        this.images = images;
        this.bgcontroller = bgcontroller;
        this.callback = callback;
        this.scrollspeed = canvas.height / 4000;

        this.row_size = Math.round(canvas.width / 4);

        this.options_instances = choices.map((choice, choice_i)=>{
            return new CanvasOption({
                choice_id: choice.id,
                text: choice.text,
                image_id: choice.pos,
                image_src: images["options"],
                row: choice_i,
                col: choices_positions[choice_i],
                size: this.row_size,
                ctx: this.ctx,
                canvas_height: this.canvas.height,
                canvas_width: this.canvas.width,
            });
        });


        this.delta_y0_min = canvas.height - this.row_size * this.options_instances.length;
        this.delta_y0_max = canvas.height / 2;
        this.delta_y0 = this.delta_y0_max; //0;
        this.delta_y0_scroll = false;
        this.autoscroll = true;
    }

    _draw_bg(){
        this.ctx.drawImage(
            this.bgcontroller.bgimg,
            0,  // sx = 0
            this.bgcontroller.get_y(), // sy = whatever
            this.bgcontroller.bgimg.width, // sWidth
            this.bgcontroller.unit_height, // sHeight
            0,  // dx = 0
            0,  // dy = 0
            this.canvas.width,
            this.canvas.height
        );


        const scroll_width =
            this.canvas.width * constants.MENU_CHOICES_SCROLL_WIDTH;
        const scroll_f = scroll_width / this.images["scroll"].width;
        const scroll_height = this.images["scroll"].height * scroll_f;
        this.ctx.drawImage(
            this.images["scroll"],
            this.canvas.width * 0.963 - scroll_width,
            this.canvas.height / 2 - scroll_height / 2,
            scroll_width,
            scroll_height
        );
    }

    _draw_fg(){
        const factor = HEADER_HEIGHT / this.canvas.height;
        this.ctx.drawImage(
            this.bgcontroller.bgimg,
            0,  // sx = 0
            this.bgcontroller.get_y(), // sy = whatever
            this.bgcontroller.bgimg.width, // sWidth
            this.bgcontroller.unit_height * factor, // sHeight
            0,  // dx = 0
            0,  // dy = 0
            this.canvas.width,
            HEADER_HEIGHT
        );
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
        this.ctx_clearall();
        // draw bg
        this._draw_bg();
        // draw each icon
        this.options_instances.forEach((oi)=>{
            oi.next({ delta_y0: this.delta_y0, nowtime: nowtime });
        });
        // clear header region
        this.ctx_reset_filter();
        this._draw_fg();
//        this.ctx.clearRect(0, 0, this.canvas.width, HEADER_HEIGHT);
    }

    bind_events(){
        const ec = event_of("canvas");

        function on_click(x, y){
            if(y < HEADER_HEIGHT) return; // clicking header region ignored
            // handle a touch-click or mouseclick event
            this.options_instances.forEach((oi)=>oi.handle_click(x, y));
            let selected_ids = this.options_instances    
                .filter((oi)=>oi.choosen)
                .map((oi)=>oi.choice_id)
            ;
            try{
                this.callback(selected_ids);
            } catch(e){
            }
        }

        let touchscrolled = false;
        let touch_lasty = 0;
        ec.on("touchstart", (e)=>{
            this.autoscroll = false;
            touchscrolled = false;
            this.delta_y0_scroll = 0;
            touch_lasty = e.changedTouches[0].clientY;
            e.preventDefault();
        });

        ec.on("touchend", (e)=>{
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
        });

        ec.on("touchmove", (e)=>{
            if(this.autoscroll) return;
            touchscrolled = true;

            const currenty = e.changedTouches[0].clientY;
            this.delta_y0_scroll += (currenty - touch_lasty) * constants.SCALE_FACTOR;
            touch_lasty = currenty;
            e.preventDefault();
        });
        



        event_of("stage1").on("deselect-choice", (choice_id) => {
            // update
            this.options_instances    
                .filter((oi)=>oi.choosen && oi.choice_id == choice_id)
                .forEach((oi)=>oi.choosen = false)
            ;

        });
    }
}






//////////////////////////////////////////////////////////////////////////////

async function interaction({
    canvas,
    callback,
    bgcontroller,
    app
}){
   
    const images = {
        "options": await get_image("options"),
        "scroll": await get_image("scroll"),
    };

    const canvascontrol = new ChoiceMenuCanvasController({
        canvas,
        images,
        bgcontroller,
        callback
    });
    canvascontrol.start_animation();

    await utils.until(()=>app.choices_done === true);

    bgcontroller.scroll_to_stage(2);
    await canvascontrol.destroy();

}




//////////////////////////////////////////////////////////////////////////////
export default {
    interaction,
    set_header_height,
}
