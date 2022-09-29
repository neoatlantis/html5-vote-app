import utils from "app/utils";
import images from "./image_resource_list";
const superagent = require('superagent');


const loaded_blobs = {};
let total = 0;
for(let i in images) total += images[i].size;



function start_download_image(name){
    if(loaded_blobs[name] !== undefined){
        if(loaded_blobs[name].result !== undefined){
            return loaded_blobs[name].result;
        }
        return loaded_blobs[name].job.then((res)=>{
            loaded_blobs[name].result = res.body;
            return res.body;
        });
    }

    const url = images[name].path + "?_=" + Math.random();
    const newjob = superagent.get(url).responseType("blob");

    loaded_blobs[name] = {
        job: newjob,
        bytes_total: 1,
        bytes_loaded: 0,
    }

    newjob.on("progress", ({ total, loaded })=>{
        loaded_blobs[name].bytes_total = total;
        loaded_blobs[name].bytes_loaded = loaded;
    });

    return newjob.then((res)=>{
        loaded_blobs[name].result = res.body;
        return res.body;
    });
}


function current_percentage(){
    let loaded = 0;
    let unfinished = 0;
    for(let k in loaded_blobs){
        loaded += loaded_blobs[k].bytes_loaded;
    }
    for(let k in images){
        if(
            loaded_blobs[k] == undefined ||
            loaded_blobs[k].result == undefined
        ){
            unfinished += 1;
        }
    }
    return {
        unfinished: unfinished,
        percentage: (total != 0 ? loaded / total : 1),
        total: total,
        loaded: loaded,
    };
}




export default {
    start_download_image,
    current_percentage,
}
