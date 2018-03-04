const fs = require('fs');
const svgexport = require('svgexport');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const del = require('delete');
const folder = '../_loga/';

const svg2png = svg => {
  const png = svg.replace('svg', 'png');
  svgexport.render(
    {
      input: [folder + svg, '512:512', 'pad', '80%'],
      output: [folder + 'temp/' + png]
    },
    () => {
      optimize(png);
      console.log(svg);
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
  const files = fs.readdirSync(folder);

  del
    .promise([folder + 'temp', folder + 'png_final'], { force: true })
    .then(() => console.log('deleted old files'))
    .then(() => makePngs(files))
    .catch(e => console.error(e));
};

execute();
