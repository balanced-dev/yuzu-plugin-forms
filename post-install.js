const fs = require('fs');
const path = require('path');
const core = require('yuzu-plugin-core');
const files = [ 
    {
        source: './_dev/_templates/blocks/_formBuilder/formBuilder/parFormBuilderFields.schema',
        dest: '../../_dev/_templates/blocks/_forms/_formBuilder/formBuilder/parFormBuilderFields.schema',
    }
];

console.log(`Yuzu Definition Form Plugin PostInstall`);

core.postInstallManageFiles(fs, path, files);