<template>

<audio id="touchbuttonaudio">
    <source :src="touch_button_ogg" type="audio/ogg" />
    <source :src="touch_button_mp3" type="audio/mpeg" />
</audio>
<audio id="touchiconaudio">
    <source :src="touch_icon_ogg" type="audio/ogg"/>
    <source :src="touch_icon_mp3" type="audio/mpeg" />
</audio>

</template>

<script>
export default {
    data(){ return {
        touch_button_ogg: "./data/touch-button.ogg",
        touch_icon_ogg: "./data/touch-icon.ogg",
        touch_button_mp3: "./data/touch-button.mp3",
        touch_icon_mp3: "./data/touch-icon.mp3",
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
