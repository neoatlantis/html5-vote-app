/*import "./svg.option.js";
import "./svg.button.js";
import "./scrolling.js";
*/
import { choices } from "./content.js";
const choices_positions = choices.map((e)=>Math.floor(Math.random()*3));


async function load_options_image(){
    return new Promise((resolve, reject)=>{
        const img = new Image();
        img.src = "./images/options.png";
        img.onload = ()=>resolve(img);
    });
}




class CanvasOption{
    /*
     *      |<--size-->|
     *      +----------+----------+----------+ --|
     *      |   col 0  |   col 1  |  col 2   |   | size
     *      +----------+----------+----------+ --|
     *      |          |          |          |
     *      +----------+----------+----------+
     *      |          |          |          |
     *      +----------+----------+----------+
     *      |          |          |          |
     *      +----------+----------+----------+
     */

    constructor({
        text,
        image_id,
        image_src,
        row,
        col,
        size,
        ctx,
        canvas_height
    }){
        this.text = text;
        this.image_id = 0;
        this.image_src = image_src;
        this.image_tile_size = 360;

        this.row = row;
        this.col = col;

        this.size = size;
        this.ctx = ctx;

        this.canvas_height = canvas_height;

        // Oscillating effect

        this.osc_A = this.size * 0.70;
        this.osc_t = 0;
        this.osc_T = 2000;
        this.osc_t0 = new Date().getTime();
        this.osc_p0 = Math.random() * 2 * Math.PI;

        // Standard position in target canvas, not changing
        this.y0 = this.row * this.size;
        this.x0 = this.osc_A + this.size/2 + (this.col * (this.size-2*this.osc_A)) / 3

        // Standard position in source canvas
        this.sx0 = 0;
        this.sy0 = this.image_id * this.image_tile_size;


        // Actual position in target canvas, updated by next()
        this.x = this.x0;
        this.y = this.y0;


        // If this option is choosen
        this.choosen = false;
    }

    drawImage({ delta_y0, nowtime }){
        const target_x0 = this.x0;
        const target_y0 = this.y0 + delta_y0;

        if(target_y0 + this.size < 0) return;
        if(target_y0 > this.canvas_height) return;

        const osc_dx = this.osc_A * Math.sin(this.osc_p0 + (nowtime - this.osc_t0)/this.osc_T);

        this.x = target_x0 + osc_dx;
        this.y = target_y0;
        if(!this.choosen){
            this.ctx.filter = 'grayscale(100%)';
        } else {
            this.ctx.filter = 'none';
        }
        this.ctx.drawImage(
            this.image_src,
            this.sx0,
            this.sy0, 
            this.image_tile_size,
            this.image_tile_size,
            this.x,
            this.y,
            this.size,
            this.size
        );
    }

    next({ delta_y0, nowtime }){
        this.drawImage({ delta_y0, nowtime });
    }

    handle_click(x, y){
        if(
            (this.x <= x && x <= this.x + this.size) &&
            (this.y <= y && y <= this.y + this.size)
        ){  
            console.log(this.text);
            this.choosen = !this.choosen;
        }
    }
}






async function init(){


    const options_image = await load_options_image();


    const canvas = document.getElementById("options");

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const scrollspeed = canvas.height / 500;

    const row_size = Math.round(canvas.width / 3);
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

init();

/*

const app = new Vue({
    el: "#app",
    data: {
        show_result: false,
        ready: false,

        choices: choices,
        choices_positions: choices_positions,
        

    },

    computed: {
        selected_choices: function(){
            return this.choices.filter(e=>e.selected);
        }
    },

    methods: {
        on_choice_select: function(id, selected){
            this.choices.filter((e)=>e.id==id)[0].selected = selected;
            this.choices = JSON.parse(JSON.stringify(this.choices));
        },
        on_finished: function(){
            this.show_result = true;
        },

    
    }
});


setTimeout(()=>app.ready=true, 1000);*/
