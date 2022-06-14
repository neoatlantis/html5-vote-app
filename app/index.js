import choices from "app/content.js";

import get_background_controller from "app/canvasbg.js"; 
import stage_intro   from "app/stages/01-intro";
import stage_choices from "app/stages/02-choices";


import utils from "app/utils.js";

const update_result = require("./save-image.js");
const { assure_loaded } = require("./resource-loader.js");


import { createApp } from "vue";
import App from "sfc/app.vue";



const app = createApp(App).mount("#app");

function on_selection_changed(selected_ids){
    // On choosing page, when selected_choices changed
    let selected_choices = choices
        .filter((e)=>selected_ids.indexOf(e.id) >= 0);
    app.selected_choices = selected_choices;
}

function on_intro_done(){
    // In intro page, when user decided to continue
    app.intro_done = true;
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
    
    const bgcontroller = await get_background_controller(canvas);
    
    console.log("Stage #1");
    await stage_intro.interaction({
        canvas,
        bgcontroller,
        callback: on_intro_done,
        app,
    });

    console.log("Stage #2");
    await stage_choices.interaction({
        canvas,
        bgcontroller,
        callback: on_selection_changed,
        app,
    });

    await may_show_result();

    await require("./save-image.js")(
        JSON.parse(JSON.stringify(app.selected_choices)),
        {
            username: app.username,
        }
    );

}

init();
