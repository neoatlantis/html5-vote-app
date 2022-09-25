class SelectionLog {

    constructor({ canvas, nmax=4 }){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this._log = []; // 0-newest, n-oldest
        this.nmax = nmax;

        this.right = canvas.width * 0.9685;
        this.top = canvas.height * 0.075;
        this.fontsize = this.canvas.width * 0.04;
        this.lineheight = this.fontsize * 1.25;
    }

    log(text){
        this._log.unshift(text);
        this._log.splice(this.nmax);
    }

    draw(){
        const ctx = this.ctx;

        ctx.font = `${this.fontsize}px font_badge`;
        ctx.fillStyle = "white";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";

        let d_alpha = (0.2 - 1.0) / this._log.length;

        for(let i=0; i<this._log.length; i++){
            let text = this._log[i];
            ctx.globalAlpha = 1 + d_alpha * i;
            ctx.fillText(
                text,
                this.right,
                this.top + i * this.lineheight
            );
        }

        ctx.globalAlpha = 1;
    }

}

export default SelectionLog;
