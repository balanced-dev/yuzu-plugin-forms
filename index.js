const formState = require('./_dev/_source/js/form-state');

module.exports = {
    formState: formState,
    initScripts: () => {
        return require.context('./_dev/_source/js/controllers', true, /\.js$/);
    },
    initForYuzuLoader: (config) => {
        config.renderedPartialDirs.splice(0, 0, './node_modules/yuzu-plugin-forms/_dev/_templates/blocks');
        config.renderedPartialDirs.splice(0, 0, './node_modules/yuzu-plugin-forms/_dev/_templates/_dataStructures');
        config.registeredPartialsDirs.splice(0, 0, './node_modules/yuzu-plugin-forms/_dev/_templates/blocks');
        config.dependantDirectories.splice(0, 0, './node_modules/yuzu-plugin-forms/_dev/_templates/blocks');
    },
    initForYuzuApi: (config) => {
        config.api.files.templates.splice(0, 0, './node_modules/yuzu-plugin-forms/_dev/_templates');
    }
};