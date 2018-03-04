const fs = require('fs');
const svgexport = require('svgexport');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const del = require('delete');
const folder = '../_loga/';

const svg2png = svg =>
  svgexport.render({
    input: [folder + svg, '512:512', 'pad', '80%'],
    output: [folder + 'temp/' + svg.replace('svg', 'png')]
  });

const makePngs = () => {
  const files = fs.readdirSync(folder);

  // TODO: make this work... it doesn't now
  return new Promise((resolve, reject) => {
    if (files.length > 0) {
      files.forEach(svg => svg2png(svg));
      resolve('converted');
    } else {
      reject('no files');
    }
  });
};

const optimize = () => {
  imagemin([folder + 'temp/*.png'], folder + 'png_final', {
    use: [imageminPngquant()]
  });
};

const execute = () => {
  del
    .promise([folder + 'temp', folder + 'png_final'], {
      force: true
    })
    .then(() => console.log('deleted old files'))
    .then(() => makePngs())
    .then(() => optimize())
    .then(() => {
      console.log('Done!');
    })
    .catch(e => console.error(e));
};

execute();
