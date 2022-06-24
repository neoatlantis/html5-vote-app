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



class AnimationPlayer {

}
