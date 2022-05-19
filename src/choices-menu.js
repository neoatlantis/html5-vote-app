const choices = require("./content.js");
const { get_image } = require("./resource-loader.js");
const CanvasOption = require("./canvas-option.js");
const constants = require("./constants");

const initial_position = Math.floor(Math.random()*constants.MENU_CHOICES_PER_ROW);
const position_deltas = choices.map((e)=>Math.floor(Math.random()*2)).map((e)=>e?1:-1);
let current_pos = initial_position;
let choices_positions = [];
for(let i=0; i<choices.length; i++){
    current_pos += position_deltas[i];
    if(current_pos < 0){
        current_pos += constants.MENU_CHOICES_PER_ROW;
    }
    if(current_pos >= constants.MENU_CHOICES_PER_ROW){
        current_pos -= constants.MENU_CHOICES_PER_ROW;
    }
    choices_positions.push(current_pos);
}

//////////////////////////////////////////////////////////////////////////////


module.exports = async function init(canvas, callback){
    
    const options_image = await get_image("options");



    const scrollspeed = canvas.height / 1000;

    const row_size = Math.round(canvas.width / 4);
    const ctx = canvas.getContext("2d");


    const options_instances = choices.map((choice, choice_i)=>{
        return new CanvasOption({
            choice_id: choice.id,
            text: choice.text,
            image_id: choice.pos,
            image_src: options_image,
            row: choice_i,
            col: choices_positions[choice_i],
            size: row_size,
            ctx: ctx,
            canvas_height: canvas.height,
        });
    });


    const delta_y0_min = canvas.height - row_size * options_instances.length;
    const delta_y0_max = canvas.height / 2;
    let delta_y0 = delta_y0_max; //0;
    console.log(delta_y0);
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
        if(delta_y0 > delta_y0_max){
            delta_y0 = delta_y0_max;
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

        let selected_ids = options_instances    
            .filter((oi)=>oi.choosen)
            .map((oi)=>oi.choice_id)
        ;
        try{
            callback(selected_ids);
        } catch(e){
        }
    }




    let touchscrolled = false;
    let touch_lasty = 0;
    canvas.ontouchstart = (e)=>{
        autoscroll = false;
        touchscrolled = false;
        delta_y0_scroll = 0;
        touch_lasty = e.changedTouches[0].clientY;
        e.preventDefault();
    }

    canvas.ontouchend = (e)=>{
        autoscroll = true;

        if(!touchscrolled){
            // touch-"clicked" something
            let touch = e.changedTouches[0];
            on_click(
                touch.clientX * constants.SCALE_FACTOR,
                touch.clientY * constants.SCALE_FACTOR
            );
        }

        delta_y0_scroll = 0;
        e.preventDefault();
    }

    canvas.ontouchmove = (e)=>{
        if(autoscroll) return;
        touchscrolled = true;

        const currenty = e.changedTouches[0].clientY;
        delta_y0_scroll += (currenty - touch_lasty) * constants.SCALE_FACTOR;
        touch_lasty = currenty;
        e.preventDefault();
    }
}
