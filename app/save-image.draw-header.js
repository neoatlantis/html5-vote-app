const constants = require("./constants.js");

module.exports = function({
    canvas,
    ctx,
    username,
    count
}){
    const width = canvas.width;
    const height = width * constants.RESULT_HEADER_HEIGHT_WIDTH_RATIO;

    const font_size = parseInt(height/5);


    ctx.textAlign = 'right';

    ctx.font = `${font_size}px monospace`;
    ctx.fillStyle = "#AA8800";
    ctx.fillText(
        username,
        width * 0.9,
        height - font_size * 2.5
    );

    ctx.font = `${parseInt(font_size*0.5)}px monospace`;
    ctx.fillText(
        `做过${count}件事`,
        width * 0.9,
        height - font_size * 1.5
    );


    return { height }
}
