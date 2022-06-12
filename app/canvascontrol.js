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
        this._play_animation();
    }

    stop_animation(){
        this.flag_animation_playing = false;
    }
    
    animation_frame(){
        throw Error("Must override this.");
    }

    bind_events(canvas){
        
    }

    destroy(){
        // stop animation
        this.stop_animation();
        // unbind all events
    }

}


export default CanvasController;
