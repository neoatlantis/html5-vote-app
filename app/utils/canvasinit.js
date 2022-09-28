import constants    from "app/constants.js";
import event_of     from "app/events";



function bind_canvas_event_emitters(canvas){
    const ec = event_of("canvas");

    canvas.ontouchstart = (e)=>{
        ec.emit("touchstart", e);
    };
    
    canvas.ontouchmove = (e)=>{
        ec.emit("touchmove", e);
    };

    canvas.ontouchend = (e)=>{
        ec.emit("touchend", e);
    };
    
}


function setup_canvas(canvas, width, height) {
    // width & height: css display size
    if(!width || !height){
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
    }
    
    // Set up CSS size.
    canvas.style.width  = width + 'px';
    canvas.style.height = height + 'px';

    // Resize canvas and scale future draws.
    canvas.width = Math.ceil(width * constants.SCALE_FACTOR);
    canvas.height = Math.ceil(height * constants.SCALE_FACTOR);
    //var ctx = canvas.getContext('2d');
    //ctx.scale(scaleFactor, scaleFactor);

    const ctx = canvas.getContext("2d");
    //ctx.imageSmoothingEnabled = false;

    bind_canvas_event_emitters(canvas);
}

export default setup_canvas;
