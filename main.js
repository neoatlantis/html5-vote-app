import "./svg.rotated-option.js";
import "./svg.button.js";


var _id=0; function id(){ return _id++ };




const app = new Vue({
    el: "#app",
    data: {
        hwratio: 1.776,

        show_result: false,

        base: 0,

        choices: [
            { id: id(), src: "images/1.png", text: '起过八' },
            { id: id(), src: "images/1.png", text: '和群友喝酒' },
            { id: id(), src: "images/1.png", text: '参加GORUCK' },
            { id: id(), src: "images/1.png", text: '找到过Klue卡' },
            { id: id(), src: "images/1.png", text: '兑换过珍贵的人头牌' },
            { id: id(), src: "images/1.png", text: '参加XMA的After Party' },
            { id: id(), src: "images/1.png", text: '和本地玩家约饭' },
            { id: id(), src: "images/1.png", text: '参加过MD' },
            { id: id(), src: "images/1.png", text: '组织过IFS' },
        ]

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

