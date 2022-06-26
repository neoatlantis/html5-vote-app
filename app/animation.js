import utils        from "app/utils";

/*
 * A basic class for animation.
 */
class AnimationImplementation {

    constructor(drawfunc){
        const self = this;
        this.stop = false;
        this.draw = function(e){
            if(!drawfunc.call(this, e)){
                self.stop = true;
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
    
    constructor(animation_this, animation){
        if(!(animation instanceof AnimationImplementation)){
            throw Error("An instance of AnimationImplementation expected.");
        }

        this.animation_this = animation_this;
        this.animation = animation;

        const self = this;
        function frame(e){
            self.animation.stop = false;
            self.animation.draw.call(self.animation_this, e);
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
