const choices = require("./content.js");
const choices_positions = choices.map((e)=>Math.floor(Math.random()*3));
const { get_image } = require("./resource-loader.js");
const CanvasOption = require("./canvas-option.js");



//////////////////////////////////////////////////////////////////////////////


module.exports = async function init(canvas){
    
    const options_image = await get_image("options");



    const scrollspeed = canvas.height / 500;

    const row_size = Math.round(canvas.width / 4);
    const ctx = canvas.getContext("2d");


    const options_instances = choices.map((choice, choice_i)=>{
        return new CanvasOption({
            text: choice.text,
            image_id: 0,
            image_src: options_image,
            row: choice_i,
            col: choices_positions[choice_i],
            size: row_size,
            ctx: ctx,
            canvas_height: canvas.height,
        });
    });


    const delta_y0_min = canvas.height - row_size * options_instances.length;
    let delta_y0 = 0;
    let delta_y0_scroll = false;
    let autoscroll = true;
    function draw(){
        const nowtime = new Date().getTime();

        if(autoscroll){
            delta_y0 -= scrollspeed;
        }
        delta_y0 += delta_y0_scroll;
        delta_y0_scroll = 0;

        if(delta_y0 < delta_y0_min){
            delta_y0 = delta_y0_min;
        }
        if(delta_y0 > 0){
            delta_y0 = 0;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        options_instances.forEach((oi)=>{
            oi.next({ delta_y0: delta_y0, nowtime: nowtime });
        });
        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);


    function on_click(x, y){
        // handle a touch-click or mouseclick event
        options_instances.forEach((oi)=>oi.handle_click(x, y));
    }




    let touchscrolled = false;
    let touch_lasty = 0;
    canvas.ontouchstart = (e)=>{
        autoscroll = false;
        touchscrolled = false;
        delta_y0_scroll = 0;
        touch_lasty = e.changedTouches[0].clientY;
    }

    canvas.ontouchend = (e)=>{
        autoscroll = true;

        if(!touchscrolled){
            // touch-"clicked" something
            let touch = e.changedTouches[0];
            on_click(touch.clientX, touch.clientY);
        }

        delta_y0_scroll = 0;
    }

    canvas.ontouchmove = (e)=>{
        if(autoscroll) return;
        touchscrolled = true;

        const currenty = e.changedTouches[0].clientY;
        delta_y0_scroll += (currenty - touch_lasty);
        touch_lasty = currenty;
    }
}
