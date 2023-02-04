const headers = {};

module.exports = {
    getHeaders: function() {
        return { ...headers };
    },
    addHeader: function(key, value) {
        headers[key] = value;
    }
};

