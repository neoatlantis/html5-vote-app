const { images } = require("./resource-loader.js");

function fix_header(comp){
    const el_h = document.getElementById("choices-header");
    const el_bg = document.getElementById("choices-header-bg");
    const el_i = document.getElementById("add-item-input");
    const h = el_bg.getBoundingClientRect().height;
    el_h.style["height"] = `${h}px`;
    el_i.style["font-size"] = `${h*0.15}px`;
    comp.height = h;
}


Vue.component("svg-choices-header", {
    template: `
    <div style="position:fixed; width:100%" id="choices-header">
        <img
            style="position:absolute;width:100%;z-index:10"
            v-bind:src="background"
            id="choices-header-bg"
        ></img>
        <svg
            style="position:absolute;width:100%;z-index:20"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
            viewBox="0 0 1560 300"
            id="choices-header-svg"
        >
            <text text-anchor="end" x="1400" y="230" class="big">{{ selected }}</text>
            <text x="1450" y="235" class="small">{{ total }}</text>
        </svg>

        <input id="add-item-input" type="text" placeholder="手动添加更多成就"/>
    </div>
    `,

    props: ["selected", "total"],

    data: function(){ return {
        background: images["header"],
        height: false,
    } },

    methods: {
        on_click: function(e){
            this.$emit("click");
        }
    },

    watch: {
        height: function(){
            this.$emit("resize-height", this.height);
        },
    },

    mounted: function(){
        setInterval(()=>fix_header(this), 100);
    }

});
