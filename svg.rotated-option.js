Vue.component("rotated-option", {
    
    template: `
    <g v-bind:transform="'rotate(' + angle + ' 720 -1440)'" v-on:click="selected=!selected">
        <image x="750" v-bind:y="radius-300" width="200" height="200" xlink:href="images/1.png" v-bind:filter="!selected?'url(#filter-greyscale)':''"/>
        <circle v-show="selected" cx="900" v-bind:cy="radius-300" r="50" fill="red"/>
        <text x="720" v-bind:y="radius" font-size="60" v-bind:style="selected?'stroke: #660000; fill: #660000':'stroke: #666600; fill: #666600'">
            {{ text }}
        </text>
    </g>

    `,

    props: ["angle", "text", "radius"],

    data: function(){ return {
        selected: false,
    } },


});
