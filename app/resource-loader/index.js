import utils from "app/utils";
import images from "./image_resource_list";
import blob_downloader from "./blob_downloader";

//const loaded_dataurls = {};
const loaded_images = {};

async function bg_load_by_name(name){
    const blob = await blob_downloader.start_download_image(name);
    
    let dataurl = await new Promise((resolve, reject)=>{
        let freader = new FileReader();
        freader.readAsDataURL(blob);
        freader.onload = ()=>resolve(freader.result);
    });

    let newimage = await bg_dataurl2image(dataurl);
    try{
        if(!utils.compatibility.createImageBitmapSupport()){
            //console.warn("createImageBitmap() unsupported.", navigator.userAgent);
            throw Error();
        }
        //console.log("Use createImageBitmap() to accelerate.");
        loaded_images[name] = await createImageBitmap(newimage);
    } catch(e){
        loaded_images[name] = newimage;
    }
}

async function bg_load_all(){
    let tasks = [];
    for(let image_name in images){
        tasks.push(bg_load_by_name(image_name));
    }
    await Promise.all(tasks);
    console.log("All images loaded:", tasks.length);
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
            let p = blob_downloader.current_percentage();
            try{
                percentage_callback(Math.round(p.percentage * 100));
            } catch(e){
            }
            if(p.unfinished > 0){
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
//    console.log(loaded_images);
    return loaded_images[image_name];
}


// TODO fonts and images are loaded at same time

const fonts = {};
async function get_font(font_name, url){
    if(undefined !== fonts[font_name]){
        await utils.until(()=>fonts[font_name] !== true);
        return fonts[font_name];
    }
    fonts[font_name] = true;
    let font = new FontFace(font_name, 'url(' + url + ')');
    await font.load();
    document.fonts.add(font);
    fonts[font_name] = font;
    return fonts[font_name];
}

get_font("font_main", "./data/main_font.ttf");
get_font("font_name", "./data/name_font.ttf");
get_font("font_badge", "./data/badge_font.ttf");


export {
    images,
    get_image,
    get_font,
    assure_loaded,
}
