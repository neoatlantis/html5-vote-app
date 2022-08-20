<template>

<audio id="touchaudio">
     <source :src="src" />     
</audio>

</template>

<script>
export default {
    data(){ return {
        src: "./data/touch-audio.ogg",
    } },

    methods: {
        play(){
            document.getElementById("touchaudio").play();
        }
    }
}
</script>
