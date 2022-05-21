const { images } = require("./resource-loader.js");

Vue.component("svg-choices-header", {
    template: `
    <div style="position:fixed; width:100%">
        <img
            style="position:fixed;width:100%;z-index:10"
            v-bind:src="background"
        ></img>
        <svg
            style="position:fixed;width:100%;z-index:20"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
            viewBox="0 0 1560 300"
            id="choices-header-svg"
        >
            <text text-anchor="end" x="1390" y="230" class="big">{{ selected }}</text>
            <text x="1440" y="228" class="small">{{ total }}</text>
        </svg>
    </div>
    `,

    props: ["selected", "total"],

    data: function(){ return {
        background: images["header"],
    } },

    methods: {
        on_click: function(e){
            this.$emit("click");
        }
    },

});
