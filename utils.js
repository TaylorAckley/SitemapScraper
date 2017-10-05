'use strict';

const fs = require('fs');

module.exports.log = function (name, payload) {
    fs.writeFileSync(name, payload);
};