<template>

<audio id="bgm" autoplay="autoplay" loop preload>
     <!--<source :src="bgm_ogg" type="audio/ogg"/>-->
     <source :src="bgm_mp3" type="audio/mpeg"/>
</audio>

</template>

<script>

export default {
    data(){ return {
        //bgm_ogg: "./data/bgm.ogg",
        bgm_mp3: "./data/bgm.mp3",
        playing: false,
    } },

    methods: {
        play(){
            console.log("music start");
            if(this.playing) return;
            //document.getElementById("bgm").play();
            const audio = document.getElementById("bgm");
            audio.play();
            this.playing = true;
        }
    }
}
</script>
