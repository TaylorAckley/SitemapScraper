'use strict';

const fs = require('fs');
const xml2js = require('xml2js');
const r = require('request-promise');
const phantom = require('x-ray-phantom');
const Xray = require('x-ray');

const x = Xray()
    .driver(phantom());

class Scraper {
    constructor(options) {
        this.options = options;
    }

    go() {
        this._getSiteMap();
        return
    }

    _getSiteMap() {
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
        return _urls;
    }
}