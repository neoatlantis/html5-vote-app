
<template>
    <div 
        style="border-radius:16px; background-color: #f2eaf4; z-index:30; position:fixed; left: 51.94%; height:50%; width: 40.74%; overflow-y: scroll; overflow-x: hidden;"
        v-bind:style="{'top':header_height+'px'}"
    >
        <div>
            <ul>
                <li v-for="choice in selected_choices">{{ choice.text }}</li>
            </ul>
        </div>
    </div>




</template>
<script>


export default {

    props: ["selected_choices", "header_height"],

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

}
</script>
