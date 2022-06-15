import choices      from "app/content.js";
import constants    from "app/constants.js";
import utils        from "app/utils.js";

import CanvasController from "app/canvascontrol.js";


const { get_image } = require("app/resource-loader.js");

//////////////////////////////////////////////////////////////////////////////

class IntroCanvasController extends CanvasController {

    constructor({canvas, images, bgcontroller, callback}){
        super(canvas);

        this.callback = callback;
        this.images = images;
        this.bgcontroller = bgcontroller;

        this.rot_center_x = this.canvas.width / 2;
        this.rot_center_y = this.canvas.height / 2;
    }

    _draw_bg(){
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
        this.ctx.drawImage(
            stars,
            0, // dx
            0, // dy
            this.canvas.width,
            this.canvas.width/stars.width * stars.height
        );
    }

    animation_frame(){
        const elapsed_time = new Date().getTime() - this.starttime;
        const rotation = elapsed_time / 1000 * 0.8;

        // clear whole canvas
        this.ctx_clearall();
        // draw bg
        this._draw_bg();

        this.ctx_drawImage(
            this.images["hex-1"],
            this.rot_center_x,
            this.rot_center_y,
            0.5,
            -rotation
        ) && this.ctx_reset_transform();

        this.ctx_drawImage(
            this.images["hex-2"],
            this.rot_center_x,
            this.rot_center_y,
            0.5,
            -rotation * 1.1 
        ) && this.ctx_reset_transform();

        this.ctx_drawImage(
            this.images["hex-3"],
            this.rot_center_x,
            this.rot_center_y,
            0.5,
            -rotation * 1.7 
        ) && this.ctx_reset_transform();

        this.ctx_drawImage(
            this.images["hex-bold"],
            this.rot_center_x,
            this.rot_center_y,
            0.5,
            rotation
        ) && this.ctx_reset_transform();

        this.ctx_drawImage(
            this.images["glow"],
            this.rot_center_x,
            this.rot_center_y,
            0.5,
            0
        ) && this.ctx_reset_transform();

        this.ctx_drawImage(
            this.images["introtitle"],
            this.rot_center_x,
            this.rot_center_y,
            0.5,
            0
        ) && this.ctx_reset_transform();

        this.rotation += 0.005;

        
    }

    bind_events(){

        this.canvas.ontouchstart = (e)=>{
            this.bgcontroller.scroll_to_stage(1);
            this.callback();
            e.preventDefault();
        }

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
        "hex-bold": await get_image("hex-bold"),
        "hex-1": await get_image("hex-1"),
        "hex-2": await get_image("hex-2"),
        "hex-3": await get_image("hex-3"),
        "stars": await get_image("stars"),
        "glow": await get_image("glow"),
        "introtitle": await get_image("introtitle"),
    };
    const canvascontrol = new IntroCanvasController({
        canvas,
        images,
        bgcontroller,
        callback
    });
    canvascontrol.start_animation();

    await utils.until(()=>app.intro_done === true);

    canvascontrol.destroy();

}




//////////////////////////////////////////////////////////////////////////////
export default {
    interaction,
}