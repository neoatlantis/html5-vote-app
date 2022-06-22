import constants    from "app/constants.js";
const event_of = require("app/events.js");
const events = require("events");


class CanvasButton extends events.EventEmitter {

    constructor({
        image,
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
        
        event_of("canvas").on("touchend", (e)=>{
            let touch = e.changedTouches[0];
            let x = touch.clientX * constants.SCALE_FACTOR;
            let y = touch.clientY * constants.SCALE_FACTOR;

            if(
                this.x0 <= x && x <= this.x1 && 
                this.y0 <= y && y <= this.y1
            ){
                this.emit("clicked", e);
            }
        });
    }

    draw(ctx){
        ctx.drawImage(
            this.image,
            this.x0,
            this.y0,
            this.x1 - this.x0,
            this.y1 - this.y0
        );
    }
}

export default CanvasButton;
