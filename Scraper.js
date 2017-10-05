'use strict';

const fs = require('fs');
const P = require('bluebird');
const xml2js = require('xml2js');
const r = require('request-promise');
const phantom = require('x-ray-phantom');
const Xray = require('x-ray');

const utils = require('./utils');

const x = Xray()
    .driver(phantom({
        XSSAuditingEnabled: true,
        loadImages: false,
        webSecurityEnabled: false
    }))
    .concurrency(3)
    .throttle(3, 500);

class Scraper {
    constructor(options) {
        this.options = options;
    }

    go() {
        return new P((resolve, reject) => {
            this._getURLS()
                .then((urls) => {
                    this._getDataFromURL(urls);
                    resolve(urls);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    _getDataFromURL(urls) {
        return new P((resolve, reject) => {
            console.log(urls.length);

            //urls.forEach((url) => {
            // console.log(url);
            x('https://google.com', 'title')((err, obj) => {
                if (err) {
                    console.log('Raising Error');
                    console.log(err);
                }
                console.log(obj);
            });


            //});

        });
    }

    _getURLS() {
        return new P((resolve, reject) => {
            this._getSiteMap()
                .then((sitemap) => {
                    this._parse(sitemap)
                        .then((data) => {
                            this._makeURLS(data)
                                .then((urls) => {
                                    resolve(urls);
                                })
                                .catch((err) => {
                                    reject(err);
                                });
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    _getSiteMap() {
        return new P((resolve, reject) => {
            r(this.options.uri)
                .then((sitemap) => {
                    resolve(sitemap);
                })
                .catch((err) => {
                    reject(err);
                });
        });

    }

    _parse(payload) {
        return new P((resolve, reject) => {
            let parser = new xml2js.Parser();
            return parser.parseString(payload, function (err, result) {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });

    }

    _makeURLS(payload) {
        return new P((resolve, reject) => {
            let _urls = [];
            payload.urlset.url.forEach((e) => {
                _urls.push(e.loc[0]);
            }, this);
            utils.log('urls.json', _urls);
            resolve(_urls);
        });

    }
}

module.exports = Scraper;