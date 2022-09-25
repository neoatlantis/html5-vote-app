import debugging    from "app/debug.js";
import { countries } from "app/content.js";
import constants     from "app/constants.js";
import utils         from "app/utils";

import CanvasController from "app/canvascontrol.js";
import CanvasButton from "app/canvas-widgets/button.js";
import CountryButton from "./CountryButton.js";
import SelectionLog  from "./log.js";

import { get_image } from "app/resource-loader";

const event_of = require("app/events"); 

//////////////////////////////////////////////////////////////////////////////


class CountriesMenuCanvasController extends CanvasController {

    constructor({canvas, images, bgcontroller, callback, callback_done}){
        super(canvas);
        const self = this;

        this.canvas = canvas;
        this.images = images;
        this.bgcontroller = bgcontroller;
        this.callback = callback;
        this.callback_done = callback_done;

        this.logrender = new SelectionLog({ canvas });

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
            country_button.on("choosen", (()=>{ return function(){
                self.logrender.log(`去过${country_name.slice(0,-2)}`);
            } })());
            this.country_buttons.push(country_button);
        }

    }

    _calc_alpha(dt){
        // Calculate alpha used for country map background, and foreground
        if(undefined === this.alpha_t_count) this.alpha_t_count = 0;

        const COUNTRY_MAP_TRANSITION_T = constants.BACKGROUND_SWITCH_DURATION;
        const FOREGROUND_TRANSITION_T =  500;

        let t1 = COUNTRY_MAP_TRANSITION_T,
            t2 = COUNTRY_MAP_TRANSITION_T + FOREGROUND_TRANSITION_T;
        let t = this.alpha_t_count;

        this.alpha_t_count += dt;

        /*
        if(t <= t1){
            return { map_alpha: t / t1, widget_alpha: 0 };
        } else if (t <= t2){
            return { map_alpha: 1, widget_alpha: (t - t1) / (t2 - t1) };
        } else {
            return { map_alpha: 1, widget_alpha: 1};
        }*/
        if(t <= t1){
            return { map_alpha: t / t1, widget_alpha: t / t1 };
        } else {
            return { map_alpha: 1, widget_alpha: 1};
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

    _draw_bg(dt){ // bgcontroller color bar
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
    }

    _draw_fg(dt){

        let { map_alpha, widget_alpha } = this._calc_alpha(dt); 

        // draw country map
        this.ctx.globalAlpha = map_alpha;
        this.ctx.drawImage(
            this.images["bg"],
            0, 0, this.images["bg"].width, this.images["bg"].height,
            this.map_draw_x,
            0, // sy
            this.map_width,
            this.canvas.height
        );

        // draw country buttons
        this.ctx.globalAlpha = widget_alpha;
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

        // draw log
        this.logrender.draw();

        //draw button
        this.button.draw(this.ctx);



        this.ctx.globalAlpha = 1;
    }

    animation_frame(t, dt){
        // clear whole canvas
        this.ctx_clearall();
        this.ctx_reset_filter();
        // draw bg
        this._draw_bg(dt);
        // draw each icon
        /*this.options_instances.forEach((oi)=>{
            oi.next({ delta_y0: this.delta_y0, t, dt });
        });*/
        
        this._draw_fg(dt);

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

        let touch_tracker = null;

        ec.on("touchstart", (e)=>{
//            console.log("touchstart", e);
            
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
//            console.log("touchend", e.changedTouches);
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
//            console.log("touchmove", e);
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
        "bg": await get_image("countries_bg"),
        "flags": await get_image("countries_flags"),
        "glow": await get_image("icon_glow"),
        "button": await get_image("donebutton"),
        "button-down": await get_image("donebutton_pressed"),
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
