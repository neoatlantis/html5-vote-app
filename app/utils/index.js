import constants    from "app/constants.js";
import setup_canvas from "./canvasinit.js";
import math         from "./fastmath.js";

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


// get a random number within a range
function random_range( min, max ) {
    return Math.random() * ( max - min ) + min;
}



export default { setup_canvas, until, random_range, math };
