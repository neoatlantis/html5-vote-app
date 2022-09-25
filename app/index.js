/// #if DEV
import eruda from "eruda";
eruda.init();

console._log = console.log;
console.log = (a,b,c,d,e,f,g)=>console._log(`${Math.round(performance.now())}`, a,b,c,d,e,f,g);
/// #endif



import { choices } from "app/content.js";

import get_background_controller from "app/canvasbg.js"; 
import stage_intro   from "app/stages/01-intro";
import stage_choices from "app/stages/02-choices";
import stage_countries from "app/stages/03-countries";
import stage_name    from "app/stages/04-name";
import stage_share   from "app/stages/05-share";


import utils from "app/utils";

import { assure_loaded } from "./resource-loader";


import { createApp } from "vue";
import App from "sfc/app.vue";



const app = createApp(App).mount("#app");


let result_choices = [],
    result_countries = [];



function on_selection_changed(selected_ids){
    // On choosing page, when selected_choices changed
    let selected_choices = choices
        .filter((e)=>selected_ids.indexOf(e.id) >= 0);
    app.selected_choices = selected_choices;
    result_choices = selected_choices.map((e)=>e.id);
}

function on_intro_done(){
    // In intro page, when user decided to continue
    app.intro_done = true;
}

function on_selection_done(e){
    app.choices_done = true;
    result_choices = e;
}

function on_countries_done(e){
    app.countries_done = true;
    result_countries = e;
}

function on_name_done(){
    app.name_done = true;
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
        callback_done: on_selection_done,
        app,
    });

    console.log("Stage #3");
    await stage_countries.interaction({
        canvas,
        bgcontroller,
//        callback: on_countries_changed,
        callback_done: on_countries_done,
        app,
    });

    console.log("Stage #4");
    await stage_name.interaction({
        canvas,
        bgcontroller,
        app,
        callback: on_name_done,
    });

    console.log("Stage #5");

/*    await require("./save-image.js")(
        JSON.parse(JSON.stringify(app.selected_choices)),
        {
            username: app.username,
        }
    );*/
    stage_share.interaction({
        canvas: document.getElementById("result"),
        app,
        result_choices,
        result_countries
    });

}

init();
