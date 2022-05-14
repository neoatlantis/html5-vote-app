(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

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
        text,
        image_id,
        image_src,
        row,
        col,
        size,
        ctx,
        canvas_height
    }){
        this.text = text;
        this.image_id = 0;
        this.image_src = image_src;
        this.image_tile_size = 360;

        this.row = row;
        this.col = col;

        this.size = size;
        this.ctx = ctx;

        this.canvas_height = canvas_height;

        // Oscillating effect

        this.osc_A = this.size * 0.5;
        this.osc_t = 0;
        this.osc_T = 2000;
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
        
        if(this.choosen && this.animating_to_origin){
            const move_dx = target_x0 - this.x;
            const move_err = 5;
            if(Math.abs(move_dx) < move_err){
                // no need to animate anymore
                this.animating_to_origin = false;
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

},{}],2:[function(require,module,exports){
const choices = require("./content.js");
const choices_positions = choices.map((e)=>Math.floor(Math.random()*3));
const { get_image } = require("./resource-loader.js");
const CanvasOption = require("./canvas-option.js");



//////////////////////////////////////////////////////////////////////////////


module.exports = async function init(canvas){
    
    const options_image = await get_image("options");



    const scrollspeed = canvas.height / 500;

    const row_size = Math.round(canvas.width / 4);
    const ctx = canvas.getContext("2d");


    const options_instances = choices.map((choice, choice_i)=>{
        return new CanvasOption({
            text: choice.text,
            image_id: 0,
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
            on_click(touch.clientX, touch.clientY);
        }

        delta_y0_scroll = 0;
    }

    canvas.ontouchmove = (e)=>{
        if(autoscroll) return;
        touchscrolled = true;

        const currenty = e.changedTouches[0].clientY;
        delta_y0_scroll += (currenty - touch_lasty);
        touch_lasty = currenty;
    }
}

},{"./canvas-option.js":1,"./content.js":3,"./resource-loader.js":5}],3:[function(require,module,exports){
var _id=0; function id(){ return _id++ };

const choices = [
    { id: id(), src: "images/1.png", text: "2017 年进群" },
    { id: id(), src: "images/1.png", text: "遭遇火车祥瑞”" },
    { id: id(), src: "images/1.png", text: "和群友们聚餐" },
    { id: id(), src: "images/1.png", text: "和群旗合影" },
    { id: id(), src: "images/1.png", text: "参加 GORUCK" },
    { id: id(), src: "images/1.png", text: "在德国麦当劳吃 McRib" },
    { id: id(), src: "images/1.png", text: "在科隆户外烧烤" },
    { id: id(), src: "images/1.png", text: "在阿姆吃排骨" },
    { id: id(), src: "images/1.png", text: "在苏黎世吃莲花园" },
    { id: id(), src: "images/1.png", text: "住过群友家" },
    { id: id(), src: "images/1.png", text: "参加线上 IFS" },
    { id: id(), src: "images/1.png", text: "在公众号发表文章" },
    { id: id(), src: "images/1.png", text: "和群友组队参加 Anomaly" },
    { id: id(), src: "images/1.png", text: "在 Kaltenberg 搬砖" },
    /*{ id: id(), src: "images/1.png", text: "约饭牌黑了" },
    { id: id(), src: "images/1.png", text: "打赢一场 Anomaly" },
    { id: id(), src: "images/1.png", text: "夜刷 Mission Day" },
    { id: id(), src: "images/1.png", text: "Mission Day 制霸" },
    { id: id(), src: "images/1.png", text: "GORUCK 三连" },
    { id: id(), src: "images/1.png", text: "参加 OCF" },
    { id: id(), src: "images/1.png", text: "鸮过群友" },
    { id: id(), src: "images/1.png", text: "会说玉兰语" },
    { id: id(), src: "images/1.png", text: "找到冷门爱好同好" },
    { id: id(), src: "images/1.png", text: "和群友联机打游戏" },
    { id: id(), src: "images/1.png", text: "群友视频聊天" },
    { id: id(), src: "images/1.png", text: "见到 Ingress 剧情人物" },
    { id: id(), src: "images/1.png", text: "到剧情相关地标朝圣" },
    { id: id(), src: "images/1.png", text: "群友聚会不开游戏" },
    { id: id(), src: "images/1.png", text: "谈一场群内恋爱" },
    { id: id(), src: "images/1.png", text: "穿越英吉利海峡" },
    { id: id(), src: "images/1.png", text: "火车上赶作业" },
    { id: id(), src: "images/1.png", text: "坐通宵大巴" },
    { id: id(), src: "images/1.png", text: "追 NL1331" },
    { id: id(), src: "images/1.png", text: "收到生日礼物" },
    { id: id(), src: "images/1.png", text: "拥有 CSAE 周边" },
    { id: id(), src: "images/1.png", text: "和当地特工成为朋友" },
    { id: id(), src: "images/1.png", text: "向别人安利 Ingress 成功" },
    { id: id(), src: "images/1.png", text: "和群友交换明信片" },
    { id: id(), src: "images/1.png", text: "制作自己的 biocard" },
    { id: id(), src: "images/1.png", text: "满级重生" },*/
];

module.exports = choices;

},{}],4:[function(require,module,exports){
/*import "./svg.option.js";
import "./svg.button.js";
import "./scrolling.js";
*/



async function init(){

    const canvas = document.getElementById("options");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    await require("./choices-menu.js")(canvas);

}

init();

/*

const app = new Vue({
    el: "#app",
    data: {
        show_result: false,
        ready: false,

        choices: choices,
        choices_positions: choices_positions,
        

    },

    computed: {
        selected_choices: function(){
            return this.choices.filter(e=>e.selected);
        }
    },

    methods: {
        on_choice_select: function(id, selected){
            this.choices.filter((e)=>e.id==id)[0].selected = selected;
            this.choices = JSON.parse(JSON.stringify(this.choices));
        },
        on_finished: function(){
            this.show_result = true;
        },

    
    }
});


setTimeout(()=>app.ready=true, 1000);*/

},{"./choices-menu.js":2}],5:[function(require,module,exports){
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

},{}]},{},[4]);
