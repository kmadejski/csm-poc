const path = require('path');

module.exports = (Encore) => {
    Encore.addEntry('verses-css', [
        path.resolve('./web/bundles/ezplatformadminui/scss/_mixins.scss'),
        path.resolve(__dirname, '../public/scss/verses.scss'),
    ]);
    Encore.addEntry('verses-js', [
        path.resolve('./web/bundles/ezplatformadminui/js/scripts/fieldType/base/base-field.js'),
        path.resolve('./web/bundles/ezplatformadminui/js/scripts/fieldType/base/base-rich-text.js'),
        path.resolve('./web/bundles/ezplatformadminui/js/scripts/fieldType/ezrichtext.js'),
        path.resolve(__dirname, '../public/js/verses.js'),
    ]);
};
