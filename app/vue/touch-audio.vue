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

function mocked_factory(url){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return resolve(url);
        }, 500)
    });
}

export default {
    data(){ return {
        touch_button_ogg: "./data/touch-button.ogg",
        touch_icon_ogg: "./data/touch-icon.ogg",
        touch_button_mp3: "./data/touch-button.mp3",
        touch_icon_mp3: "./data/touch-icon.mp3",
        firsttime: true,
    } },

    methods: {
        play_button(){
            if(!this.firsttime){
                document.getElementById("touchbuttonaudio").play();
                return;
            }
            mocked_factory(this.touch_button_mp3).then(src => {
                const audio = document.getElementById("touchbuttonaudio");
                audio.src = src;
                audio.play();
                this.firsttime = false;
            });
        },
        play_icon(){
            if(!this.firsttime){
                document.getElementById("touchiconaudio").play();
                return;
            }
            mocked_factory(this.touch_icon_mp3).then(src => {
                const audio = document.getElementById("touchiconaudio");
                audio.src = src
                audio.play()
                this.firsttime = false;
            });
        }
    }
}
</script>
