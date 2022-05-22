const { images } = require("./resource-loader.js");

Vue.component("svg-choices-basket", {
    template: `
    <div style="border-radius:1em; width: 10%; height:10%; background-color: #FFFFFF; z-index:30; position:fixed; top: 20%; right: 5%; height:50%; width: 60%; overflow-y: scroll; overflow-x: hidden;">
        <div>
            <ul>
                <li v-for="choice in selected_choices">{{ choice.text }}</li>
            </ul>
        </div>
    </div>
    `,

    props: ["selected_choices"],

    data: function(){ return {
    } },

    methods: {
        on_click: function(e){
            this.$emit("click");
            e.preventDefault();
        }
    },

    mounted: function(){
        //setInterval(()=>make_round(), 100);
    }

});
