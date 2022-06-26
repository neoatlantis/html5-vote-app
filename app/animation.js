/*
 * A basic class for animation.
 */
class AnimationImplementation {

    constructor(drawfunc){
        this.stop = false;
        this.draw = ()=>{
            if(!drawfunc()){
                this.stop = true;
            }
        }
    }

}


window.requestAnimFrame = ( function() {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame
    )
})();


class AnimationPlayer {
    
    constructor(animation){
        if(!(animation instanceof AnimationImplementation)){
            throw Error("An instance of AnimationImplementation expected.");
        }

        this.animation = animation;

        const self = this;
        function frame(){
            self.animation.stop = false;
            self.animation.draw();
            if(!self.animation.stop){
                self.__frame_id = window.requestAnimFrame(frame);
            }
        }
        self.__frame = frame;
    }

    start(){    
        this.__frame_id = window.requestAnimFrame(this.__frame);
    }

    stop(){
        this.animation.stop = true;
        if(this.__frame_id){
            window.cancelAnimationFrame(this.__frame_id);
        }
    }
}



export { AnimationPlayer, AnimationImplementation };
