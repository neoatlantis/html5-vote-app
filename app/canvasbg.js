import constants  from "app/constants.js";
const { get_image } = require("app/resource-loader.js");



class CanvasBackgroundController{

    constructor(canvas, bgimg){
        this.canvas = canvas;
        this.bgimg = bgimg;

        this.ctx = this.canvas.getContext("2d");

        this.unit_height = this.bgimg.height / constants.BACKGROUND_BAR_N;
        this.scale_factor = this.canvas.height / this.unit_height;

        this.src_y_offset = 0;
        
        this.timing_offset = new Date().getTime();
    }

    jump_to_stage(n){ // n: 0,1,2,...
        this.src_y_offset = this.bgimg.unit_height * n;
    }

    scroll_to_stage(n){
        // change this.src_y_offset gradually according to time, calculate
        // the moving effect logically.
        this.jump_to_stage(n); // TODO change this
    }

    get_y(){
//        return ((new Date().getTime() - this.timing_offset) / 10) % this.bgimg.height;
        return this.src_y_offset;
    }

}


export default async function get_background_controller(canvas){
    return new CanvasBackgroundController(
        canvas,
        await get_image("bgcolor")
    );
}
