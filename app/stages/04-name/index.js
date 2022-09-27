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

    constructor({canvas, images, bgcontroller, callback, app}){
        super(canvas);

        this.app = app;
        this.callback = callback;
        this.images = images;
        this.bgcontroller = bgcontroller;

        this.rot_center_x = this.canvas.width / 2;
        this.rot_center_y = this.canvas.height / 2;
        this.glow_center_x = this.canvas.width * 0.4580;
        this.glow_center_y = this.canvas.width * 0.5450;

        this.scale_glow = this.canvas.width / this.images["glow"].width * 1.5830;
        this.scale_hex_bold = this.canvas.width / this.images["hex-bold"].width * 0.926;
        this.scale_hex_thin = this.canvas.width / this.images["hex-thin"].width * 0.926;

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

        
        this.app.name_alpha = 0;
    }


    _calc_alpha(dt){
        // Calculate alpha used for country map background, and foreground
        if(undefined === this.alpha_t_count) this.alpha_t_count = 0;

        let t1 = constants.BACKGROUND_SWITCH_DURATION;
        let t = this.alpha_t_count;

        this.alpha_t_count += dt;

        if(t <= t1){
            return  t / t1;
        } else {
            return 1;
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

        let alpha = this._calc_alpha(dt);
        this.app.name_alpha = alpha;

        // clear whole canvas
        this.ctx_clearall();
        // draw bg
        this._draw_bg();

        // draw fg

        this.ctx.globalAlpha = alpha;

        this.ctx_drawImage(
            this.images["glow"],
            this.glow_center_x,
            this.glow_center_y,
            this.scale_glow,
            0
        );
        this.ctx_reset_transform();


        this.ctx_drawImage(
            this.images["hex-thin"],
            this.rot_center_x,
            this.rot_center_y,
            this.scale_hex_thin,
            -rotation
        );
        this.ctx_reset_transform();
    
        this.ctx_drawImage(
            this.images["hex-bold"],
            this.rot_center_x,
            this.rot_center_y,
            this.scale_hex_bold,
            rotation
        );
        this.ctx_reset_transform();

        this.button.draw(this.ctx);

        this.ctx.globalAlpha = 1;
        return true;
        
    }

    bind_events(){

        const ec = event_of("canvas");

        ec.on("touchstart", (e)=>{
//            this.callback();
            e.preventDefault();
        });

        this.button.on("pressed", (e)=>{
            this.app.play_touch_button_audio();
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
        callback,
        app
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
