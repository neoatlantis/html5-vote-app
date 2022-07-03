import choices      from "app/content.js";
import constants    from "app/constants.js";
import utils        from "app/utils";

import CanvasController from "app/canvascontrol.js";
import CanvasButton from "app/canvas-widgets/button.js";

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


class CountriesMenuCanvasController extends CanvasController {

    constructor({canvas, images, bgcontroller, callback, callback_done}){
        super(canvas);

        this.canvas = canvas;
        this.images = images;
        this.bgcontroller = bgcontroller;
        this.callback = callback;
        this.callback_done = callback_done;

        // button ref: horizontal: right, vertical: middle
        this.button_ref_x = this.canvas.width * 0.563;
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

        // Determine map size
        // map image is scaled up or down to fit the height, and its width
        // is expanded outside the screen
        this.image_map_scale = this.canvas.height / this.images["bg"].height;
        this.map_width = this.images["bg"].width * this.image_map_scale; // > screen width

        this.map_draw_x = this.canvas.width / 2 - this.map_width / 2;

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


    }

    _draw_fg(){
        this.ctx.drawImage(
            this.images["bg"],
            
            0, 0, this.images["bg"].width, this.images["bg"].height,

            this.map_draw_x,
            0, // sy
            this.map_width,
            this.canvas.height
        );
    }

    animation_frame(t, dt){
        // clear whole canvas
        this.ctx_clearall();
        // draw bg
        this._draw_bg();
        // draw each icon
        /*this.options_instances.forEach((oi)=>{
            oi.next({ delta_y0: this.delta_y0, t, dt });
        });*/
        this.ctx_reset_filter();

        this._draw_fg();

        //draw button
        this.button.draw(this.ctx);
        // clear header region
//        this.ctx.clearRect(0, 0, this.canvas.width, HEADER_HEIGHT);*/
        return true;
    }

    bind_events(){
        const ec = event_of("canvas");

        function on_click(x, y){
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
        let touch_lastx = 0;
        ec.on("touchstart", (e)=>{
            touchscrolled = false;
            touch_lastx = e.changedTouches[0].clientY;
            e.preventDefault();
        });

        ec.on("touchend", (e)=>{

            if(!touchscrolled){
                // touch-"clicked" something
                let touch = e.changedTouches[0];
                on_click.call(
                    this,
                    touch.clientX * constants.SCALE_FACTOR,
                    touch.clientY * constants.SCALE_FACTOR
                );
            }

            e.preventDefault();
        });

        ec.on("touchmove", (e)=>{
            touchscrolled = true;

            const currenty = e.changedTouches[0].clientY;
            touch_lastx = currenty;
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
        "bg": await get_image("countries-bg"),
        "flags": await get_image("countries-flags"),
        "glow": await get_image("countries-glow"),
        "button": await get_image("donebutton"),
        "button-down": await get_image("donebutton-down"),
    };

    const canvascontrol = new CountriesMenuCanvasController({
        canvas,
        images,
        bgcontroller,
        callback,
        callback_done,
    });
    canvascontrol.start_animation();

    await utils.until(()=>app.countries_done === true);

    bgcontroller.scroll_to_stage(3);
    await canvascontrol.destroy();

}




//////////////////////////////////////////////////////////////////////////////
export default {
    interaction,
}
