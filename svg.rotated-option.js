Vue.component("rotated-option", {
    
    template: `
    <svg v-on:click="on_click" class="noselect">
        <animateTransform attributeName="transform"
                                  attributeType="XML"
                                  type="rotate"
                                  v-bind:from="(angle+0)  +' 720 -1440'"
                                  v-bind:to  ="(angle+360)+' 720 -1440'"
                                  dur="120s"
                                  repeatCount="indefinite"/>
        <g class="noselect">

            <image class="noselect" x="750" v-bind:y="radius-300" width="200" height="200" :xlink:href="src" v-bind:filter="!selected?'url(#filter-greyscale)':''"/>
            <circle class="noselect" v-show="selected" cx="900" v-bind:cy="radius-300" r="50" fill="red"/>
            <text class="noselect" x="720" v-bind:y="radius" font-size="60" v-bind:style="selected?'stroke: #660000; fill: #660000':'stroke: #666600; fill: #666600'">
                {{ text }}
            </text>

        </g>
    </svg>

    `,

    props: ["angle", "text", "radius", "src"],

    data: function(){ return {
        selected: false,
    } },

    methods: {
        
        on_click: function(e){
            this.selected = !this.selected;
            e.preventDefault();
            this.$emit("select", this.selected);
            return false;
        }

    }


});
