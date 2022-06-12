import constants    from "app/constants.js";

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


// https://blog.openreplay.com/forever-functional-waiting-with-promises
const until = (fn, time = 1000) => {
  try {                                 /* [1] */
    if (fn()) {
      return Promise.resolve(true);
    } else {
      return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
          try {                         /* [2] */ 
            if (fn()) {
              clearInterval(timer);
              resolve(true);
            }
          } catch (e) {                 /* [3] */
            clearInterval(timer);       /* [4] */
            reject(e);                  /* [5] */
          }
        }, time);
      });
    }
  } catch (e) {                         /* [6] */
    return Promise.reject(e);           /* [7] */
  }
};

export default { setup_canvas, until };
