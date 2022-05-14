
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

        this.osc_A = this.size * 0.5;
        this.osc_t = 0;
        this.osc_T = 2000;
        this.osc_t0 = new Date().getTime();
        this.osc_p0 = Math.random() * 2 * Math.PI;
        this.osc_reset = ()=>{
            this.osc_t0 = new Date().getTime();
            this.osc_p0 = 0;
        }

        // Standard position in target canvas, not changing
        this.y0 = this.row * this.size;
        this.x0 = this.size/2 + this.size * this.col;

        // Standard position in source canvas
        this.sx0 = 0;
        this.sy0 = this.image_id * this.image_tile_size;


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

    drawImage({ delta_y0, nowtime }){
        const target_x0 = this.x0;
        const target_y0 = this.y0 + delta_y0;

        if(target_y0 + this.size < 0) return;
        if(target_y0 > this.canvas_height) return;

        this.y = target_y0;
        
        if(this.choosen && this.animating_to_origin){
            const move_dx = target_x0 - this.x;
            const move_err = 5;
            if(Math.abs(move_dx) < move_err){
                // no need to animate anymore
                this.animating_to_origin = false;
            } else {
                this.x += move_dx/10;
            }
        } else if(!this.choosen){
            const osc_dx = this.osc_A * Math.sin(this.osc_p0 + (nowtime - this.osc_t0)/this.osc_T);
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
            if(this.choosen){
                this.animating_to_origin = true;
            } else {
                this.osc_reset();
            }
        }
    }
}




module.exports = CanvasOption;
