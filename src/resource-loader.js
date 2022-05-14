const images = {
    "options": "./images/options.png",
}


// https://stackoverflow.com/questions/14218607/javascript-loading-progress-of-an-image

Image.prototype.load = function(url){
    var thisImg = this;
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', url,true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onload = function(e) {
        var blob = new Blob([this.response]);
        thisImg.src = window.URL.createObjectURL(blob);
        thisImg.loaded = true;
    };
    xmlHTTP.onprogress = function(e) {
        thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
    };
    xmlHTTP.onloadstart = function() {
        thisImg.completedPercentage = 0;
    };
    xmlHTTP.send();
};

Image.prototype.completedPercentage = 0;
Image.prototype.loaded = false;

// ---------------------------------------------------------------------------

const loaded_images = {};

for(let image_name in images){
    loaded_images[image_name] = new Image();
    loaded_images[image_name].load(images[image_name]);
}


async function assure_loaded(percentage_callback){
    return new Promise((resolve, reject)=>{
        function check_status(){
            const should_load = Object.keys(loaded_images).length;
            const should_total = 100 * should_load;
            let actual_total = 0;
            let all_loaded = true;
            for(let img_name in loaded_images){
                let img = loaded_images[img_name];
                console.log(img.completedPercentage);
                if(img.loaded){
                    actual_total += 100;
                } else {
                    all_loaded = false;
                    actual_total += img.completedPercentage;
                }
            }
            try{
                percentage_callback(parseInt(actual_total / should_total * 100));
            } catch(e){
            }
            if(!all_loaded){
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
    return loaded_images[image_name];
}

module.exports = {
    get_image,
}
