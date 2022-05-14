/*import "./svg.option.js";
import "./svg.button.js";
import "./scrolling.js";
*/



async function init(){

    const canvas = document.getElementById("options");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    await require("./choices-menu.js")(canvas);

}

init();

/*

const app = new Vue({
    el: "#app",
    data: {
        show_result: false,
        ready: false,

        choices: choices,
        choices_positions: choices_positions,
        

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

    
    }
});


setTimeout(()=>app.ready=true, 1000);*/
