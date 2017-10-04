'use strict';

const fs = require('fs');
const xml2js = require('xml2js');
const r = require('request-promise');
const phantom = require('x-ray-phantom');
const Xray = require('x-ray');

const x = Xray()
    .driver(phantom());


r('https://s3-us-west-2.amazonaws.com/ackley-landfill/sitemap.xml')
    .then((res) => {
        fs.writeFileSync('response.json', res);
        let parser = new xml2js.Parser();
        return parser.parseString(res, function (err, result) {
            if (err) {
                console.log(err);
            }
            let urls = [];
            //result.
            console.log(result.urlset.url.length);
            fs.writeFileSync('result.json', JSON.stringify(result.urlset.url));
            console.log('Done');
        });
    })
    .catch((err) => {
        console.log(err);
    });

class Scraper {
    constructor(options) {
        this.options = options;
    }

    go() {
        return -1;
    }

    getSiteMap() {
        r(this.options.uri)
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    _parse(payload) {
        let parser = new xml2js.Parser();
        return parser.parseString(payload, function (err, result) {
            if (err) {
                console.log(err);
            }
        });
    }

    _getURLS(payload) {
        let _urls = [];
        payload.urlset.url.forEach((e) => {
            _urls.push(e.loc[0]);
        }, this);
    }
}