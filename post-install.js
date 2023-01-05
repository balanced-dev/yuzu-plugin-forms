const fs = require('fs');
const files = [ 
    {
        source: './_dev/_templates/blocks/_formBuilder/formBuilder/parFormBuilderFields.schema',
        dest: '../../_dev/_templates/blocks/parFormBuilderFields.schema',
    }
];

console.log(`Yuzu Definition Forms Plugin PostInstall`);

files.forEach((file) => {
    if(fs.existsSync(file.dest)) {
        console.log(`${file.dest} already installed, not overwriting`);
    }
    else if(!fs.existsSync(file.source))  {
        console.log(`${file.source}, source doesn't exist`);
    }
    else {
        console.log(`Installing file to ${file.dest}`);
        fs.renameSync(file.source, file.dest);
    }
})