import constants    from "app/constants.js";
import utils from "app/utils";


const appendix_height = 100;
const icon_size_to_width = constants.RESULT_ICON_SIZE_TO_WIDTH;
const tile_size = constants.RESOURCE_ICON_TILE_SIZE;
const icons_area_margin_percentage = constants.RESULT_ICONS_MARGIN_TO_CANVAS_WIDTH;
const icons_per_row = constants.RESULT_ICONS_PER_ROW;

const saveAs = require("./FileSaver.min.js");
const { get_image } = require("./resource-loader.js");

const draw_image_header = require("./save-image.draw-header.js");
const draw_background = require("./save-image.draw-background.js");


function setup_sizes(options_count){

    const canvas = document.getElementById("result");
    const ctx = canvas.getContext("2d");

    const css_width = window.innerWidth;
    
    const prefix_height = Math.ceil(
        css_width * constants.RESULT_HEADER_HEIGHT_WIDTH_RATIO);

    const icons_area_margin = icons_area_margin_percentage * css_width;
    const icon_split_width = (css_width - 2 * icons_area_margin) / icons_per_row;
    const row_height = icon_split_width * constants.RESULT_ICON_ROW_HEIGHT_TO_GRID_SIZE;

    const css_height = 
        row_height * Math.ceil(options_count / icons_per_row)
        + prefix_height + appendix_height;


    utils.setup_canvas(canvas, css_width, css_height);
}



export default async function update_result(options, args){
    setup_sizes(options.length);

    const canvas = document.getElementById("result");
    const ctx = canvas.getContext("2d");

    const srcimg = await get_image("options");

    const prefix_height = Math.ceil(
        canvas.width * constants.RESULT_HEADER_HEIGHT_WIDTH_RATIO);


    const icons_area_margin = icons_area_margin_percentage * canvas.width;
    const icon_split_width = (canvas.width - 2 * icons_area_margin) / icons_per_row;
    const row_height = icon_split_width * constants.RESULT_ICON_ROW_HEIGHT_TO_GRID_SIZE;
    const icon_size = icon_split_width * constants.RESULT_ICON_SIZE_TO_GRID_SIZE;
    const font_size = parseInt(icon_size / 6);

    // draw background
    draw_background({ ctx, canvas });

    // draw header
    
    const username = args.username;
    draw_image_header({ username, ctx, canvas, count: options.length });

    // draw icons

    options.forEach((e, e_i)=>{
        const row = Math.floor(e_i / icons_per_row),
              col = e_i % icons_per_row;

        const target_y0 = prefix_height + row * row_height,
              target_x0 = icons_area_margin + col * icon_split_width;
        ctx.drawImage(
            srcimg,
            0, // sx
            tile_size * e.pos, // sy,
            tile_size,
            tile_size,
            target_x0 + (icon_split_width-icon_size)/2, // dx
            target_y0, // dy
            icon_size,
            icon_size
        );
        ctx.font = `${font_size}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(
            e.text,
            target_x0+icon_split_width/2,
            target_y0+icon_size*1.1,
        );
    });




    let touchstart_time = 0;
    let touching = false;
    let download_touch_timer = null;
    //const canvas = document.getElementById("result");
    //console.log(canvas);
    function start_image_download(){
        if(!touching) return;
        if(
            new Date().getTime() - touchstart_time > 
            constants.RESULT_LONG_PRESS_SAVE_TIME
        ){
            canvas.toBlob(function(blob) {
                saveAs(blob, "result.png");
            });
        } else {
            download_touch_timer = setTimeout(start_image_download, 100);
        }
    }
    function clear_download_timer(){
        if(null == download_touch_timer) return;
        clearTimeout(download_touch_timer);
    }
    canvas.ontouchstart = (e)=>{
        touchstart_time = new Date().getTime();
        touching = true;
        download_touch_timer = setTimeout(start_image_download, 100);
        console.log("set dw touch timer");
        e.preventDefault();
    }
    canvas.ontouchend = canvas.ontouchcancel = (e)=>{
        touching = false;
        clear_download_timer();
        e.preventDefault();
    }
/*    canvas.ontouchcancel = (e)=>{
        touching = false;
        clear_download_timer();
        e.preventDefault();
    }*/
}



