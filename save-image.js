// http://stackoverflow.com/questions/3768565/drawing-a-svg-file-on-a-html5-canvas

var svg = document.querySelector('svg');
var img = document.querySelector('img');
var canvas = document.querySelector('canvas');

// get svg data
var xml = new XMLSerializer().serializeToString(svg);

// make it base64
var svg64 = btoa(xml);
var b64Start = 'data:image/svg+xml;base64,';

// prepend a "header"
var image64 = b64Start + svg64;

// set it as the source of the img element
img.src = image64;

// draw the image onto the canvas
canvas.getContext('2d').drawImage(img, 0, 0);

function dlCanvas() {
  var dt = canvas.toDataURL('image/png'); // << this fails in IE/Edge...
  dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
  dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');
  this.href = dt;
};
document.getElementById('dl').addEventListener('click', dlCanvas, false);
