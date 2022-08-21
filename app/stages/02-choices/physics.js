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

    constructor({ y_min, y_max, end_speed, screen_height }){

        this.screen_height = screen_height;
        this.y_max = y_max / this.screen_height;
        this.y_min = y_min / this.screen_height;
        this.end_speed = end_speed / this.screen_height;

        console.log("end speed:", this.end_speed)
        console.log(this.y_min ,this.y_max);

        this.y = this.y_min;

        this.m = 0.001;
        this.v = 0;

        this.friction_coeff = 0.01;
        this.border_K = 0.001;
        

        this.max_force = Math.abs(this.F_float()) * 100;
    }

    limit_force(f){
        if(Math.abs(f) > this.max_force) return Math.sign(f) * this.max_force;
        return f;
    }

    change_v(nv){
        if(Math.abs(nv) > 10 * this.end_speed * this.screen_height) return;
        this.v = nv / this.screen_height;
    }

    add_y(dy){
        this.y += (dy / this.screen_height);
    }

    read_real_y(){
        return this.y * this.screen_height;
    }

    calculate(dt){
        const Fs = [
            this.F_float(),
            this.F_friction(),
            this.F_border(), // border spring force
        ];
        //console.log(Fs);
        let F_sum = 0;
        for(let i=0; i<Fs.length; i++) F_sum += this.limit_force(Fs[i]);

        let a = F_sum / this.m;
        let dv = a * dt;

        this.y += this.v * dt;

        this.v += dv;

        /*console.log(Fs);
        console.log(
            "speed", this.v / this.end_speed * 100, "%",
            "y", this.y,
        );*/
    }

    F_float(){
        return this.friction_coeff * Math.pow(this.end_speed, 2);
    }

    F_friction(){
        let f = 0;
        if(this.v <= this.end_speed){
            f = Math.abs(Math.pow(this.v, 2) * this.friction_coeff);
        } else {
            f = Math.pow(2, (this.v / this.end_speed - 1)) * this.v * this.v * this.friction_coeff;
        }
        return - Math.sign(this.v) * f;
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
