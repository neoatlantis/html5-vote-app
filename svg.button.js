Vue.component("svg-button", {
    template: `
    <g 
        v-bind:transform="'translate(' + x + ' ' + y + ') translate(-150 0)'"
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
    </g>`,

    props: ["x", "y", "text"],

    methods: {
        on_click: function(e){
            this.$emit("click");
        }
    }
});
