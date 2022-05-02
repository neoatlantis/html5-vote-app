import "./svg.rotated-option.js";




const app = new Vue({
    el: "#app",
    data: {
        hwratio: 1.776,

        base: 0,

        choices: [
            { text: '起过八' },
            { text: '和群友喝酒' },
            { text: '参加GORUCK' },
            { text: '找到过Klue卡' },
            { text: '兑换过珍贵的人头牌' },
            { text: '参加XMA的After Party' },
            { text: '和本地玩家约饭' },
            { text: '参加过MD' },
            { text: '组织过IFS' },
        ]

    }
});

setInterval(function(){






    app.base += 0.3;
}, 97);
