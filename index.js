const fs = require('fs');
const testFolder = '../_loga/';

const files = fs.readdirSync(testFolder);

files.forEach(file => console.log(file));
