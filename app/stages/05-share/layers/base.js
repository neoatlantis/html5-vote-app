class BaseLayer {

    constructor({
        canvas,
        images,
        height
    }){
        this.canvas = canvas;
        this.total_height = height;

        this.image_header = images["base_header"];
        this.image_footer = images["base_footer"];
        this.image_base = images["base"];

        this.scale_header = canvas.width / this.image_header.width;
        this.scale_footer = canvas.width / this.image_footer.width;
        this.scale_base   = canvas.width / this.image_base.width;

        this.dh_header = this.image_header.height * this.scale_header;
        this.dh_footer = this.image_footer.height * this.scale_footer;
        this.dh_base   = this.image_base.height * this.scale_base;

        this.offset_base = this.dh_header;
        this.offset_footer = this.total_height - this.dh_footer;

    }

    get_height(){
        return this.total_height;
    }

    render(){
        const ctx = this.canvas.getContext("2d");

        ctx.drawImage(
            this.image_base,
            0, // dx
            0, // dy 
            this.canvas.width,
            this.canvas.height
        );
        /*
        let offset_base = 0; //this.offset_base;
        while(offset_base < this.total_height){
            ctx.drawImage(
                this.image_base,
                0, // dx
                offset_base, // dy 
                this.canvas.width,
                this.dh_base
            );
            offset_base += this.dh_base;
        }*/

        ctx.drawImage(
            this.image_header,
            0, // dx
            0, // dy, 0
            this.canvas.width,
            this.dh_header,
        );

        ctx.drawImage(
            this.image_footer,
            0, // dx
            this.offset_footer, // dy 
            this.canvas.width,
            this.dh_footer
        );
    }

}


export default BaseLayer;
