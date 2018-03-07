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
      input: [folder + svg, '338:338', 'pad', '80%'],
      output: [folder + 'temp/' + png]
    },
    () => {
      finalSize(png);
    }
  );
};

const makePngs = files => {
  files.forEach(svg => {
    svg2png(svg);
  });
};

const resizePngSmall = files => {
  files.forEach(file => {
    jimp
      .read(folder + file)
      .then(pic =>
        pic
          .autocrop()
          .contain(338, 338)
          .write(folder + 'temp/' + file, () => {
            finalSize(file);
          })
      )
      .catch(e => console.error(e));
  });
};

const finalSize = file => {
  var blank = new jimp(448, 448, 0xffffff00);

  jimp
    .read(folder + 'temp/' + file)
    .then(pic =>
      blank.composite(pic, 55, 55).write(folder + 'png/' + file, () => {
        optimize(file);
        console.log(file);
      })
    )
    .catch(e => console.error(e));
};

const optimize = png => {
  imagemin([folder + 'png/' + png], folder + 'png_final', {
    use: [imageminPngquant()]
  });
};

const handleJpgs = jpg => {
  console.log('RENAMED ' + jpg);
  const newPng = String(jpg)
    .replace('.jpg', '.png')
    .replace('.jpeg', '.png');
  fs.rename(folder + jpg, folder + newPng, e => {
    if (e) {
      console.error(e);
    } else {
      resizePngSmall([newPng]);
    }
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
      del.promise([folder + 'temp', folder + 'png', folder + 'png_final'], {
        force: true
      })
    )
    .then(() => makePngs(files.filter(f => f.endsWith('.svg'))))
    .then(() => resizePngSmall(files.filter(f => f.endsWith('.png'))))
    .then(() =>
      handleJpgs(files.filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg')))
    )
    .catch(e => console.error(e));
};

execute();
