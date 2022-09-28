class AudioController {
    
    constructor(audio, src, duration){
        this.src = src;
        this.duration = duration;
        
        this.audio = audio;
        this.audio.load();

        this.bind_events();

        this.reloaded = false;
    }

    bind_events(){
        this.audio.oncomplete = ()=>{
            this.reloaded = false;
            this.reload();
        }


        this.audio.oncanplaythrough = () => {
            this.reloaded = true;
        }

        this.audio.ontimeupdate = ()=>{
            if(this.audio.currentTime > this.duration){
                this.audio.pause();
                this.audio.currentTime = 0;
            }
        }
    }

    reload(){
        if(this.reloaded) return;
        this.audio.src = this.src;
    }

    play(){
        this.reload();
        this.audio.play();
    }

}

export default AudioController;
