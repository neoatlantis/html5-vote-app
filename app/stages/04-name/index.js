import debugging    from "app/debug.js";
import choices      from "app/content.js";
import constants    from "app/constants.js";
import utils        from "app/utils";

import CanvasButton from "app/canvas-widgets/button.js";
import CanvasController from "app/canvascontrol.js";

const event_of = require("app/events.js");

import { get_image } from "app/resource-loader";

//////////////////////////////////////////////////////////////////////////////

class NameCanvasController extends CanvasController {

    constructor({canvas, images, bgcontroller, callback}){
        super(canvas);

        this.callback = callback;
        this.images = images;
        this.bgcontroller = bgcontroller;

        this.rot_center_x = this.canvas.width / 2;
        this.rot_center_y = this.canvas.height / 2;

        // button ref: horizontal: right, vertical: middle
        this.button_ref_x = this.canvas.width * 0.5236;
        this.button_ref_y = this.canvas.height * 0.85;
        this.scale_button = this.canvas.width / this.images["button"].width * 0.30;

        this.button_ref_x = this.rot_center_x;
        this.button_ref_y = this.rot_center_y;

        this.button = new CanvasButton({
            image: this.images["button"],
            image_pressed_down: this.images["button-down"],
            x0: this.button_ref_x - this.scale_button * this.images["button"].width / 2,
            y0: this.button_ref_y,
            x1: this.button_ref_x + this.scale_button * this.images["button"].width / 2,
            y1: this.button_ref_y + this.scale_button * this.images["button"].height,
        });
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

    exit_animation_frame(){
        return false;
        /*const elapsed_time = new Date().getTime() - this.starttime;
        // clear whole canvas
        this.ctx_clearall();
        // draw bg
        this._draw_bg();

        return elapsed_time < 3000;*/
    }
    

    animation_frame(elapsed_time, dt){
        if(!this.flag_animation_playing) return;
        const rotation = elapsed_time / 1000 * 0.8;

        // clear whole canvas
        this.ctx_clearall();
        // draw bg
        this._draw_bg();

        this.ctx_drawImage(
            this.images["hex-thin"],
            this.rot_center_x,
            this.rot_center_y,
            1,
            -rotation
        );
        this.ctx_reset_transform();
    
        this.ctx_drawImage(
            this.images["hex-bold"],
            this.rot_center_x,
            this.rot_center_y,
            1,
            rotation
        );
        this.ctx_reset_transform();

        this.ctx_drawImage(
            this.images["glow"],
            this.rot_center_x,
            this.rot_center_y,
            1,
            0
        ); 
        this.ctx_reset_transform();

        this.button.draw(this.ctx);

        return true;
        
    }

    bind_events(){

        const ec = event_of("canvas");

        ec.on("touchstart", (e)=>{
            console.log("____________________________");
//            this.callback();
            e.preventDefault();
        });

        this.button.on("pressed", (e)=>{
            this.callback();
            e.preventDefault();
            e.stopPropagation();
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
        "hex-bold": await get_image("hex_bold"),
        "hex-thin": await get_image("hex_thin"),
        "glow": await get_image("glow"),
        "button": await get_image("generate_button"),
        "button-down": await get_image("generate_button_pressed"),
    };
    const canvascontrol = new NameCanvasController({
        canvas,
        images,
        bgcontroller,
        callback
    });
    canvascontrol.start_animation();

    /// #if DEV
    if(debugging()){
        if(debugging('stage') && debugging('stage') > 4){
            app.name_done = true;
        }
    }
    /// #endif

    await utils.until(()=>app.name_done === true);

    await canvascontrol.destroy();

}




//////////////////////////////////////////////////////////////////////////////
export default {
    interaction,
}
