const fs = require('fs');
const svgexport = require('svgexport');
const folder = '../_loga/';

const files = fs.readdirSync(folder);

const export2png = svg =>
  svgexport.render({
    input: [folder + svg, '512:512', 'pad', '2%'],
    output: ['../_loga/png/' + svg.replace('svg', 'png')]
  });

files.forEach(svg => export2png(svg));
