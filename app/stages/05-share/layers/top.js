import constants     from "app/constants.js";
import { countries as COUNTRIES, countries_ordered as COUNTRIES_ORDERED } from "app/content.js";


const FLAGS_PER_ROW = 5;
const OPTIONS_PER_ROW = 4;


class TopLayer {
    
    constructor({
        canvas,
        images,
        options,
        countries,
    }){


        this.canvas = canvas;

        this.options = Array.from(Array(20).keys());

        if(countries){
            this.countries = countries.map((e)=>e.replace(/[^a-z]/gi, ""));
        } else {
            this.countries = [];
        }

        this.image_flags   = images["flags"];
        this.image_options = images["options"];
        this.image_header = images["top_header"];
        this.image_footer = images["top_footer"];

        this.scale_header = canvas.width / this.image_header.width;
        this.scale_footer = canvas.width / this.image_footer.width;

        this.dh_header = this.image_header.height * this.scale_header;
        this.dh_footer = this.image_footer.height * this.scale_footer;

        this.gap1_height = canvas.width * 0.048;
        this.gap2_height = canvas.width * 0.14;

        /*
         * HEADER
         * ACHIEVEMENTS (TEXT)
         * GAP1/1
         * OPTIONS (ICONS ARRAY)
         * GAP2/2
         * COUNTRIES (TEXT)
         * GAP3/1
         * FLAGS (ICONS ARRAY)
         * GAP4/2
         * FOOTER
         */
        this.y_heights = [
            ["header", this.dh_header],
            ["gap0", canvas.width*0.5864 - this.dh_header],
            ["achievements", canvas.width * 0.0457],
            ["gap1/1", this.gap1_height]
        ];
        this.y_heights.push(["options", this.get_options_height()]);
        this.y_heights.push(["gap2/2", this.gap2_height]);
        this.y_heights.push(["countries", canvas.width * 0.0457]);
        this.y_heights.push(["gap3/1", this.gap1_height]);
        this.y_heights.push(["flags", this.get_flags_height()]);
        this.y_heights.push(["gap4/2", this.gap2_height]);
        this.y_heights.push(["footer", this.dh_footer]);

        this.total_height = this.y_heights.reduce(
            (prev, cur)=>prev + cur[1], 0);
    }

    get_element_height(name){
        return this.y_heights.filter((e)=>e[0]==name)[0][1];
    }

    get_element_offset(name){
        let sum = 0;
        for(let i=0; i<this.y_heights.length; i++){
            if(this.y_heights[i][0] == name) break;
            sum += this.y_heights[i][1];
        }
        return sum;
    }

    get_height(){
        return this.total_height;
    }

    get_options_height(){
        // option zone size calc begin
        this.option_source_tile_size = constants.RESOURCE_ICON_TILE_SIZE;
        this.option_target_tile_size = this.canvas.width * 0.2213;

        this.option_row_height = this.canvas.width * 0.2343;
        this.option_row0_offset = this.get_element_offset("options"); //0.7324 * this.canvas.width - 0.5 * this.option_target_tile_size; //       this.dh_header + this.option_row_height / 2;
        this.option_col_width = this.canvas.width * 0.2013;
        this.option_col0_offset = 0.1477 * this.canvas.width - 0.5 * this.option_target_tile_size;
        this.option_col_x_offset = this.option_col_width / 2;
        this.option_rows = Math.ceil(this.options.length / OPTIONS_PER_ROW);

        return this.option_rows * this.option_row_height;
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

    
    get_flags_height(){
        const sq3 = Math.sqrt(3);

        // flags zone size calc begin
        this.flag_source_tile_width = this.image_flags.width;
        this.flag_source_tile_height= this.image_flags.height / COUNTRIES_ORDERED.length;

        this.flag_target_tile_width = this.canvas.width * 0.1315;
        this.flag_target_tile_side_size = this.flag_target_tile_width / sq3;
        this.flag_target_tile_height = this.flag_target_tile_side_size * 2;

        this.flag_row_height = this.canvas.width * 0.1287;
        this.flag_row0_offset = this.get_element_offset("flags");
        this.flag_col_width = this.canvas.width * 0.1565;
        this.flag_col0_offset = 0.1491 * this.canvas.width - 0.5 * this.flag_target_tile_width;
        this.flag_col_x_offset = this.flag_col_width / 2;
        this.flag_rows = Math.ceil(this.countries.length / FLAGS_PER_ROW);

        return this.flag_rows * this.flag_row_height;
    }

    paste_flag({ ctx, country_name, row, col }){
        let country_i = COUNTRIES_ORDERED.indexOf(country_name);
        if(country_i < 0) throw Error("Unknown country name:", country_name);


        let sx = 0,
            sy = this.flag_source_tile_height * country_i;

        // dx, dy on target pic
        let dy = this.flag_row0_offset + row * this.flag_row_height;
        let dx = this.flag_col0_offset + col * this.flag_col_width;

        if(row % 2 != 0){
            dx += this.flag_col_x_offset;
        }

        ctx.drawImage(
            this.image_flags,
            sx,
            sy,
            this.flag_source_tile_width,
            this.flag_source_tile_height,
            dx,
            dy,
            this.flag_target_tile_width,
            this.flag_target_tile_height
        );
    }



    render(){
        const ctx = this.canvas.getContext("2d");

        const desc_font_size = this.canvas.width * 0.0457;
        ctx.font = `${desc_font_size}px font_main`;
        ctx.fillStyle = "#191654";
        

        ctx.drawImage(
            this.image_header,
            0, // dx
            this.get_element_offset("header"),
            this.canvas.width,
            this.get_element_height("header"),
        );

        ctx.fillText(
            `我取得了${this.options.length}个成就`,
            this.canvas.width * 0.0565,
            this.get_element_offset("achievements")
        );

        for(let i=0; i<this.options.length; i++){
            this.paste_option({
                ctx,
                image_id: this.options[i],
                row: Math.floor(i / OPTIONS_PER_ROW),
                col: i % OPTIONS_PER_ROW
            });
        }

        ctx.fillText(
            `我去过${this.countries.length}个国家`,
            this.canvas.width * 0.0565,
            this.get_element_offset("countries")
        );

        for(let i=0; i<this.countries.length; i++){
            this.paste_flag({
                ctx,
                country_name: this.countries[i],
                row: Math.floor(i / FLAGS_PER_ROW),
                col: i % FLAGS_PER_ROW
            });
        }

        ctx.drawImage(
            this.image_footer,
            0, // dx
            this.get_element_offset("footer"),
            this.canvas.width,
            this.get_element_height("footer")
        );
    }


}


export default TopLayer;
