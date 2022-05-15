(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
(function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c)},d.onerror=function(){console.error("could not download file")},d.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null},k.readAsDataURL(b)}else{var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m)},4E4)}});f.saveAs=g.saveAs=g,"undefined"!=typeof module&&(module.exports=g)});



}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
const constants = require("./constants.js");




class CanvasOption{
    /*
     *      |<--size-->|
     *      +----------+----------+----------+ --|
     *      |   col 0  |   col 1  |  col 2   |   | size
     *      +----------+----------+----------+ --|
     *      |          |          |          |
     *      +----------+----------+----------+
     *      |          |          |          |
     *      +----------+----------+----------+
     *      |          |          |          |
     *      +----------+----------+----------+
     */

    constructor({
        choice_id,
        text,
        image_id,
        image_src,
        row,
        col,
        size,
        ctx,
        canvas_height
    }){
        this.choice_id = choice_id;
        this.text = text;
        this.image_id = image_id;
        this.image_src = image_src;
        this.image_tile_size = constants.RESOURCE_ICON_TILE_SIZE;

        this.row = row;
        this.col = col;

        this.size = size;
        this.ctx = ctx;

        this.canvas_height = canvas_height;

        // Oscillating effect

        this.osc_A = this.size * constants.MENU_CHOICE_OSC_A;
        this.osc_t = 0;
        this.osc_T = constants.MENU_CHOICE_OSC_T;
        this.osc_t0 = new Date().getTime();
        this.osc_p0 = Math.random() * 2 * Math.PI;
        this.osc_reset = ()=>{
            this.osc_t0 = new Date().getTime();
            this.osc_p0 = 0;
        }

        // Standard position in target canvas, not changing
        this.y0 = this.row * this.size;
        this.x0 = this.size/2 + this.size * this.col;

        // Standard position in source canvas
        this.sx0 = 0;
        this.sy0 = this.image_id * this.image_tile_size;


        // Actual position in target canvas, updated by next()
        this.x = this.x0;
        this.y = this.y0;


        // If this option is choosen
        this.choosen = false;

        // When choosen, play a short animation moving the icon from wherever
        // to the standard position given by (this.x0, this.y0). Need a flag
        // to mark this.
        this.animating_to_origin = false;
    }

    drawImage({ delta_y0, nowtime }){
        const target_x0 = this.x0;
        const target_y0 = this.y0 + delta_y0;

        if(target_y0 + this.size < 0) return;
        if(target_y0 > this.canvas_height) return;

        this.y = target_y0;
        
        if(this.animating_to_origin){
            const move_dx = target_x0 - this.x;
            const move_err = 5;
            if(Math.abs(move_dx) < move_err){
                // no need to animate anymore
                this.animating_to_origin = false;
                this.osc_reset();
            } else {
                this.x += move_dx/10;
            }
        } else if(!this.choosen){
            const osc_dx = this.osc_A * Math.sin(this.osc_p0 + (nowtime - this.osc_t0)/this.osc_T);
            this.x = target_x0 + osc_dx;
        }
        
        if(!this.choosen){
            this.ctx.filter = 'grayscale(100%)';
        } else {
            this.ctx.filter = 'none';
        }
        this.ctx.drawImage(
            this.image_src,
            this.sx0,
            this.sy0, 
            this.image_tile_size,
            this.image_tile_size,
            this.x,
            this.y,
            this.size,
            this.size
        );
    }

    next({ delta_y0, nowtime }){
        this.drawImage({ delta_y0, nowtime });
    }

    handle_click(x, y){
        if(
            (this.x <= x && x <= this.x + this.size) &&
            (this.y <= y && y <= this.y + this.size)
        ){  
            console.log(this.text);
            this.choosen = !this.choosen;
            if(this.choosen){
                this.animating_to_origin = true;
            } else {
                this.osc_reset();
            }
        }
    }
}




module.exports = CanvasOption;

},{"./constants.js":4}],3:[function(require,module,exports){
const choices = require("./content.js");
const { get_image } = require("./resource-loader.js");
const CanvasOption = require("./canvas-option.js");
const constants = require("./constants");

const initial_position = Math.floor(Math.random()*constants.MENU_CHOICES_PER_ROW);
const position_deltas = choices.map((e)=>Math.floor(Math.random()*2)).map((e)=>e?1:-1);
let current_pos = initial_position;
let choices_positions = [];
for(let i=0; i<choices.length; i++){
    current_pos += position_deltas[i];
    if(current_pos < 0){
        current_pos += constants.MENU_CHOICES_PER_ROW;
    }
    if(current_pos >= constants.MENU_CHOICES_PER_ROW){
        current_pos -= constants.MENU_CHOICES_PER_ROW;
    }
    choices_positions.push(current_pos);
}

//////////////////////////////////////////////////////////////////////////////


module.exports = async function init(canvas, callback){
    
    const options_image = await get_image("options");



    const scrollspeed = canvas.height / 1000;

    const row_size = Math.round(canvas.width / 4);
    const ctx = canvas.getContext("2d");


    const options_instances = choices.map((choice, choice_i)=>{
        return new CanvasOption({
            choice_id: choice.id,
            text: choice.text,
            image_id: choice.pos,
            image_src: options_image,
            row: choice_i,
            col: choices_positions[choice_i],
            size: row_size,
            ctx: ctx,
            canvas_height: canvas.height,
        });
    });


    const delta_y0_min = canvas.height - row_size * options_instances.length;
    let delta_y0 = 0;
    let delta_y0_scroll = false;
    let autoscroll = true;
    function draw(){
        const nowtime = new Date().getTime();

        if(autoscroll){
            delta_y0 -= scrollspeed;
        }
        delta_y0 += delta_y0_scroll;
        delta_y0_scroll = 0;

        if(delta_y0 < delta_y0_min){
            delta_y0 = delta_y0_min;
        }
        if(delta_y0 > 0){
            delta_y0 = 0;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        options_instances.forEach((oi)=>{
            oi.next({ delta_y0: delta_y0, nowtime: nowtime });
        });
        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);


    function on_click(x, y){
        // handle a touch-click or mouseclick event
        options_instances.forEach((oi)=>oi.handle_click(x, y));

        let selected_ids = options_instances    
            .filter((oi)=>oi.choosen)
            .map((oi)=>oi.choice_id)
        ;
        try{
            callback(selected_ids);
        } catch(e){
        }
    }




    let touchscrolled = false;
    let touch_lasty = 0;
    canvas.ontouchstart = (e)=>{
        autoscroll = false;
        touchscrolled = false;
        delta_y0_scroll = 0;
        touch_lasty = e.changedTouches[0].clientY;
    }

    canvas.ontouchend = (e)=>{
        autoscroll = true;

        if(!touchscrolled){
            // touch-"clicked" something
            let touch = e.changedTouches[0];
            on_click(
                touch.clientX * constants.SCALE_FACTOR,
                touch.clientY * constants.SCALE_FACTOR
            );
        }

        delta_y0_scroll = 0;
    }

    canvas.ontouchmove = (e)=>{
        if(autoscroll) return;
        touchscrolled = true;

        const currenty = e.changedTouches[0].clientY;
        delta_y0_scroll += (currenty - touch_lasty) * constants.SCALE_FACTOR;
        touch_lasty = currenty;
    }
}

},{"./canvas-option.js":2,"./constants":4,"./content.js":5,"./resource-loader.js":7}],4:[function(require,module,exports){
module.exports = {
    SCALE_FACTOR: 300/96,

    RESOURCE_ICON_TILE_SIZE: 360,

    MENU_CHOICES_PER_ROW: 3,
    MENU_CHOICE_OSC_A: 0.1,
    MENU_CHOICE_OSC_T: 2000,

    RESULT_HEADER_HEIGHT_WIDTH_RATIO: 0.50,

    RESULT_ICONS_PER_ROW: 3,
    RESULT_ICONS_MARGIN_TO_CANVAS_WIDTH: 0.05,
    RESULT_ICON_ROW_HEIGHT_TO_GRID_SIZE: 1.35,
    RESULT_ICON_SIZE_TO_GRID_SIZE: 0.9,

    RESULT_LONG_PRESS_SAVE_TIME: 1000,
}

},{}],5:[function(require,module,exports){
var _id=0; function id(){ return _id++ };

const choices = [
    { id: id(), pos: 0, text: "2017 年进群" },
    { id: id(), pos: 1, text: "遭遇火车祥瑞" },
    { id: id(), pos: 0, text: "和群友们聚餐" },
    { id: id(), pos: 1, text: "和群旗合影" },
    { id: id(), pos: 0, text: "参加 GORUCK" },
    { id: id(), pos: 1, text: "在德国麦当劳吃 McRib" },
    { id: id(), pos: 1, text: "在科隆户外烧烤" },
    { id: id(), pos: 0, text: "在阿姆吃排骨" },
    { id: id(), pos: 1, text: "在苏黎世吃莲花园" },
    { id: id(), pos: 1, text: "住过群友家" },
    { id: id(), pos: 1, text: "参加线上 IFS" },
    { id: id(), pos: 0, text: "在公众号发表文章" },
    { id: id(), pos: 1, text: "和群友组队参加 Anomaly" },
    { id: id(), pos: 1, text: "在 Kaltenberg 搬砖" },
    { id: id(), pos: 1, text: "约饭牌黑了" },
    { id: id(), pos: 0, text: "打赢一场 Anomaly" },
    { id: id(), pos: 1, text: "夜刷 Mission Day" },
    { id: id(), pos: 1, text: "Mission Day 制霸" },
    { id: id(), pos: 1, text: "GORUCK 三连" },
    { id: id(), pos: 1, text: "参加 OCF" },
    { id: id(), pos: 1, text: "鸮过群友" },
    { id: id(), pos: 1, text: "会说玉兰语" },
    { id: id(), pos: 1, text: "找到冷门爱好同好" },
    { id: id(), pos: 1, text: "和群友联机打游戏" },
    { id: id(), pos: 1, text: "群友视频聊天" },
    { id: id(), pos: 1, text: "见到 Ingress 剧情人物" },
    { id: id(), pos: 1, text: "到剧情相关地标朝圣" },
    { id: id(), pos: 1, text: "群友聚会不开游戏" },
    { id: id(), pos: 1, text: "谈一场群内恋爱" },
    { id: id(), pos: 1, text: "穿越英吉利海峡" },
    { id: id(), pos: 1, text: "火车上赶作业" },
    { id: id(), pos: 1, text: "坐通宵大巴" },
    { id: id(), pos: 1, text: "追 NL1331" },
    { id: id(), pos: 1, text: "收到生日礼物" },
    { id: id(), pos: 1, text: "拥有 CSAE 周边" },
    { id: id(), pos: 1, text: "和当地特工成为朋友" },
    { id: id(), pos: 1, text: "向别人安利 Ingress 成功" },
    { id: id(), pos: 1, text: "和群友交换明信片" },
    { id: id(), pos: 1, text: "制作自己的 biocard" },
    { id: id(), pos: 1, text: "满级重生" },
];

module.exports = choices;

},{}],6:[function(require,module,exports){
require("./svg.button.js");
const utils = require("./utils");
const update_result = require("./save-image.js");

const choices = require("./content.js");


const app = new Vue({
    el: "#app",
    data: {
        username: "",

        init_done: true,
        name_done: false,
        choices_done: false,
        
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




    const canvas = document.getElementById("options");
    utils.setup_canvas(canvas);
    
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



},{"./choices-menu.js":3,"./content.js":5,"./save-image.js":10,"./svg.button.js":11,"./utils":12}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
module.exports = function({ canvas, ctx }){
   
    ctx.fillStyle = "#FFCC00";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

},{}],9:[function(require,module,exports){
const constants = require("./constants.js");

module.exports = function({
    canvas,
    ctx,
    username,
    count
}){
    const width = canvas.width;
    const height = width * constants.RESULT_HEADER_HEIGHT_WIDTH_RATIO;

    const font_size = parseInt(height/5);


    ctx.textAlign = 'right';

    ctx.font = `${font_size}px monospace`;
    ctx.fillStyle = "#AA8800";
    ctx.fillText(
        username,
        width * 0.9,
        height - font_size * 2.5
    );

    ctx.font = `${parseInt(font_size*0.5)}px monospace`;
    ctx.fillText(
        `做过${count}件事`,
        width * 0.9,
        height - font_size * 1.5
    );


    return { height }
}

},{"./constants.js":4}],10:[function(require,module,exports){
const constants = require("./constants.js");
const utils = require("./utils");


const appendix_height = 100;
const icon_size_to_width = constants.RESULT_ICON_SIZE_TO_WIDTH;
const tile_size = constants.RESOURCE_ICON_TILE_SIZE;
const icons_area_margin_percentage = constants.RESULT_ICONS_MARGIN_TO_CANVAS_WIDTH;
const icons_per_row = constants.RESULT_ICONS_PER_ROW;

const saveAs = require("./FileSaver.min.js");
const { get_image } = require("./resource-loader.js");

const draw_image_header = require("./save-image.draw-header.js");
const draw_background = require("./save-image.draw-background.js");


function setup_sizes(options_count){

    const canvas = document.getElementById("result");
    const ctx = canvas.getContext("2d");

    const css_width = window.innerWidth;
    
    const prefix_height = Math.ceil(
        css_width * constants.RESULT_HEADER_HEIGHT_WIDTH_RATIO);

    const icons_area_margin = icons_area_margin_percentage * css_width;
    const icon_split_width = (css_width - 2 * icons_area_margin) / icons_per_row;
    const row_height = icon_split_width * constants.RESULT_ICON_ROW_HEIGHT_TO_GRID_SIZE;

    const css_height = 
        row_height * Math.ceil(options_count / icons_per_row)
        + prefix_height + appendix_height;


    utils.setup_canvas(canvas, css_width, css_height);
}



module.exports = async function update_result(options, args){
    setup_sizes(options.length);

    const canvas = document.getElementById("result");
    const ctx = canvas.getContext("2d");

    const srcimg = await get_image("options");

    const prefix_height = Math.ceil(
        canvas.width * constants.RESULT_HEADER_HEIGHT_WIDTH_RATIO);


    const icons_area_margin = icons_area_margin_percentage * canvas.width;
    const icon_split_width = (canvas.width - 2 * icons_area_margin) / icons_per_row;
    const row_height = icon_split_width * constants.RESULT_ICON_ROW_HEIGHT_TO_GRID_SIZE;
    const icon_size = icon_split_width * constants.RESULT_ICON_SIZE_TO_GRID_SIZE;
    const font_size = parseInt(icon_size / 6);

    // draw background
    draw_background({ ctx, canvas });

    // draw header
    
    const username = args.username;
    draw_image_header({ username, ctx, canvas, count: options.length });

    // draw icons

    options.forEach((e, e_i)=>{
        const row = Math.floor(e_i / icons_per_row),
              col = e_i % icons_per_row;

        const target_y0 = prefix_height + row * row_height,
              target_x0 = icons_area_margin + col * icon_split_width;
        ctx.drawImage(
            srcimg,
            0, // sx
            tile_size * e.pos, // sy,
            tile_size,
            tile_size,
            target_x0 + (icon_split_width-icon_size)/2, // dx
            target_y0, // dy
            icon_size,
            icon_size
        );
        ctx.font = `${font_size}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(
            e.text,
            target_x0+icon_split_width/2,
            target_y0+icon_size*1.1,
        );
    });




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
    canvas.ontouchstart = (e)=>{
        touchstart_time = new Date().getTime();
        touching = true;
        download_touch_timer = setTimeout(start_image_download, 100);
        console.log("set dw touch timer");
        e.preventDefault();
    }
    canvas.ontouchend = canvas.ontouchcancel = (e)=>{
        touching = false;
        clear_download_timer();
        e.preventDefault();
    }
/*    canvas.ontouchcancel = (e)=>{
        touching = false;
        clear_download_timer();
        e.preventDefault();
    }*/
}




},{"./FileSaver.min.js":1,"./constants.js":4,"./resource-loader.js":7,"./save-image.draw-background.js":8,"./save-image.draw-header.js":9,"./utils":12}],11:[function(require,module,exports){
Vue.component("svg-button", {
    template: `
    <svg 
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
        viewBox="0 0 300 100"
    >
        <g 
            v-on:click="on_click"
        >
            <rect x="0" y="0" 
                v-on:click="on_click"
                width="300" height="100"
                rx="15" ry="15"
                fill="#FF0000"></rect>
            <text
                v-on:click="on_click"
                class="noselect"
                x="25" y="70"
                font-size="60"
                style="stroke: #fff; fill: #fff"
            >
                {{ text }}
            </text>
        </g>
    </svg>`,

    props: ["text"],

    methods: {
        on_click: function(e){
            this.$emit("click");
        }
    }
});

},{}],12:[function(require,module,exports){
const constants = require("./constants.js");
function setup_canvas(canvas, width, height) {
    // width & height: css display size
    if(!width || !height){
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
    }
    
    // Set up CSS size.
    canvas.style.width  = width + 'px';
    canvas.style.height = height + 'px';

    // Resize canvas and scale future draws.
    canvas.width = Math.ceil(width * constants.SCALE_FACTOR);
    canvas.height = Math.ceil(height * constants.SCALE_FACTOR);
    //var ctx = canvas.getContext('2d');
    //ctx.scale(scaleFactor, scaleFactor);
}


module.exports = {
    setup_canvas
}

},{"./constants.js":4}]},{},[6]);
