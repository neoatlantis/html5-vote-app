const constants = require("./constants.js");
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
}


module.exports = {
    setup_canvas
}
