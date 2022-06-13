import constants    from "app/constants.js";



class CanvasController{

    constructor(canvas){
        this.canvas = canvas;
        this._setup_canvas();
        this.bind_events();

        this.ctx = this.canvas.getContext("2d");

        this.flag_animation_playing = false;
    }

    _setup_canvas(width, height) {
        // width & height: css display size
        if(!width || !height){
            const rect = this.canvas.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
        }
        
        // Set up CSS size.
        this.canvas.style.width  = width + 'px';
        this.canvas.style.height = height + 'px';

        // Resize canvas and scale future draws.
        this.canvas.width = Math.ceil(width * constants.SCALE_FACTOR);
        this.canvas.height = Math.ceil(height * constants.SCALE_FACTOR);
        //var ctx = canvas.getContext('2d');
        //ctx.scale(scaleFactor, scaleFactor);
    }

    _play_animation(){
        if(!this.flag_animation_playing) return;
        requestAnimationFrame(()=>this.animation_frame());
        setTimeout(()=>this._play_animation(), 0);
    }

    start_animation(){
        this.flag_animation_playing = true;
        this.starttime = new Date().getTime();
        this._play_animation();
    }

    stop_animation(){
        this.flag_animation_playing = false;
    }
    
    animation_frame(){
        throw Error("Must override this.");
    }

    ctx_clearall(){
        // clear whole canvas
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // rest transform
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    ctx_drawImage(image, x, y, scale, rotation){
        this.ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
        this.ctx.rotate(rotation);
        this.ctx.drawImage(image, -image.width / 2, -image.height / 2);
    } 

    ctx_drawImageCenter(image, x, y, cx, cy, scale, rotation){
        this.ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
        this.ctx.rotate(rotation);
        this.ctx.drawImage(image, -cx, -cy);
    } 

    bind_events(canvas){
        
    }

    destroy(){
        // stop animation
        this.stop_animation();
        // unbind all events
        ["ontouchstart", "ontouchend", "ontouchmove"].forEach((e)=>{
            this.canvas[e] = null;
        });
    }

}


export default CanvasController;
