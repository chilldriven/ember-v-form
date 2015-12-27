/* jshint node: true */
'use strict';

module.exports = {
    name: 'ember-v-form',

    included: function(app) {
        this._super.included(app);

        app.import('bower_components/lodash/lodash.js');
    }
};
