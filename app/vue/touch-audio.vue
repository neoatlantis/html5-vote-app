<template>

<audio id="touchbuttonaudio"> <source :src="touch_button" />     </audio>
<audio id="touchiconaudio"> <source :src="touch_icon" />     </audio>

</template>

<script>
export default {
    data(){ return {
        touch_button: "./data/touch-button.ogg",
        touch_icon: "./data/touch-icon.ogg",
    } },

    methods: {
        play_button(){
            document.getElementById("touchbuttonaudio").play();
        },
        play_icon(){
            document.getElementById("touchiconaudio").play();
        }
    }
}
</script>
