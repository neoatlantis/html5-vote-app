import constants    from "app/constants.js";
import utils        from "app/utils";
import setup_canvas from "./setup_canvas";

import TopLayer from "./layers/top";
import BaseLayer from "./layers/base";
import PatternLayer from "./layers/pattern";


const { get_image } = require("app/resource-loader.js");

const saveAs = require("app/FileSaver.min.js");

//const draw_image_header = require("./save-image.draw-header.js");
//const draw_background = require("./save-image.draw-background.js");


//////////////////////////////////////////////////////////////////////////////

async function interaction({
    canvas,
    app
}){
    const images = {
        "options": await get_image("options"),

        "badge": await get_image("share_badge"),
        "base":  await get_image("share_base"),
        "base_footer": await get_image("share_base_footer"),
        "base_header": await get_image("share_base_header"),
        "pattern_screen": await get_image("share_pattern_screen"),
        "top_footer": await get_image("share_top_footer"),
        "top_header": await get_image("share_top_header"),
    };

    setup_canvas({canvas, height: 1});
    
    const layer_top = new TopLayer({
        canvas, images,
    });

    const total_height = layer_top.get_height();

    setup_canvas({canvas, height: total_height / constants.SCALE_FACTOR});

    console.log("canvas", canvas.width, canvas.height);


    // render all images
    
    const ctx = canvas.getContext('2d');

    const layer_base = new BaseLayer({
        canvas, images, height: total_height,
    });

    const layer_pattern = new PatternLayer({
        canvas, images, height: total_height,
    });


    layer_base.render();
    ctx.globalCompositeOperation = "screen";
    layer_pattern.render();
    ctx.globalCompositeOperation = "source-over";
    layer_top.render();


}




//////////////////////////////////////////////////////////////////////////////
export default {
    interaction,
}
