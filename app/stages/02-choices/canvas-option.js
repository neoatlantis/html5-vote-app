import constants    from "app/constants.js";




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
        app,
        choice_id,
        text,
        image_id,
        image_src,
        row,
        col,
        size,
        row_height,
        ctx,
        canvas_height,
        canvas_width,
    }){
        this.app = app;

        this.choice_id = choice_id;
        this.text = text;
        this.image_id = image_id;
        this.image_src = image_src;
        this.image_tile_size = constants.RESOURCE_ICON_TILE_SIZE;

        this.row = row;
        this.col = col;

        this.size = size;
        this.row_height = canvas_width * constants.MENU_CHOICE_ROW_HEIGHT;

        this.ctx = ctx;

        this.canvas_height = canvas_height;

        // Oscillating effect

        this.osc_A = canvas_width * constants.MENU_CHOICE_OSC_A_TO_W;
        this.osc_t = 0;
        this.osc_T = constants.MENU_CHOICE_OSC_T;
        this.osc_t0 = -1;
        this.osc_p0 = Math.random() * 2 * Math.PI;
        this.osc_reset = ()=>{
            this.osc_t0 = -1;
            this.osc_p0 = 0;
        }

        // Standard position in target canvas, not changing
        this.y0 = this.row * this.row_height;
        this.x0 = canvas_width * (
            constants.MENU_CHOICES_MARGIN_X +
            constants.MENU_CHOICES_COL_CENTER[this.col]
        );

        // Standard position in source canvas
        this.sx0 = Math.floor(this.image_id / 10) * this.image_tile_size;
        this.sy0 = (this.image_id % 10) * this.image_tile_size;


        // Actual position in target canvas, updated by next()
        this.x = this.x0;
        this.y = this.y0;


        // If this option is choosen
        this.choosen = false;

        // When choosen, play a short animation moving the icon from wherever
        // to the standard position given by (this.x0, this.y0). Need a flag
        // to mark this.
        this.animating_to_origin = false;
    }

    drawImage({ delta_y0, t, dt }){
        const target_x0 = this.x0;
        const target_y0 = this.y0 + delta_y0;

        if(target_y0 + this.size < 0) return;
        if(target_y0 > this.canvas_height) return;

        this.y = target_y0;

        if(this.osc_t0 < 0) this.osc_t0 = t; // record initial time
        
        if(this.animating_to_origin){
            const move_dx = target_x0 - this.x;
            const move_err = 5;
            if(Math.abs(move_dx) < move_err){
                // no need to animate anymore
                this.animating_to_origin = false;
                this.osc_reset();
            } else {
                this.x += move_dx/10;
            }
        } else if(!this.choosen){
            const osc_dx = this.osc_A * Math.sin(this.osc_p0 + (t - this.osc_t0)/this.osc_T);
            this.x = target_x0 + osc_dx;
        }
        
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

    next({ delta_y0, t, dt }){
        this.drawImage({ delta_y0, t, dt });
    }

    handle_click(x, y){
        if(
            (this.x <= x && x <= this.x + this.size) &&
            (this.y <= y && y <= this.y + this.size)
        ){  
            console.log(this.text);
            this.app.play_touch_audio();

            this.choosen = !this.choosen;
            if(this.choosen){
                this.animating_to_origin = true;
            } else {
                this.osc_reset();
            }
        }
    }
}




export default CanvasOption;
