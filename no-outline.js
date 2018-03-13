const fs = require('fs');
const svgexport = require('svgexport');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const del = require('delete');
let folder = './loga/';
let files = [];

const svg2png = svg => {
  const png = svg.replace('svg', 'png');
  svgexport.render(
    {
      input: [folder + svg, '512:512', 'pad', '80%'],
      output: [folder + 'temp/' + png]
    },
    () => {
      optimize(png);
    }
  );
};

const makePngs = files => {
  files.forEach(svg => {
    svg2png(svg);
  });
};

const optimize = png => {
  imagemin([folder + 'temp/' + png], folder + 'png_final', {
    use: [imageminPngquant()]
  });
};

const execute = () => {
  files = fs.readdirSync(folder);
  del
    .promise([folder + 'temp', folder + 'png', folder + 'png_final'], {
      force: true
    })
    .then(() => makePngs(files.filter(f => f.endsWith('.svg'))))
    .catch(e => console.error(e));
};

execute();
