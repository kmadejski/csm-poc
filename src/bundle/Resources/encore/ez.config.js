const path = require('path');

module.exports = (Encore) => {
    Encore.addEntry('verses-css', [
        path.resolve(__dirname, '../public/css/verses.css')
    ]);
    Encore.addEntry('verses-js', [
        path.resolve(__dirname, '../public/js/verses.js')
    ]);
};

