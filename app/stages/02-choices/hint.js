class Hint {

    constructor({ canvas, image }){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.image = image;

        this.width = canvas.width * 0.3444;
        this.height = image.height / image.width * this.width;
        this.left = canvas.width * 0.6809 - this.width / 2;
        this.top =  canvas.width * 0.1995 - this.height / 2; 

        this.started = false;
    }

    start(){
        this.started = true;
    }

    draw(t, dt){
        if(!this.started) return;
        const ctx = this.ctx;
        if(undefined === this.t0) this.t0 = t;
        const elapsed_t = t - this.t0;
        const duration = 5000;

        if(elapsed_t < duration){
            ctx.globalAlpha = 1 - elapsed_t / duration;
            this.ctx.drawImage(
                this.image,
                this.left,
                this.top,
                this.width,
                this.height
            );
        }

        ctx.globalAlpha = 1;
    }

}

export default Hint;
