const fs = require('fs');
const path = require('path');
const files = [ 
    {
        source: './_dev/_templates/blocks/_formBuilder/formBuilder/parFormBuilderFields.schema',
        dest: '../../_dev/_templates/blocks/_forms/_formBuilder/formBuilder/parFormBuilderFields.schema',
    }
];

console.log(`Yuzu Definition Form Plugin PostInstall`);

files.forEach((file) => {
    if(fs.existsSync('../../package.json')) {
        let destPath = path.dirname(file.dest);
        if(fs.existsSync(destPath) && fs.existsSync(file.dest)) {
            console.log(`${file.dest} already installed, not overwriting`);
            //we have to delete files that have been overwritten in the child site, otherwise we get nasty clashes
            if(fs.existsSync(file.source)) {
                fs.rmSync(file.source);
            }
        }
        else if(!fs.existsSync(file.source))  {
            console.log(`${file.source}, source doesn't exist`);
        }
        else {
            console.log(`Installing file to ${file.dest}`);
            if(!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true })
            }
            fs.renameSync(file.source, file.dest);
        }
    }
})