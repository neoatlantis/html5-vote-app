import debugging    from "app/debug.js";
import { countries } from "app/content.js";
import constants     from "app/constants.js";
import utils         from "app/utils";

import CanvasController from "app/canvascontrol.js";
import CanvasButton from "app/canvas-widgets/button.js";
import CountryButton from "./CountryButton.js";

import { get_image } from "app/resource-loader.js";

const event_of = require("app/events"); 

//////////////////////////////////////////////////////////////////////////////


class CountriesMenuCanvasController extends CanvasController {

    constructor({canvas, images, bgcontroller, callback, callback_done}){
        super(canvas);

        this.canvas = canvas;
        this.images = images;
        this.bgcontroller = bgcontroller;
        this.callback = callback;
        this.callback_done = callback_done;

        // button ref: horizontal: right, vertical: middle
        this.button_ref_x = this.canvas.width * 0.563;
        this.button_ref_y = this.canvas.height * 0.875;
        this.scale_button = this.canvas.width / this.images["button"].width * 0.25;
        this.button = new CanvasButton({
            image: this.images["button"],
            image_pressed_down: this.images["button-down"],
            x0: this.button_ref_x - this.scale_button * this.images["button"].width,
            y0: this.button_ref_y - this.scale_button * this.images["button"].height / 2,
            x1: this.button_ref_x,
            y1: this.button_ref_y + this.scale_button * this.images["button"].height / 2,
        });

        // Determine map size
        // map image is scaled up or down to fit the height, and its width
        // is expanded outside the screen
        this.image_map_scale = this.canvas.height / this.images["bg"].height;
        this.map_width = this.images["bg"].width * this.image_map_scale; // > screen width

        this.map_draw_x = this.canvas.width / 2 - this.map_width / 2;


        // initial country buttons
        this.country_buttons = [];
        for(let country_name in countries){
            let country_button = new CountryButton({
                image_glow: this.images["glow"],
                controller: this,
                text: country_name,
                x: countries[country_name][0] * this.image_map_scale,
                y: countries[country_name][1] * this.image_map_scale,
                size: constants.COUNTRY_HEXAGON_SIZE * this.image_map_scale,
            });
            this.country_buttons.push(country_button);
        }

    }

    _drag_map(delta){

        const low_bound = this.canvas.width - this.map_width;
        const upper_bound = 0;
        
        this.map_draw_x += delta;
        if(this.map_draw_x < low_bound){
            this.map_draw_x = low_bound;
        }
        if(this.map_draw_x > upper_bound){
            this.map_draw_x = upper_bound;
        }

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
        ); // global background

        this.ctx.drawImage(
            this.images["bg"],
            0, 0, this.images["bg"].width, this.images["bg"].height,
            this.map_draw_x,
            0, // sy
            this.map_width,
            this.canvas.height
        ); // stage background (countries)
    }

    _draw_fg(){

        this.country_buttons.forEach((cb)=>{
            cb.draw(this.ctx);
        });

        this.ctx.drawImage(
            this.images["flags"],
            0, 0, this.images["flags"].width, this.images["flags"].height,
            this.map_draw_x,
            0, // sy
            this.map_width,
            this.canvas.height
        );

    }

    animation_frame(t, dt){
        // clear whole canvas
        this.ctx_clearall();
        // draw bg
        this._draw_bg();
        // draw each icon
        /*this.options_instances.forEach((oi)=>{
            oi.next({ delta_y0: this.delta_y0, t, dt });
        });*/
        this.ctx_reset_filter();

        this._draw_fg();

        //draw button
        this.button.draw(this.ctx);
        // clear header region
//        this.ctx.clearRect(0, 0, this.canvas.width, HEADER_HEIGHT);*/
        return true;
    }

    bind_events(){
        const ec = event_of("canvas");

        function on_click(x, y){
            // handle a touch-click or mouseclick event
            this.country_buttons.forEach((cb)=>cb.handle_click(x, y));
            let selected_countries = this.country_buttons
                .filter((cb)=>cb.choosen)
                .map((cb)=>cb.text)
            ;
            try{
                this.callback(selected_countries);
            } catch(e){
            }
        }

        /*let touchscrolled = false;
        let touch_lastx = 0;
        ec.on("touchstart", (e)=>{
            touchscrolled = false;
            touch_lastx = e.changedTouches[0].clientX;
            e.preventDefault();
        });

        ec.on("touchend", (e)=>{

            if(!touchscrolled){
                // touch-"clicked" something
                let touch = e.changedTouches[0];
                on_click.call(
                    this,
                    touch.clientX * constants.SCALE_FACTOR,
                    touch.clientY * constants.SCALE_FACTOR
                );
            }

            e.preventDefault();
        });

        ec.on("touchmove", (e)=>{
            touchscrolled = true;
            const currentx = e.changedTouches[0].clientX;
            
            this._drag_map((currentx - touch_lastx) * constants.SCALE_FACTOR);
            
            touch_lastx = currentx;
            e.preventDefault();
        });*/


        let touch_tracker = null;

        ec.on("touchstart", (e)=>{
            console.log("touchstart", e);
            
            touch_tracker = new utils.CanvasGestureTracker();
            for(let i =0; i<e.changedTouches.length; i++){
                let t = e.changedTouches[i];
                touch_tracker.register_down(
                    t.clientX * constants.SCALE_FACTOR,
                    t.clientY * constants.SCALE_FACTOR
                );
            }

            e.preventDefault();
        });

        ec.on("touchend", (e)=>{
            console.log("touchend", e.changedTouches);
            if(!touch_tracker) return;
            for(let i =0; i<e.changedTouches.length; i++){
                let t = e.changedTouches[i];
                touch_tracker.register_up(
                    t.clientX * constants.SCALE_FACTOR,
                    t.clientY * constants.SCALE_FACTOR
                );
            };

            let { duration, distance, delta_t } = touch_tracker.result();
            let touch = e.changedTouches[0];

            if(Math.abs(distance / this.canvas.width) < 0.05){
                console.log("touch press triggered");
                on_click.call(
                    this,
                    touch.clientX * constants.SCALE_FACTOR,
                    touch.clientY * constants.SCALE_FACTOR
                );
            }

            touch_tracker = null;
            e.preventDefault();
        });

        ec.on("touchmove", (e)=>{
            console.log("touchmove", e);
            if(!touch_tracker) return;

            for(let i =0; i<e.changedTouches.length; i++){
                let t = e.changedTouches[i];
                let { delta_x, delta_y, delta_t } = touch_tracker.register_move(
                    t.clientX * constants.SCALE_FACTOR,
                    t.clientY * constants.SCALE_FACTOR
                );
                this._drag_map(-delta_x);
            };
            e.preventDefault();
        });
        


        this.button.on("pressed", (e)=>{
            this.callback_done(
                this.country_buttons.filter((b)=>b.choosen).map((b)=>b.text));
            e.preventDefault();
            e.stopPropagation();
        });


    }
}






//////////////////////////////////////////////////////////////////////////////

async function interaction({
    canvas,
    callback,
    callback_done,
    bgcontroller,
    app
}){
   
    const images = {
        "bg": await get_image("countries-bg"),
        "flags": await get_image("countries-flags"),
        "glow": await get_image("countries-glow"),
        "button": await get_image("donebutton"),
        "button-down": await get_image("donebutton-down"),
    };

    const canvascontrol = new CountriesMenuCanvasController({
        canvas,
        images,
        bgcontroller,
        callback,
        callback_done,
    });
    canvascontrol.start_animation();

    /// #if DEV
    if(debugging()){
        if(debugging('stage') && debugging('stage') > 3){
            callback_done();
        }
    }
    /// #endif
    
    await utils.until(()=>app.countries_done === true);

    bgcontroller.scroll_to_stage(3);
    await canvascontrol.destroy();

}




//////////////////////////////////////////////////////////////////////////////
export default {
    interaction,
}
