/*
    <g v-on:click="on_click" class="noselect">
        <animateTransform attributeName="transform"
                                  attributeType="XML"
                                  type="rotate"
                                  v-bind:from="(angle+0)  +' 720 -1440'"
                                  v-bind:to  ="(angle+360)+' 720 -1440'"
                                  dur="120s"
                                  repeatCount="indefinite"/>
*/

Vue.component("svg-option", {
    
    template: `
    <svg 
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
        viewBox="0 0 720 720"
    >
        <defs>
            <filter id="filter-greyscale">
                <feColorMatrix type="saturate" values="0.10"/>
            </filter>
        </defs>

        <g class="noselect" v-on:click="on_click">
            <g>
                <animateTransform
                    id="translate"
                    attributeName="transform"
                    attributeType="XML"
                    type="translate"
                    v-bind:values="animate"
                    v-bind:dur="(9+2*Math.random()) + 's'"
                    repeatCount="indefinite"
                    restart="always"
                />

                <image class="noselect" x="180" y="200" width="360" height="360" :xlink:href="src" /> <!-- v-bind:filter="!selected?'url(#filter-greyscale)':''"/>-->
                <circle class="noselect" v-show="selected" cx="500" cy="220" r="50" fill="red"/>
                <text class="noselect" x="120" y="700" font-size="60" v-bind:style="selected?'stroke: #660000; fill: #660000':'stroke: #666600; fill: #666600'">
                    {{ text }}
                </text>
            </g>
        </g>
    </svg>
    `,

    props: ["text", "src"],

    data: function(){ 
        const amp = 100;
        const offset = Math.random() * amp - amp / 2;

        return {
            selected: false,
            
            amp: amp,
            offset: offset,
            animate: `0 0;${amp} 0;0 0`,
        }
    },

    methods: {

        on_click: function(e){
            this.selected = !this.selected;
            e.preventDefault();
            this.$emit("select", this.selected);
            return false;
        }

    },

});
