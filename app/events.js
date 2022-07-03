// Events dispatcher


const events = require("events");

const emitters = {};

const slots = ["canvas", "stage1", "stage2", "stage3", "stage4"];

for(let s of slots){
    emitters[s] = new events.EventEmitter();
}

module.exports = function(s){
    return emitters[s];
}
