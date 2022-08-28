import constants  from "app/constants.js";
import { get_image } from "app/resource-loader.js";



class CanvasBackgroundController{

    constructor(canvas, bgimg){
        this.canvas = canvas;
        this.bgimg = bgimg;

        this.ctx = this.canvas.getContext("2d");

        this.unit_height = this.bgimg.height / constants.BACKGROUND_BAR_N;
        this.scale_factor = this.canvas.height / this.unit_height;

        this.src_y_offset = 0;
        this.current_n = 0;
        
        this.animating_offset = 0;
        this.animating_duration = constants.BACKGROUND_SWITCH_DURATION,
        this.animating_step = 0;
        this.animating_target_y = this.current_n * this.unit_height;

        console.log("unit heihgt", this.unit_height);
    }

    jump_to_stage(n){ // n: 0,1,2,...
        this.src_y_offset = this.unit_height * n;
    }

    scroll_to_stage(n){
        // change this.src_y_offset gradually according to time, calculate
        // the moving effect logically.
        this.animating_offset = new Date().getTime();
        this.animating_step = (n-this.current_n) * this.unit_height / this.animating_duration;
        this.animating_target_y = n * this.unit_height;
        this.current_n = n;
    }

    get_y(){
        const now = new Date().getTime();
/*        if(now - this.animating_offset > this.animating_duration){
            return this.src_y_offset;
        }*/

        this.animating_elapsed = now - this.animating_offset;
        if(this.animating_elapsed < this.animating_duration){
            // animating
            return this.src_y_offset + this.animating_elapsed * this.animating_step;
        }
        // done with animating
        this.src_y_offset = this.animating_target_y;
        return this.src_y_offset;
    }

}


export default async function get_background_controller(canvas){
    return new CanvasBackgroundController(
        canvas,
        await get_image("bgcolor")
    );
}
