class Stage2Physics {

    /*
     * Physical model of the options menu.
     *
     * A mass slides on Y-axis. Higher is the Y+ direction.
     * - The mass experiences a float force
     * - The mass experiences no gravity
     * - The friction force is always in the opposite direction of velocity,
     *   and is given by F_friction = friction_coeff * v^2
     * - 
     */

    constructor({ y_min, y_max, end_speed }){

        this.y_max = y_max;
        this.y_min = y_min;
        this.end_speed = end_speed;

        console.log("end speed:", this.end_speed)

        this.y = y_min;

        this.m = 10;
        this.v = 0;

        this.friction_coeff = 0.04;
        this.border_K = 0.00002;
        
    }

    change_v(nv){
        if(Math.abs(nv) > 10 * this.end_speed) return;
        this.v = nv;
    }

    add_y(dy){
        this.y += dy;
    }

    calculate(dt){
        const Fs = [
            this.F_float(),
            this.F_friction(),
            this.F_border(), // border spring force
        ];
        //console.log(Fs);
        let F_sum = 0;
        for(let i=0; i<Fs.length; i++) F_sum += Fs[i];

        let a = F_sum / this.m;
        let dv = a * dt;

        this.y += this.v * dt;

        this.v += dv;

        //console.log("speed", this.v / this.end_speed * 100, "%");
    }

    F_float(){
        return this.friction_coeff * this.end_speed * this.end_speed;
    }

    F_friction(){
        let f = this.v * this.v * this.friction_coeff;
        return (this.v > 0 ? -f : f);
    }

    F_border(){
        if(this.y > this.y_max){
            return - (this.y - this.y_max) * this.border_K;
        }
        if(this.y < this.y_min){
            return (this.y_min - this.y) * this.border_K;
        }
        return 0;
    }
}

export default Stage2Physics;
