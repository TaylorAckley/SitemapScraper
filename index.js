'use strict';
const Scraper = require('Scraper');

let options = {
    uri: 'https://s3-us-west-2.amazonaws.com/ackley-landfill/sitemap.xml'
};

let scraper = new Scraper(options);