const images = {
    "options": "./images/options_10x10.png",
    "bgcolor": "./images/bgcolor.png",

    "introtitle": "./images/introtitle.png",
    "introbutton": "./images/introbutton.png",
    "introbutton-down": "./images/introbutton_pressed.png",
    "slogan": "./images/slogan.png",
    "stars": "./images/stars.png",
    "glow": "./images/glow.png",
    "hex-bold": "./images/hex-bold.png",
    "hex-thin": "./images/hex-thin.png",
    "scroll": "./images/scroll.png",

    "countries-bg": "./images/countries-bg.png",
    "countries-flags": "./images/countries-flags.png",
    "countries-glow": "./images/countries-glow.png",

    "header": "./images/options_header.svg",
    "donebutton": "./images/donebutton.png",
    "donebutton-down": "./images/donebutton_pressed.png",

    "share_badge": "./images/05-share/badge.png",
    "share_base": "./images/05-share/base.png",
    "share_base_footer": "./images/05-share/base_footer_transp.png",
    "share_base_header": "./images/05-share/base_header_transp.png",
    "share_pattern_screen": "./images/05-share/pattern_screen.png",
    "share_top_footer": "./images/05-share/top_footer.png",
    "share_top_header": "./images/05-share/top_header.png",
};

//const loaded_dataurls = {};
const loaded_images = {};

async function bg_load_by_name(name){
    let response = await fetch(images[name] + "?_=" + Math.random());
    let blob = await response.blob(); //new Blob(chunks);
    
    let dataurl = await new Promise((resolve, reject)=>{
        let freader = new FileReader();
        freader.readAsDataURL(blob);
        freader.onload = ()=>resolve(freader.result);
    });

    loaded_images[name] = await bg_dataurl2image(dataurl);
}

async function bg_load_all(){
    for(let image_name in images) await bg_load_by_name(image_name);
}
bg_load_all();

async function bg_dataurl2image(dataurl){
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataurl;
    });
}

// --------------------------------------------------------------------------

async function assure_loaded(percentage_callback){
    return new Promise((resolve, reject)=>{
        function check_status(){
            const should_load = Object.keys(images).length;
            let actual_total = Object.keys(loaded_images).length;
            try{
                percentage_callback(parseInt(actual_total / should_load * 100));
            } catch(e){
            }
            if(actual_total != should_load){
                console.log("not all loaded");
                setTimeout(check_status, 1000);
            } else {
                resolve();
            }
        }
        check_status();
    });
}

async function get_image(image_name){
    await assure_loaded();
    /*return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = loaded_dataurls[image_name];
    });*/
    console.log(loaded_images);
    return loaded_images[image_name];
}

module.exports = {
    images,
    get_image,
    assure_loaded,
}
