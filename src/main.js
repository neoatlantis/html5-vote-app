require("./svg.button.js");
const utils = require("./utils");
const update_result = require("./save-image.js");

const choices = require("./content.js");


const app = new Vue({
    el: "#app",
    data: {
        entering_name: true,
        username: "",
        show_result: false,
        selected_choices: [],
    },

    methods: {
        on_finished: function(){
            update_result(
                JSON.parse(JSON.stringify(this.selected_choices)),
                {
                    username: this.username,
                }
            );
            this.show_result = true;
        },
    }
});

function on_selection_changed(selected_ids){
    let selected_choices = choices
        .filter((e)=>selected_ids.indexOf(e.id) >= 0);
    app.selected_choices = selected_choices;
}

function name_is_entered(){
    return new Promise((resolve, reject)=>{
        function check(){
            if(app.entering_name == false){
                resolve();
            } else {
                setTimeout(check, 100);
            }
        }
        check();
    });
}


async function init(){


    await name_is_entered();


    const canvas = document.getElementById("options");
    utils.setup_canvas(canvas);
    
    await require("./choices-menu.js")(canvas, on_selection_changed);

}

init();


