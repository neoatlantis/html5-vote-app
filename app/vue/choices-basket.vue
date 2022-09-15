
<template>
    <div 
        style="
            border-radius:16px; background-color: #f2eaf4; z-index:30;
            position:fixed; left: 51.94%; height:50%; width: 40.74%;
            padding-top: 16px;
            padding-bottom: 16px;
            overflow-y: scroll; overflow-x: hidden;
        "
        v-bind:style="{'top':header_height+'px'}"
    >
        <div>
            <ul style="margin: 0px; padding: 0px">
                <li
                    style="
                    border-color: #CCCCCC; border-width: 0 0 1px 0; border-style: dashed; list-style-type: none;
                    color: #666666; font-size: 14.5px;
                    display:flex;
                    " 
                    v-for="choice in selected_choices"
                >
                    <span style="flex-grow:1; margin-left:4px">{{ choice.text }}</span>
                    <img :src="delete_src" @click="on_click_delete(choice.id)" style="width: 14.5px; height: 14.5px; margin-top: 3px; margin-right: 4px;" />
                </li>
            </ul>
        </div>
    </div>




</template>
<script>

import { images } from "app/resource-loader";
const event_of = require("app/events"); 

export default {

    props: ["selected_choices", "header_height"],

    data: function(){ return {
        delete_src: images["choices_delete"].path,
    } },

    methods: {
        on_click_delete: function(id){
            this.$emit("clickdelete", id);
            event_of("stage1").emit("deselect-choice", id);
        }
    },

    mounted: function(){
        //setInterval(()=>make_round(), 100);
    }

}
</script>
