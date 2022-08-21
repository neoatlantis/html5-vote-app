class PatternLayer {


    constructor({
        canvas,
        images,
        height,
    }){
        this.canvas = canvas;
        this.total_height = height;

        this.image_pattern = images["pattern_screen"];
        this.scale_pattern = canvas.width / this.image_pattern.width
        this.dh_pattern = this.image_pattern.height * this.scale_pattern;

    }

    get_height(){
        return this.total_height;
    }


    render(){
        const ctx = this.canvas.getContext("2d");

        let offset = 0;
        while(offset < this.total_height){
            ctx.drawImage(
                this.image_pattern,
                0, // dx
                offset, // dy 
                this.canvas.width,
                this.dh_pattern
            );
            offset += this.dh_pattern;
        }
    }

}

export default PatternLayer;
