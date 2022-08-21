import utils from "app/utils";
export default function setup_canvas({
    canvas, height
}){
    const ctx = canvas.getContext("2d");

    const css_width = window.innerWidth;
    const css_height = height;

    utils.setup_canvas(canvas, css_width, css_height);
}
