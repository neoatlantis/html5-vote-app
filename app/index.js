import choices from "app/content.js";
import choices_menu from "app/choices-menu.js";


import utils from "app/utils.js";

const update_result = require("./save-image.js");
const { assure_loaded } = require("./resource-loader.js");


import { createApp } from "vue";
import App from "sfc/app.vue";




const app = createApp(App).mount("#app");

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
    
    await choices_menu.start_and_wait_done(canvas, on_selection_changed);

    await may_show_result();

    await require("./save-image.js")(
        JSON.parse(JSON.stringify(app.selected_choices)),
        {
            username: app.username,
        }
    );

}

init();
