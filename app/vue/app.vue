<template><div>


    <div class="fullscreen" v-show="!init_done" style="display: flex; justify-content: center; align-items: center;">
        <div>
            {{ init_percent }}%
        </div>
    </div>

    <div class="fullscreen" v-show="init_done && !(intro_done && choices_done && countries_done && name_done)" @touchend="play_music">

        <div v-show="intro_done && !choices_done" class="fade-in-div">
            <choices-header
                v-bind:selected="selected_choices.length"
                v-bind:total="total_choices"
                v-on:resize-height="on_choices_header_resized"
                v-on:toggle-basket="show_basket=!show_basket"
            ></choices-header>  

            <choices-basket
                v-bind:selected_choices="selected_choices"
                v-bind:header_height="header_height"
                @clickdelete="on_basket_click_delete"
                v-show="show_basket"
            ></choices-basket>

            <!--<choices-footer
                v-bind:selected="selected_choices.length"
                v-bind:total="total_choices"
                v-on:click="choices_done=true"
            ></choices-footer>  -->
        </div>

        <canvas id="options" style="width:100%;height:100%"></canvas>
    </div>

    <div class="fullscreen" v-show="init_done && choices_done && countries_done && !name_done" style="display:flex; flex-direction:row; align-items: center; justify-content:center">
        <div>
            <div style="text-align:center"><input name="请输入名字" type="text" v-model="username"/></div>
            <div style="text-align:center"><button v-on:click="name_done=true">查看结果</button></div>
        </div>
    </div>

    <div class="fullscreen" v-show="init_done && choices_done && countries_done && name_done" style="overflow-y: scroll">
        <canvas id="result" style="width:100%"></canvas>
        <img id="result-img">
    </div>


    <Bgm ref="bgm"></Bgm>
    <TouchAudio ref="touchaudio"></TouchAudio>


</div></template>
<script>

import choices_menu from "app/stages/02-choices"; 
import { choices }  from "app/content.js";

import ChoicesBasket from "sfc/choices-basket.vue";
import ChoicesHeader from "sfc/choices-header.vue";
import ChoicesFooter from "sfc/choices-footer.vue";

import Bgm from "sfc/bgm.vue";
import TouchAudio from "sfc/touch-audio.vue";


export default {

    data(){ return {
        username: "",
        init_percent: 0,

        init_done: false,
        intro_done: false,
        choices_done: false,
        countries_done: false,
        name_done: false,

        total_choices: choices.length,
        selected_choices: [],

        show_basket: false,

        header_height: false,
    } },

    methods: {
        on_choices_header_resized: function(new_height){
            choices_menu.set_header_height(new_height);
            this.header_height = new_height;
        },

        play_music(){
            this.$refs["bgm"].play();
        },

        play_touch_audio(){
            this.$refs["touchaudio"].play();
        },

        on_basket_click_delete(id){
            const existing = JSON.parse(JSON.stringify(this.selected_choices));
            const newjson = existing.filter((e)=>e.id != id);
            this.selected_choices = newjson;
        }
    },

    components: {
        ChoicesBasket,
        ChoicesHeader,
        ChoicesFooter,
        Bgm,
        TouchAudio,
    }
}



</script>
