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
        <g class="noselect" v-bind:transform="'translate(' + x + ' ' + y + ')'" v-on:click="on_click">
            <g>
                <!--<animateTransform
                    id="rotate1"
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    v-bind:by="rotate"
                    dur="10s"
                    begin="0s;rotate2.end"
                />
                <animateTransform
                    id="rotate2"
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    v-bind:by="-rotate"
                    dur="10s"
                    begin="rotate1.end"
                />-->

                <image class="noselect" x="140" y="0" width="200" height="200" :xlink:href="src" v-bind:filter="!selected?'url(#filter-greyscale)':''"/>
                <circle class="noselect" v-show="selected" cx="320" cy="20" r="50" fill="red"/>
                <text class="noselect" x="0" y="300" font-size="60" v-bind:style="selected?'stroke: #660000; fill: #660000':'stroke: #666600; fill: #666600'">
                    {{ text }}
                </text>
            </g>
        </g>

    `,

    props: ["x", "y", "text", "src"],

    data: function(){ return {
        selected: false,
        rotate: Math.random()*20-10,
    } },

    methods: {

        on_click: function(e){
            this.selected = !this.selected;
            e.preventDefault();
            this.$emit("select", this.selected);
            return false;
        }

    },

});
