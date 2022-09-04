import debugging    from "app/debug.js";
import { choices }  from "app/content.js";
import constants    from "app/constants.js";
import utils        from "app/utils";

import CanvasController from "app/canvascontrol.js";
import CanvasButton from "app/canvas-widgets/button.js";
import CanvasOption from "./canvas-option.js";
import Stage2AutoRoller from "./physics.js";

import { get_image } from "app/resource-loader.js";

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

    constructor({app, canvas, images, bgcontroller, callback, callback_done}){
        super(canvas);

        this.app = app;

        this.canvas = canvas;
        this.images = images;
        this.bgcontroller = bgcontroller;
        this.callback = callback;
        this.callback_done = callback_done;
        this.scrollspeed = canvas.height / constants.MENU_CHOICES_SCROLL_SPEED_DIVISION;

        this.row_height = canvas.width * constants.MENU_CHOICE_ROW_HEIGHT;

        this.options_instances = choices.map((choice, choice_i)=>{
            return new CanvasOption({
                app,
                choice_id: choice.id,
                text: choice.text,
                image_id: choice.pos,
                image_src: images["options"],
                row: choice_i,
                col: choices_positions[choice_i],
                size: canvas.width * constants.MENU_CHOICE_WIDTH,
                row_height: this.row_height,
                ctx: this.ctx,
                canvas_height: this.canvas.height,
                canvas_width: this.canvas.width,
            });
        });

        // button ref: horizontal: right, vertical: middle
        this.button_ref_x = this.canvas.width * 0.963;
        this.button_ref_y = this.canvas.height * 0.875;
        this.scale_button = this.canvas.width / this.images["button"].width * 0.25;
        this.button = new CanvasButton({
            image: this.images["button"],
            image_pressed_down: this.images["button-down"],
            x0: this.button_ref_x - this.scale_button * this.images["button"].width,
            y0: this.button_ref_y - this.scale_button * this.images["button"].height / 2,
            x1: this.button_ref_x,
            y1: this.button_ref_y + this.scale_button * this.images["button"].height / 2,
        });

        this.physics = new Stage2AutoRoller({
            y_lower: -canvas.height / 2,
            y_upper: this.row_height * this.options_instances.length - canvas.height / 2,
            speed: this.scrollspeed,
        });

//        this.physics.change_v(this.scrollspeed*5); // initial speed above: 5
        this.physics.add_y(-canvas.height / 2);

        this.delta_y0 = 0;
        this.delta_y0_scroll = false;
    }

    async init(){
        for(let o of this.options_instances){
            await o.init();
        }
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

    animation_frame(t, dt){
        // automatical scroll
        this.physics.calculate(dt);
        // add displacements due to scroll events:
        //this.physics.add_y(-this.delta_y0_scroll);
        this.delta_y0 = -this.physics.y;
        //this.delta_y0_scroll = 0;

        // clear whole canvas
        this.ctx_clearall();
        // draw bg
        this._draw_bg();
        // draw each icon
        this.options_instances.forEach((oi)=>{
            oi.next({ delta_y0: this.delta_y0, t, dt });
        });
        this.ctx_reset_filter();

        //draw button
        this.button.draw(this.ctx);
        // clear header region
        this._draw_fg();
//        this.ctx.clearRect(0, 0, this.canvas.width, HEADER_HEIGHT);
        return true;
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
        let touch_last_time = null;
        ec.on("touchstart", (e)=>{
            this.physics.disengage();

            touch_last_time = new Date().getTime();
            touchscrolled = false;
            this.delta_y0_scroll = 0;
            touch_lasty = e.changedTouches[0].clientY;
            e.preventDefault();
        });

        ec.on("touchend", (e)=>{
            this.physics.engage();

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
            if(!this.physics.disengaged) return;

            touchscrolled = true;
            const current_y = e.changedTouches[0].clientY;

            let delta = (current_y - touch_lasty) * constants.SCALE_FACTOR;
            if(!isNaN(delta)){
                this.physics.add_y(-delta);
            }

            touch_lasty = current_y;
            e.preventDefault();
        });
        

        event_of("stage1").on("deselect-choice", (choice_id) => {
            // update
            this.options_instances    
                .filter((oi)=>oi.choosen && oi.choice_id == choice_id)
                .forEach((oi)=>oi.choosen = false)
            ;
        });


        this.button.on("pressed", (e)=>{
            this.app.play_touch_audio();
            this.callback_done()
            e.preventDefault();
            e.stopPropagation();
        });

    }
}






//////////////////////////////////////////////////////////////////////////////

async function interaction({
    canvas,
    callback,
    callback_done,
    bgcontroller,
    app
}){
   
    const images = {
        "options": await get_image("options"),
        "scroll": await get_image("scroll"),
        "button": await get_image("donebutton"),
        "button-down": await get_image("donebutton-down"),
    };

    console.log("#1");
    const canvascontrol = new ChoiceMenuCanvasController({
        app,
        canvas,
        images,
        bgcontroller,
        callback,
        callback_done,
    });
    await canvascontrol.init();
    console.log("#2");
    canvascontrol.start_animation();

    /// #if DEV
    if(debugging()){
        if(debugging('stage') && debugging('stage') > 2){
            callback_done();
        }
    }
    /// #endif

    console.log("#3");
    await utils.until(()=>app.choices_done === true);

    bgcontroller.scroll_to_stage(2);
    await canvascontrol.destroy();

}




//////////////////////////////////////////////////////////////////////////////
export default {
    interaction,
    set_header_height,
}
