import debugging    from "app/debug.js";
import constants    from "app/constants.js";
import utils        from "app/utils";
import { get_image } from "app/resource-loader";

import CanvasController from "app/canvascontrol.js";
import FireworkController from "./firework.js";

import CanvasButton from "app/canvas-widgets/button.js";


const event_of = require("app/events.js");

//////////////////////////////////////////////////////////////////////////////

class IntroCanvasController extends CanvasController {

    constructor({canvas, images, bgcontroller, callback, app}){
        super(canvas);

        this.app = app;
        this.fwcontroller = new FireworkController(canvas, this.ctx);

        this.callback = callback;
        this.images = images;
        this.bgcontroller = bgcontroller;

        this.rot_center_x = this.canvas.width * 0.5;
        this.rot_center_y = this.canvas.width * 0.7;
        this.glow_center_x = this.canvas.width * 0.4580;
        this.glow_center_y = this.canvas.width * 0.7450;
        this.logo_center_x = this.canvas.width * 0.45;
        this.logo_center_y = this.canvas.width * 0.755;
        this.slogan_center_x = this.canvas.width * 0.5;
        this.slogan_center_y = this.canvas.height*0.2532 + this.canvas.width * 0.8685;
        this.button_center_x = this.canvas.width * 0.5;
        this.button_center_y = this.canvas.height * 0.55 + 0.5236 * this.canvas.width;

        
        this.scale_introtitle = this.canvas.width / this.images["introtitle"].width * 0.75;
//      this.scale_glow = Math.min(0.925 * this.canvas.width, 0.40 * this.canvas.height) / this.images["glow"].width;
        this.scale_glow = this.canvas.width / this.images["glow"].width * 1.5830;
//        console.log(this.scale_glow);
        this.scale_hex_bold = this.canvas.width / this.images["hex-bold"].width * 0.926;
        this.scale_hex_thin = this.canvas.width / this.images["hex-thin"].width * 0.926;
        this.scale_slogan = this.canvas.width / this.images["slogan"].width * 0.6;
        this.scale_button = this.canvas.width / this.images["button"].width * 0.3;

        this.button = new CanvasButton({
            image: this.images["button"],
            image_pressed_down: this.images["button-down"],
            x0: this.button_center_x - this.scale_button * this.images["button"].width / 2,
            y0: this.button_center_y - this.scale_button * this.images["button"].height / 2,
            x1: this.button_center_x + this.scale_button * this.images["button"].width / 2,
            y1: this.button_center_y + this.scale_button * this.images["button"].height / 2,
        });

        const self = this;
/*        function add_firework(){
            self.fwcontroller.add_firework(
                utils.random_range(0, self.canvas.width),
                utils.random_range(0, self.canvas.height)
            );
            if(!self.destroyed){
                setTimeout(add_firework, utils.random_range(100, 1000));
            }
        }
        add_firework();*/
    }

    _draw_bg({ stars_alpha= 1.0 }){
        const stars = this.images["stars"];
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
        this.ctx.globalAlpha = stars_alpha;
        this.ctx.drawImage(
            stars,
            0, // dx
            -this.bgcontroller.get_y(), // dy
            this.canvas.width,
            this.canvas.width/stars.width * stars.height
        );
        this.ctx.globalAlpha = 1;
    }

    exit_animation_frame(t){
        if(undefined === this.exit_frame_t0) this.exit_frame_t0 = t;
        const elapsed_time = t - this.exit_frame_t0;
        const Tmax = constants.BACKGROUND_SWITCH_DURATION;

        // clear whole canvas
        this.ctx_clearall();
        // draw bg
        this._draw_bg({ stars_alpha: 1- elapsed_time / Tmax });

        return elapsed_time < constants.BACKGROUND_SWITCH_DURATION;
    }
    

    animation_frame(t, dt){
        if(!this.flag_animation_playing) return;

        const elapsed_time = t; //new Date().getTime() - this.starttime;
        const rotation = elapsed_time / 1000 * 0.8;

        // clear whole canvas
        this.ctx_clearall();
        // draw bg
        this._draw_bg({});

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




        this.ctx_drawImage(
            this.images["introtitle"],
            this.logo_center_x,
            this.logo_center_y,
            this.scale_introtitle,
            0
        );
        this.ctx_reset_transform();

        this.ctx_drawImage(
            this.images["slogan"],
            this.slogan_center_x,
            this.slogan_center_y,
            this.scale_slogan,
            0
        );
        this.ctx_reset_transform();


        this.button.draw(this.ctx);
/*        this.ctx_drawImage(
            this.images["button"],
            this.button_center_x,
            this.button_center_y,
            this.scale_button,
            0
        );*/
        this.ctx_reset_transform();


//        this.rotation += 0.005;

        //this.fwcontroller.animation_frame(t, dt);
        

        return true;
    }

    bind_events(){

        const ec = event_of("canvas");

        ec.on("touchstart", (e)=>{
//            this.callback();
            e.preventDefault();
        });

        this.button.on("pressed", (e)=>{
            this.app.play_music();
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
    bgcontroller.scroll_to_stage(0);
   
    const images = {
        "hex-bold": await get_image("hex_bold"),
        "hex-thin": await get_image("hex_thin"),
        "glow": await get_image("glow"),

        "stars": await get_image("intro_stars"),
        "introtitle": await get_image("intro_title"),
        "slogan": await get_image("intro_slogan"),
        "button": await get_image("intro_button"),
        "button-down": await get_image("intro_button_pressed"),
    };
    const canvascontrol = new IntroCanvasController({
        canvas,
        images,
        bgcontroller,
        callback,
        app
    });
    canvascontrol.start_animation();

    /// #if DEV
    if(debugging()){
        if(debugging('stage') && debugging('stage') > 1){
            callback();
        }
    }
    /// #endif

    await utils.until(()=>app.intro_done === true);

    bgcontroller.scroll_to_stage(1);
    await canvascontrol.destroy();

}




//////////////////////////////////////////////////////////////////////////////
export default {
    interaction,
}
