import constants    from "app/constants.js";
const event_of = require("app/events.js");
const events = require("events");


class CanvasButton extends events.EventEmitter {

    constructor({
        image,
        image_pressed_down,
        x0, y0,
        x1, y1,
    }){
        super();

        if(x0 < x1){
            this.x0 = x0;
            this.x1 = x1;
        } else {
            this.x0 = x1;
            this.x1 = x0;
        }

        if(y0 < y1){
            this.y0 = y0;
            this.y1 = y1;
        } else {
            this.y0 = y1;
            this.y1 = y0;
        }
        this.image = image;
        this.image_pressed_down = image_pressed_down;

        this.bind_events();
        
        this.hold_down = false;
    }

    is_within_area(x, y){
        return this.x0 <= x && x <= this.x1 && this.y0 <= y && y <= this.y1;
    }


    bind_events(){

        function get_xy(e){
            let touch = e.changedTouches[0];
            let x = touch.clientX * constants.SCALE_FACTOR;
            let y = touch.clientY * constants.SCALE_FACTOR;
            return { x, y };
        }

        event_of("canvas").on("touchstart", (e)=>{
            let { x, y } = get_xy(e);

            if( this.is_within_area(x, y) ){
                this.hold_down = true;
                this.emit("pressed_down", e);
            }
        });

        event_of("canvas").on("touchend", (e)=>{
            let { x, y } = get_xy(e);
            let was_hold_down = this.hold_down;
            this.hold_down = false;

            if(this.is_within_area(x, y) && was_hold_down){
                this.emit("pressed", e);
                e.stopPropagation();
            }
        });
    }

    draw(ctx){
        if(this.hold_down && this.image_pressed_down){
            ctx.drawImage(
                this.image_pressed_down,
                this.x0,
                this.y0,
                this.x1 - this.x0,
                this.y1 - this.y0
            );
            return;
        }
        if(this.image){
            ctx.drawImage(
                this.image,
                this.x0,
                this.y0,
                this.x1 - this.x0,
                this.y1 - this.y0
            );
        }
    }
}

export default CanvasButton;
