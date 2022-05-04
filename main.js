import "./svg.option.js";
import "./svg.button.js";

import { choices } from "./content.js";




const app = new Vue({
    el: "#app",
    data: {
        show_result: false,
        ready: false,
        dragging: false,
        dragging_start: null,

        choices: choices,
        

    },

    computed: {
        selected_choices: function(){
            return this.choices.filter(e=>e.selected);
        }
    },

    methods: {
        on_choice_select: function(id, selected){
            this.choices.filter((e)=>e.id==id)[0].selected = selected;
            this.choices = JSON.parse(JSON.stringify(this.choices));
        },
        on_finished: function(){
            this.show_result = true;
        },

    
        on_menu_touchstart: function(e){
            this.dragging = true;
        },

        on_menu_touchmove: function(e){
        },

        on_menu_touchend: function(){
            this.dragging = false;
        },

        on_menu_touchcancel: function(){
            this.dragging = false;
        },

    }
});


setTimeout(()=>app.ready=true, 1000);
