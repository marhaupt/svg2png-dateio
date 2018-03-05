const fs = require('fs');
const svgexport = require('svgexport');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const inquirer = require('inquirer');
const jimp = require('jimp');
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
      console.log(svg);
    }
  );
};

const makePngs = files => {
  files.forEach(svg => {
    svg2png(svg);
  });
};

const resizePngs = files => {
  files.forEach(file => {
    jimp
      .read(folder + file)
      .then(pic =>
        pic.contain(512, 512).write(folder + 'temp/' + file, () => {
          optimize(file);
          console.log(file);
        })
      )
      .catch(e => console.error(e));
  });
};

const optimize = png => {
  imagemin([folder + 'temp/' + png], folder + 'png_final', {
    use: [imageminPngquant()]
  });
};

const execute = () => {
  inquirer.registerPrompt('directory', require('inquirer-select-directory'));

  inquirer
    .prompt([
      {
        type: 'directory',
        name: 'from',
        message: 'Kde jsou soubory?\n  . současný adresář, .. nadřazený',
        basePath: folder
      }
    ])
    .then(answer => answer.from)
    .then(folder => (files = fs.readdirSync(folder)))
    .then(() =>
      del.promise([folder + 'temp', folder + 'png_final'], { force: true })
    )
    .then(() => makePngs(files.filter(f => f.endsWith('.svg'))))
    .then(() => resizePngs(files.filter(f => f.endsWith('.png'))))
    .catch(e => console.error(e));
};

execute();
