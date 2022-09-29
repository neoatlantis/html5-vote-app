import constants    from "app/constants.js";
import persist      from "app/persist.js";
const events = require("events");



class CountryButton extends events.EventEmitter{
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
        app,
        image_glow,
        text,
        x, y, // center of hexagon on a scaled map image
        size, // length of a side for a hexagon
        controller, // needed to convert from "user touch coordinate on screen" to "absolute coordinate on scaled image"
    }){
        super();

        this.persist_id = "country-" + text;

        this.app = app;
        this.x0 = x;
        this.y0 = y;
        this.text = text;
        this.size = size;
        this.controller = controller; // CountriesMenuCanvasController
        this.image_glow = image_glow;

        const w1 = size * 0.8660254;
        this.polygon = [
            [x + w1, y+size/2],
            [x, y + size],
            [x - w1, y+size/2],
            [x - w1, y-size/2],
            [x, y - size],
            [x + w1, y-size/2],
        ];

        this.image_glow_size_h = (this.size * 2) * 1.463;
        this.image_glow_size_w = 
            this.image_glow_size_h / this.image_glow.height
            * this.image_glow.width
        ;
        
        // If this option is choosen
        this.choosen = persist.get(this.persist_id); //false;
    }

    set_choosen(v){
        this.choosen = v;
        persist.set(this.persist_id, this.choosen);
    }

    draw(ctx){
        if(!this.choosen) return;

        ctx.drawImage(
            this.image_glow,
            this.x0 + this.controller.map_draw_x - this.image_glow_size_w / 2,
            this.y0 - this.image_glow_size_h / 2,
            this.image_glow_size_w,
            this.image_glow_size_h
        );

    }

    is_within_area(x, y){
        // x & y is screen coordinate, the X coordinate must be converted
        // to image coordinate, by substracting it with the offset of image
        // left border.
        // Since the image left border is dragable by user touch, we have to
        // use the controller's actual value of this offset. 
        x -= this.controller.map_draw_x;

//        console.log(x, y);

        // Special calculation for a hexagon
        // ray-casting algorithm based on
        // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
        var inside = false;
        var vs = this.polygon;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0], yi = vs[i][1];
            var xj = vs[j][0], yj = vs[j][1];
            
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        
        return inside;
    }

    handle_click(x, y){
        if(!this.is_within_area(x, y)) return;
        this.app.play_touch_icon_audio();
        this.set_choosen(!this.choosen);

        if(this.choosen){
            this.emit("choosen", this.text);
        }
    }



}




export default CountryButton;
