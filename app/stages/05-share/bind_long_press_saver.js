import constants    from "app/constants.js";
const event_of = require("app/events"); 
const saveAs = require("./FileSaver.min.js");

export default function event_binder(canvas){
    
    const ec = event_of("canvas");

    let touchstart_time = 0;
    let touching = false;
    let download_touch_timer = null;
    //const canvas = document.getElementById("result");
    //console.log(canvas);
    function start_image_download(){
        if(!touching) return;
        if(
            new Date().getTime() - touchstart_time > 
            constants.RESULT_LONG_PRESS_SAVE_TIME
        ){
            canvas.toBlob(function(blob) {
                saveAs(blob, "result.png");
            });
        } else {
            download_touch_timer = setTimeout(start_image_download, 100);
        }
    }
    function clear_download_timer(){
        if(null == download_touch_timer) return;
        clearTimeout(download_touch_timer);
    }

    ec.on("touchstart",(e)=>{
        touchstart_time = new Date().getTime();
        touching = true;
        download_touch_timer = setTimeout(start_image_download, 100);
        console.log("set dw touch timer");
        e.preventDefault();
    });
    ec.on("touchend", (e)=>{
        touching = false;
        clear_download_timer();
        e.preventDefault();
    });



}
