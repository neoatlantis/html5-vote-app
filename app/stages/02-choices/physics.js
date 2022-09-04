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
        this.disengaged = false; // if true, no auto scroll
        this.new_engage = true;

        this.y = this.y_lower;
    }

    disengage(){
        this.disengaged = true;
    }

    engage(){
        this.disengaged = false;
        this.new_engage = true;
    }

    analyze(){
        let at_lower_border = Math.abs(this.y / this.y_lower - 1) < 0.0001;
        let at_upper_border = Math.abs(this.y / this.y_upper - 1) < 0.0001;
        let out_of_border =
            (!at_lower_border && !at_upper_border) && 
            (this.y > this.y_upper || this.y < this.y_lower);
        let beyond_upper_border = out_of_border && this.y > this.y_upper;
        let below_lower_border = out_of_border && this.y < this.y_lower;

        return {
            out_of_border, 
            at_lower_border,
            at_upper_border,
            beyond_upper_border,
            below_lower_border,
        }
    }

    calculate(dt){
        if(this.disengaged) return;

        const {
            out_of_border, 
            at_lower_border,
            at_upper_border,
            beyond_upper_border,
            below_lower_border,
        } = this.analyze();
        if(this.flying){
            if(at_upper_border || at_lower_border || !out_of_border){
                console.log("flew back", at_upper_border, at_lower_border, out_of_border, this.y, this.y_lower, this.y_upper);
                this.flying = false;
                return;
            }
            let distance = 0;
            if(beyond_upper_border){
                distance = this.y_upper - this.y;
            }
            if(below_lower_border){
                distance = this.y_lower - this.y
            }
            this.y += distance * (1-Math.pow(2, -dt/500));
        } else {
            if(
                (beyond_upper_border || below_lower_border) &&
                this.new_engage
            ){
                // start flying
                this.flying = true;
                this.new_engage = false;
                console.log("move out of range, fly back");
                console.log("fly start", at_upper_border, at_lower_border, out_of_border, this.y, this.y_lower, this.y_upper);
                return;
            }
            if(out_of_border || at_upper_border){
                if(beyond_upper_border){
                    this.y = this.y_upper;
                    return;
                }
                if(below_lower_border){
                    this.y = this.y_lower;
                    return;
                }
            } else {
                this.y += dt * this.speed;
            }
        }
    }

    add_y(v){
        this.y += v;
    }

    
    set_y(v){
        this.y = v;
    }

}

export default Stage2AutoRoller;
