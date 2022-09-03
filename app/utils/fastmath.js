class Sin {

    constructor(period){
        this.period = Math.round(period);
        this.cache = new Float64Array(this.period);

        for(let i=0; i<this.period; i++){   
            this.cache[i] = Math.sin(i / this.period * 2 * Math.PI);
        }
    }

    of(value){
        return this.cache[Math.round(value) % this.period];
    }

}

class Decay {

    constructor(half_life){
        this.T0_5 = Math.round(half_life);
        this.cache = new Float64Array(this.T0_5 * 10);
        for(let i=0; i<this.cache.length; i++){
            this.cache[i] = Math.pow(2, -i/this.T0_5);
        }
    }

    of(value){
        value = Math.round(value);
        if(value < this.cache.length) return this.cache[value];
        return 0;
    }

}




export default {
    Sin, Decay,
}
