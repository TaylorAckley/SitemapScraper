'use strict';
const Scraper = require('./Scraper');
const utils = require('./utils');

let options = {
    uri: 'https://s3-us-west-2.amazonaws.com/ackley-landfill/sitemap.xml'
};

let scraper = new Scraper(options);

scraper.go()
    .then((res) => {
        utils.log('end.json', res);
    })
    .catch((err) => {
        console.log(err);
    });