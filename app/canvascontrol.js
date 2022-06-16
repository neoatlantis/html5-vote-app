import constants    from "app/constants.js";
import utils        from "app/utils.js";



class CanvasController{

    constructor(canvas){
        this.canvas = canvas;
        this._setup_canvas();
        this.bind_events();

        this.ctx = this.canvas.getContext("2d");

        this.flag_animation_playing = false;
        this.flag_exit_animation_done = false;
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

    _play_exit_animation(){
        if(this.flag_exit_animation_done) return;
        requestAnimationFrame(()=>{
            if(!this.exit_animation_frame()){
                this.flag_exit_animation_done = true;
            }
        });
        setTimeout(()=>this._play_exit_animation(), 0);
    }

    start_animation(){
        this.flag_animation_playing = true;
        this.starttime = new Date().getTime();
        this._play_animation();
    }

    async stop_animation(){
        this.flag_animation_playing = false;
    }
    
    animation_frame(){
        throw Error("Must override this.");
    }

    exit_animation_frame(){
        return false; // return true to continue animation
    }

    ctx_reset_transform(){
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    }

    ctx_reset_filter(){
        this.ctx.filter = 'none';
    }

    ctx_clearall(){
        // clear whole canvas
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
        this.ctx.filter = 'none';
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    ctx_drawImage(image, x, y, scale, rotation, ignoreTransform){
        if(!ignoreTransform){
            // skip, when transform was set before
            this.ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
        }
        this.ctx.rotate(rotation);
        this.ctx.drawImage(image, -image.width / 2, -image.height / 2);
    } 

    ctx_drawImageCenter(image, x, y, cx, cy, scale, rotation, ignoreTransform){
        if(!ignoreTransform){
            this.ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
        }
        this.ctx.rotate(rotation);
        this.ctx.drawImage(image, -cx, -cy);
    } 

    bind_events(canvas){
        
    }

    async destroy(){
        // unbind all events
        ["ontouchstart", "ontouchend", "ontouchmove"].forEach((e)=>{
            this.canvas[e] = null;
        });
        // stop animation
        await this.stop_animation();
        // plays exiting animation
        this.flag_exit_animation_done = false;
        this.starttime = new Date().getTime();
        this._play_exit_animation();
        await utils.until(()=>this.flag_exit_animation_done, 10);
    }

}


export default CanvasController;
