<template>
    <div style="position:fixed; bottom:0; width:100%; display:flex; flex-direction:row" class="fade-in-div">
        <div style="flex-basis:25%" id="footer-btn-done" v-on:click="on_click">
            <img
                v-bind:src="btn_done_background"
                style="max-width:100%"
            />
        </div>
    </div>

</template>
<script>
const { images } = require("app/resource-loader.js");

function make_round(){
    const el_i = document.getElementById("add-item-input");
    const el_b = document.getElementById("add-item-button");
    const el_v = document.getElementById("view-item-button");
    const h = el_i.getBoundingClientRect().height;
    el_i.style["border-radius"] = el_b.style["border-radius"] = `999999px`; //`${h/2}px`;
    el_v.style["width"] = el_v.style["height"] = el_b.style["width"] = el_b.style["height"] = `${h}px`;

    el_i.style["font-size"] = el_b.style["font-size"] = el_v.style["font-size"] = `${h*0.5}px`;

}


export default {
    props: ["selected", "total"],

    data: function(){ return {
        btn_done_background: images["footer-btn-done"],
    } },

    methods: {
        on_click: function(e){
            this.$emit("click");
            e.preventDefault();
        }
    },

    mounted: function(){
        //setInterval(()=>make_round(), 100);
    }

};
</script>
