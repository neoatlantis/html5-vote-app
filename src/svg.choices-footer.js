const { images } = require("./resource-loader.js");

function make_round(){
    const el_i = document.getElementById("add-item-input");
    const el_b = document.getElementById("add-item-button");
    const h = el_i.getBoundingClientRect().height;
    el_i.style["border-radius"] = el_b.style["border-radius"] = `${h/2}px`;
    el_b.style["width"] = el_b.style["height"] = `${h}px`;


}

Vue.component("svg-choices-footer", {
    template: `
    <div style="position:fixed; bottom:0; width:100%; display:flex; flex-direction:row" class="fade-in-div">
        <div style="flex-basis:75%; display:flex" id="footer-container">

        
            <div style="display:flex;flex-grow:1;flex-direction:column;justify-content:center"><!-- Vertical center -->
                
                <div style="height:60%; display:flex; padding-left:5%;">
                    <input id="add-item-input" type="text" style="border:none;border-radius:30px;width:60%" placeholder="手动添加更多成就"/>
                    <button id="add-item-button" type="button" style="border:none;border-radius:30px;">X</button>
                </div>

            </div>

        </div>
        <div style="flex-basis:25%" id="footer-btn-done" v-on:click="on_click">
            <img
                v-bind:src="btn_done_background"
                style="max-width:100%"
            ></img>
        </div>
    </div>
    `,

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
        setInterval(()=>make_round(), 100);
    }

});
