import constants    from "app/constants.js";

class TopLayer {
    
    constructor({
        canvas,
        images,
        options,
        countries
    }){
        this.canvas = canvas;

        this.options = Array.from(Array(100).keys());

        this.image_options = images["options"];
        this.image_header = images["top_header"];
        this.image_footer = images["top_footer"];

        this.scale_header = canvas.width / this.image_header.width;
        this.scale_footer = canvas.width / this.image_footer.width;

        this.dh_header = this.image_header.height * this.scale_header;
        this.dh_footer = this.image_footer.height * this.scale_footer;
        this.dh_content = this.get_content_height();

        this.offset_footer = this.dh_header + this.dh_content; 

        this.total_height = this.dh_header + this.dh_content + this.dh_footer;
    }

    get_content_height(){
        // option zone size calc begin
        this.option_source_tile_size = constants.RESOURCE_ICON_TILE_SIZE;
        this.option_target_tile_size = this.canvas.width * 0.2213;

        this.option_row_height = this.canvas.width * 0.2343;
        this.option_row0_offset = 0.7324 * this.canvas.width - 0.5 * this.option_target_tile_size; //       this.dh_header + this.option_row_height / 2;
        this.option_col_width = this.canvas.width * 0.2013;
        this.option_col0_offset = 0.1477 * this.canvas.width - 0.5 * this.option_target_tile_size;
        this.option_col_x_offset = this.option_col_width / 2;
        this.option_rows = Math.ceil(this.options.length / 4);


        return (this.option_rows + 2) * this.option_row_height;
    }

    get_height(){
        return this.total_height;
    }

    paste_option({ ctx, image_id, row, col }){
        // Standard position in source canvas
        let sx = Math.floor(image_id / 10) * this.option_source_tile_size;
        let sy = (image_id % 10) * this.option_source_tile_size;

        // dx, dy on target pic
        let dy = this.option_row0_offset + row * this.option_row_height;
        let dx = this.option_col0_offset + col * this.option_col_width;

        if(row % 2 != 0){
            dx += this.option_col_x_offset;
        }

        ctx.drawImage(
            this.image_options,
            sx,
            sy,
            this.option_source_tile_size,
            this.option_source_tile_size,
            dx,
            dy,
            this.option_target_tile_size,
            this.option_target_tile_size
        );


    }

    render(){
        const ctx = this.canvas.getContext("2d");


        ctx.drawImage(
            this.image_header,
            0, // dx
            0, // dy, 0
            this.canvas.width,
            this.dh_header,
        );

        for(let i=0; i<this.options.length; i++){
            this.paste_option({
                ctx,
                image_id: this.options[i],
                row: Math.floor(i / 4),
                col: i % 4
            });
        }

        ctx.drawImage(
            this.image_footer,
            0, // dx
            this.offset_footer, // dy 
            this.canvas.width,
            this.dh_footer
        );
    }


}


export default TopLayer;
