import choices      from "app/content.js";
import constants    from "app/constants.js";
import utils        from "app/utils.js";

import CanvasController from "app/canvascontrol.js";


const { get_image } = require("app/resource-loader.js");

//////////////////////////////////////////////////////////////////////////////

class NameCanvasController extends CanvasController {

    constructor({canvas, images, bgcontroller, callback}){
        super(canvas);

        this.callback = callback;
        this.images = images;
        this.bgcontroller = bgcontroller;

        this.rot_center_x = this.canvas.width / 2;
        this.rot_center_y = this.canvas.height / 2;
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
    

    animation_frame(){
        const elapsed_time = new Date().getTime() - this.starttime;
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
        ) && this.ctx_reset_transform();
    
        this.ctx_drawImage(
            this.images["hex-bold"],
            this.rot_center_x,
            this.rot_center_y,
            1,
            rotation
        ) && this.ctx_reset_transform();



        this.ctx_drawImage(
            this.images["glow"],
            this.rot_center_x,
            this.rot_center_y,
            1,
            0
        ) && this.ctx_reset_transform();

        this.rotation += 0.005;

        
    }

    bind_events(){

        this.canvas.ontouchstart = (e)=>{
            this.bgcontroller.scroll_to_stage(2);
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
        "hex-thin": await get_image("hex-thin"),
        "glow": await get_image("glow"),
    };
    const canvascontrol = new NameCanvasController({
        canvas,
        images,
        bgcontroller,
        callback
    });
    canvascontrol.start_animation();

    await utils.until(()=>app.name_done === true);

    await canvascontrol.destroy();

}




//////////////////////////////////////////////////////////////////////////////
export default {
    interaction,
}
