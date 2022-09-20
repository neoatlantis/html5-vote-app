import constants    from "app/constants.js";
import utils        from "app/utils";
import setup_canvas from "./setup_canvas";

import TopLayer from "./layers/top";
import BaseLayer from "./layers/base";
import PatternLayer from "./layers/pattern";

import { get_image, get_font } from "app/resource-loader";

import bind_long_press_saver from "./bind_long_press_saver";



//////////////////////////////////////////////////////////////////////////////

async function interaction({
    canvas,
    app,
    result_choices,
    result_countries
}){
    const images = {
        "options": await get_image("choices_10x10"),
        "flags": await get_image("share_flags"),

        "base":  await get_image("share_base"),
        "base_footer": await get_image("share_base_footer"),
        "base_header": await get_image("share_base_header"),
        "pattern_screen": await get_image("share_pattern_screen"),
        "top_footer": await get_image("share_top_footer"),
        "top_header": await get_image("share_top_header"),
    };

    await get_font("font_main", "./data/main_font.ttf");
    await get_font("font_name", "./data/name_font.ttf");

    setup_canvas({canvas, height: 1});
    
    const layer_top = new TopLayer({
        canvas, images,
        countries: result_countries,
        choices: result_choices,
        username: app.username,
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

    app.result_image_dataurl = canvas.toDataURL();
    bind_long_press_saver(canvas);
}




//////////////////////////////////////////////////////////////////////////////
export default {
    interaction,
}
