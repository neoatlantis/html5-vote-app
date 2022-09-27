<template>

<audio id="bgm" autoplay="autoplay" loop>
     <source :src="bgm_ogg" type="audio/ogg"/>
     <source :src="bgm_mp3" type="audio/mpeg"/>
</audio>

</template>

<script>

function mocked_factory(url){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve(url);
        }, 500)
    });
}

export default {
    data(){ return {
        bgm_ogg: "./data/bgm.ogg",
        bgm_mp3: "./data/bgm.mp3",
        playing: false,
    } },

    methods: {
        play(){
            console.log("music start");
            if(this.playing) return;
            //document.getElementById("bgm").play();
            mocked_factory(this.bgm_mp3).then(src => {
                const audio = document.getElementById("bgm");
                audio.src = src
                audio.play()
            });
            this.playing = true;
        }
    }
}
</script>
