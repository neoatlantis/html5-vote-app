require("./svg.button.js");
require("./svg.choices-header.js");
require("./svg.choices-footer.js");
const utils = require("./utils");
const update_result = require("./save-image.js");
const { assure_loaded } = require("./resource-loader.js");

const choices = require("./content.js");


const app = new Vue({
    el: "#app",
    data: {
        username: "",
        init_percent: 0,

        init_done: false,
        name_done: false,
        choices_done: false,

        total_choices: choices.length,
        selected_choices: [],
    },

});

function on_selection_changed(selected_ids){
    let selected_choices = choices
        .filter((e)=>selected_ids.indexOf(e.id) >= 0);
    app.selected_choices = selected_choices;
}

function may_show_result(){
    return new Promise((resolve, reject)=>{
        function check(){
            if(app.name_done && app.choices_done){
                resolve();
            } else {
                setTimeout(check, 100);
            }
        }
        check();
    });
}


async function init(){
    document.getElementById("app").style.display = "block";
    await assure_loaded(function(percentage){
        app.init_percent = percentage;
    });
    app.init_done = true;

    const canvas = document.getElementById("options");
    utils.setup_canvas(canvas, window.innerWidth, window.innerHeight);
    
    await require("./choices-menu.js")(canvas, on_selection_changed);

    await may_show_result();

    await require("./save-image.js")(
        JSON.parse(JSON.stringify(app.selected_choices)),
        {
            username: app.username,
        }
    );

}

init();


