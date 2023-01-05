module.exports = {
    initScripts: () => {
        return require.context('./_dev/_source/js/controllers', true, /\.js$/);
    },
    initForYuzuLoader: (config) => {
        config.renderedPartialDirs.push('./node_modules/yuzu-plugin-forms/_dev/_templates/blocks');
        config.renderedPartialDirs.push('./node_modules/yuzu-plugin-forms/_dev/_templates/_dataStructures');
        config.registeredPartialsDirs.push('./node_modules/yuzu-plugin-forms/_dev/_templates/blocks');
        config.dependantDirectories.push('./node_modules/yuzu-plugin-forms/_dev/_templates/blocks');
    },
    initForYuzuApi: (config) => {
        config.api.files.templates.push('./node_modules/yuzu-plugin-forms/_dev/_templates');
    }
};