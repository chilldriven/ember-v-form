/* jshint node:true*/
/* eslint-env node */

module.exports = function(/* environment */) {
    return {
        contentSecurityPolicy: {
            'style-src': ['\'self\' \'unsafe-inline\''],
        },
    };
};
