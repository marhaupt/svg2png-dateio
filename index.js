const fs = require('fs');
const svgexport = require('svgexport');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const folder = '../_loga/';

const files = fs.readdirSync(folder);

const svg2png = svg =>
  svgexport.render({
    input: [folder + svg, '512:512', 'pad', '2%'],
    output: [folder + 'temp/' + svg.replace('svg', 'png')]
  });

files.forEach(svg => svg2png(svg));

imagemin([folder + 'temp/*.png'], folder + 'png_final', {
  use: [imageminPngquant()]
}).then(() => {
  console.log('Images optimized');
});
