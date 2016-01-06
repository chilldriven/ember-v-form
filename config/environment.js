/*jshint node:true*/
'use strict';

module.exports = function(environment) {
    return {
        contentSecurityPolicy: {
            'style-src': ['\'self\' \'unsafe-inline\'']
        }
    };
};
