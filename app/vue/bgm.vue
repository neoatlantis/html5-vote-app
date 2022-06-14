<template>

<audio id="bgm" autoplay="autoplay" loop>
     <source :src="bgm" />     
</audio>

</template>

<script>
export default {
    data(){ return {
        bgm: "./data/bgm.ogg",
        playing: false,
    } },

    methods: {
        play(){
            console.log("music start");
            if(this.playing) return;
            document.getElementById("bgm").play();
            this.playing = true;
        }
    }
}
</script>
