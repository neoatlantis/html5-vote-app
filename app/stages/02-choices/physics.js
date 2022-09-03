class Stage2AutoRoller {

    /*
     * This is the calculation function for stage 2, responsible for
     * calculating vertical canvas rolling effect. It does a few things:
     *
     * 1. When disengaged, it does nothing and lets the user scroll the canvas
     *    manually.
     * 2. When engaged (user finger leaves the canvas), either begins auto
     *    scrolling, when canvas position is currently within margin, or it
     *    moves the canvas back to border if the user has moved it outside
     *    valid range.
     * 3. In the latter case, canvas is returned to border following an
     *    exponential relationship with time.
     */


    constructor({ y_upper, y_lower, speed }){
        this.y_upper = y_upper;
        this.y_lower = y_lower;
        this.speed = speed;
        this.flying = false; // if flying back to valid range

        this.y = this.y_lower;
    }

    analyze(){
        let at_lower_border = Math.abs(this.y / this.y_lower - 1) < 0.002;
        let at_upper_border = Math.abs(this.y / this.y_upper - 1) < 0.002;
        let out_of_border =
            (!at_lower_border && !at_upper_border) && 
            (this.y > this.y_to || this.y < this.from);
        let beyond_upper_border = out_of_border && this.y > this.y_to;
        let below_lower_border = out_of_border && this.y < this.y_from;

        return {
            out_of_border, 
            at_lower_border,
            at_upper_border,
            beyond_upper_border,
            below_lower_border,
        }
    }

    calculate(dt){
        const {
            out_of_border, 
            at_lower_border,
            at_upper_border,
            beyond_upper_border,
            below_lower_border,
        } = this.analyze();
        if(this.flying){
            if(at_upper_border){
                this.flying = false;
                return;
            }
            
        } else {
            if(beyond_upper_border){
                this.y = this.y_upper;
                return;
            }
            if(below_lower_border){
                this.y = this.y_lower;
                return;
            }
            this.y += dt * this.speed;
        }
    }

    add_y(v){
        this.y += v;
    }
}

export default Stage2AutoRoller;
