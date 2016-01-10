/* jshint node:true */
/* jscs:disable disallowVar */
/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
    var app = new EmberAddon(defaults, {
        // 'ember-cli-bootswatch': {
        //     theme: 'paper',
        //     excludeJS: true,
        //     excludeFonts: true
        // }
    });

    /*
      This build file specifes the options for the dummy test app of this
      addon, located in `/tests/dummy`
      This build file does *not* influence how the addon or the app using it
      behave. You most likely want to be modifying `./index.js` or app's build file
    */
    app.import(app.bowerDirectory + '/select2-bootstrap/select2-bootstrap.css');
    app.import(app.bowerDirectory + '/highlightjs/highlight.pack.js');
    app.import(app.bowerDirectory + '/highlightjs/styles/github.css');

    return app.toTree();
};
