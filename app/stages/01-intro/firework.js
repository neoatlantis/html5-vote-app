import utils        from "app/utils.js";


const particles = [];
var hue = 120;




// create particle
function Particle( x, y ) {
    this.x = x;
    this.y = y;
    // track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
    this.coordinates = [];
    this.coordinateCount = 5;
    while( this.coordinateCount-- ) {
            this.coordinates.push( [ this.x, this.y ] );
    }
    // set a random angle in all possible directions, in radians
    this.angle = utils.random_range( 0, Math.PI * 2 );
    this.speed = utils.random_range( 1, 10 );
    // friction will slow the particle down
    this.friction = 0.99;
    // gravity will be applied and pull the particle down
    this.gravity = 1;
    // set the hue to a random number +-20 of the overall hue variable
    this.hue = utils.random_range( hue - 20, hue + 20 );
    this.brightness = utils.random_range( 50, 80 );
    this.alpha = 1;
    // set how fast the particle fades out
    this.decay = utils.random_range( 0.015, 0.03 );
}

// update particle
Particle.prototype.update = function( index ) {
    // remove last item in coordinates array
    this.coordinates.pop();
    // add current coordinates to the start of the array
    this.coordinates.unshift( [ this.x, this.y ] );
    // slow down the particle
    this.speed *= this.friction;
    // apply velocity
    this.x += Math.cos( this.angle ) * this.speed;
    this.y += Math.sin( this.angle ) * this.speed + this.gravity;
    // fade out the particle
    this.alpha -= this.decay;
    
    // remove the particle once the alpha is low enough, based on the passed in index
    if( this.alpha <= this.decay ) {
        particles.splice( index, 1 );
    }
}

// draw particle
Particle.prototype.draw = function(ctx) {
    ctx.beginPath();
    // move to the last tracked coordinates in the set, then draw a line to the current x and y
    ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
    ctx.lineTo( this.x, this.y );
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'hsla(' + hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
    ctx.stroke();
}






class FireworkController {

    constructor(canvas, ctx){
        this.canvas = canvas
        this.ctx = ctx;
    }

    animation_frame() {
        // increase the hue to get different colored fireworks over time
        hue += 0.5;
        
        // normally, clearRect() would be used to clear the canvas
        // we want to create a trailing effect though
        // setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
        /*this.ctx.globalCompositeOperation = 'destination-out';
        // decrease the alpha property to create more prominent trails
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );*/
        // change the composite operation back to our main mode
        // lighter creates bright highlight points as the fireworks and particles overlap each other
        this.ctx.globalCompositeOperation = 'lighter';
        
        // loop over each particle, draw it, update it
        var i = particles.length;
        while(i--){
            particles[i].draw(this.ctx);
            particles[i].update(i);
        }
        
        this.ctx.globalCompositeOperation = "source-over";
    }


    add_firework(x, y) {
        for(let i=0; i<20; i++){
            particles.push( new Particle( x, y ) );
        }
    }

}


export default FireworkController;
