<template>
    <div style="position:fixed; width:100%" id="choices-header">
        <img
            style="position:absolute;width:100%;z-index:10"
            v-bind:src="background"
            id="choices-header-bg"
        />
        <svg
            style="position:absolute;width:100%;z-index:20"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
            viewBox="0 0 1560 300"
            id="choices-header-svg"
        >
            <text text-anchor="end" x="1400" y="230" class="big">{{ selected }}</text>
            <text x="1450" y="235" class="small">{{ total }}</text>

            <circle cx="1015" cy="215" r="42" fill="transparent" stroke="transparent" v-on:touchend="on_submit_click"/>
            <circle cx="1115" cy="215" r="42" fill="transparent" stroke="transparent" v-on:touchend="on_basket_toggle"/>
        </svg>

        <!--<input id="add-item-input" v-model="additional" type="text" placeholder="手动添加更多成就"/>-->
    </div>
</template>
<script>

import { images } from "app/resource-loader.js";

function fix_header(comp){
    const el_h = document.getElementById("choices-header");
    const el_bg = document.getElementById("choices-header-bg");
    //const el_i = document.getElementById("add-item-input");
    const h = el_bg.getBoundingClientRect().height;
    el_h.style["height"] = `${h}px`;
    //el_i.style["font-size"] = `${h*0.15}px`;
    comp.height = h;
}

export default {
    props: ["selected", "total"],

    data(){ return {
        background: images["header"],
        height: false,
        additional: "",
    } },

    methods: {
        /*on_submit_click: function(){
            console.log("manual add", this.additional);
            this.$emit("submit", this.additional);
        },*/

        on_basket_toggle: function(){
            this.$emit("toggle-basket");
        },
    },

    watch: {
        height: function(){
            this.$emit("resize-height", this.height);
        },
    },

    mounted: function(){
        setInterval(()=>fix_header(this), 100);
    }

};


</script>
