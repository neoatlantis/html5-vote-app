<template>

<audio id="touchbuttonaudio" preload>
    <!--<source :src="touch_button_ogg" type="audio/ogg" />-->
    <source :src="touch_button_mp3" type="audio/mpeg" />
</audio>
<audio id="touchiconaudio" preload>
    <!--<source :src="touch_icon_ogg" type="audio/ogg"/>-->
    <source :src="touch_icon_mp3" type="audio/mpeg" />
</audio>

</template>

<script>

import AudioController from "app/audio-controller";

let audio_button_controller = null;
let audio_icon_controller = null;

export default {

    mounted(){
        audio_button_controller = new AudioController(
            document.getElementById("touchbuttonaudio"),
            "./data/touch-button.mp3",
            0.4
        );
        
        audio_icon_controller = new AudioController(
            document.getElementById("touchiconaudio"),
            "./data/touch-icon.mp3",
            0.5
        );
    },

    data(){ return {
        //touch_button_ogg: "./data/touch-button.ogg",
        //touch_icon_ogg: "./data/touch-icon.ogg",
        touch_button_mp3: "./data/touch-button.mp3",
        touch_icon_mp3: "./data/touch-icon.mp3",
    } },

    methods: {
        play_button(){
            audio_button_controller.play();
        },
        play_icon(){
            audio_icon_controller.play();
        }
    }
}
</script>
