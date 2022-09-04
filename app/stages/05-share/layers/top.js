import constants     from "app/constants.js";
import { countries as COUNTRIES, countries_ordered as COUNTRIES_ORDERED } from "app/content.js";


const FLAGS_PER_ROW = 5;
const CHOICES_PER_ROW = 4;


class TopLayer {
    
    constructor({
        canvas,
        images,
        choices,
        countries,
    }){


        this.canvas = canvas;

        this.choices = choices || [];

        if(countries){
            this.countries = countries.map((e)=>e.replace(/[^a-z]/gi, ""));
        } else {
            this.countries = [];
        }

        this.show_choices = this.choices.length > 0;
        this.show_countries = this.countries.length > 0;

        this.image_flags   = images["flags"];
        this.image_choices = images["options"];
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
        ];

        if(this.show_choices){
            this.y_heights.push(["achievements", canvas.width * 0.0457]);
            this.y_heights.push(["gap1/1", this.gap1_height]);
            this.y_heights.push(["choices", this.get_choices_height()]);
            this.y_heights.push(["gap2/2", this.gap2_height]);
        }
        if(this.show_countries){
            this.y_heights.push(["countries", canvas.width * 0.0457]);
            this.y_heights.push(["gap3/1", this.gap1_height]);
            this.y_heights.push(["flags", this.get_flags_height()]);
            this.y_heights.push(["gap4/2", this.gap2_height]);
        }
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

    get_choices_height(){
        // option zone size calc begin
        this.choice_source_tile_size = constants.RESOURCE_ICON_TILE_SIZE;
        this.choice_target_tile_size = this.canvas.width * 0.2213;

        this.choice_row_height = this.canvas.width * 0.2343;
        this.choice_row0_offset = this.get_element_offset("choices"); //0.7324 * this.canvas.width - 0.5 * this.choice_target_tile_size; //       this.dh_header + this.choice_row_height / 2;
        this.choice_col_width = this.canvas.width * 0.2013;
        this.choice_col0_offset = 0.1477 * this.canvas.width - 0.5 * this.choice_target_tile_size;
        this.choice_col_x_offset = this.choice_col_width / 2;
        this.choice_rows = Math.ceil(this.choices.length / CHOICES_PER_ROW);

        return this.choice_rows * this.choice_row_height;
    }

    paste_choice({ ctx, image_id, row, col }){
        // Standard position in source canvas
        let sx = Math.floor(image_id / 10) * this.choice_source_tile_size;
        let sy = (image_id % 10) * this.choice_source_tile_size;

        // dx, dy on target pic
        let dy = this.choice_row0_offset + row * this.choice_row_height;
        let dx = this.choice_col0_offset + col * this.choice_col_width;

        if(row % 2 != 0){
            dx += this.choice_col_x_offset;
        }

        ctx.drawImage(
            this.image_choices,
            sx,
            sy,
            this.choice_source_tile_size,
            this.choice_source_tile_size,
            dx,
            dy,
            this.choice_target_tile_size,
            this.choice_target_tile_size
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

        if(this.show_choices){
            ctx.fillText(
                `我取得了${this.choices.length}个成就`,
                this.canvas.width * 0.0565,
                this.get_element_offset("achievements")
            );

            for(let i=0; i<this.choices.length; i++){
                this.paste_choice({
                    ctx,
                    image_id: this.choices[i],
                    row: Math.floor(i / CHOICES_PER_ROW),
                    col: i % CHOICES_PER_ROW
                });
            }
        }

        if(this.show_countries){
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
