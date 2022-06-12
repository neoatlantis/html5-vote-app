import choices      from "app/content.js";
import constants    from "app/constants.js";
import utils        from "app/utils.js";

import CanvasController from "app/canvascontrol.js";

import CanvasOption from "./canvas-option.js";

const { get_image } = require("app/resource-loader.js");

//////////////////////////////////////////////////////////////////////////////

class IntroCanvasController extends CanvasController {

    constructor({canvas, images, callback}){
        super(canvas);

        this.callback = callback;
        this.images = images;

        this.rotation = 0;
        this.rot_center_x = this.canvas.width / 2;
        this.rot_center_y = this.canvas.height / 2;
    }


    animation_frame(){
        // clear whole canvas
        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx_clearall();

        this.ctx_drawImage(
            this.images["hex-bold"],
            this.rot_center_x,
            this.rot_center_y,
            1,
            this.rotation
        );

        this.rotation += 0.01;

        
    }

    bind_events(){
    }
}






//////////////////////////////////////////////////////////////////////////////

async function interaction({
    canvas,
    callback,
    app
}){
   
    const images = {
        "hex-bold": await get_image("hex-bold"),
    };
    const canvascontrol = new IntroCanvasController({
        canvas,
        images,
        callback
    });
    canvascontrol.start_animation();

    await utils.until(()=>app.choices_done === true);

    canvascontrol.destroy();

}




//////////////////////////////////////////////////////////////////////////////
export default {
    interaction,
}
