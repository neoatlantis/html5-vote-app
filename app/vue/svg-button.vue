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
