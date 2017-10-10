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
        webSecurity: false
    }))
    .concurrency(8)
    .throttle(10, 500);

class Scraper {
    constructor(options) {
        this.options = options;
    }

    go() {
        return new P((resolve, reject) => {
            this._getURLS()
                .then((urls) => {
                    this._loop(urls)
                        .then((data) => {
                            console.log('Num. URLS: ', data.length);
                            let payload = 'URL, Title \n';
                            for (let i = 0; i < data.length; i++) {
                                console.log(15);
                                payload += this._formatRow(data[i]);
                                console.log(payload.length);
                                console.log('Checker: ' + i + ' of ' + data.length);
                                if (i === data.length) {
                                    console.log('Writing results to file');
                                    fs.writeFileSync('result.csv', payload);
                                    resolve(1);
                                }
                            }


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

    _loop(urls) {
        return new P((resolve, reject) => {
            let data = [];
            for (let i = 0; i < urls.length; i++) {
                console.log(`Requesting ${i} of ${urls.length}`);
                this._getDataFromURL(urls[i], i, urls.length)
                    .then((_payload) => {
                        data.push(_payload);
                    })
                    .catch((err) => {
                        reject(err);
                    });
                resolve(data);
            }

        });

    }

    _formatRow(row) {
        return `{$row.url}, {row.title}\n`;
    }

    _getDataFromURL(url, i, len) {
        return new P((resolve, reject) => {
            x(url, 'title')((err, obj) => {
                if (err) {
                    console.log('Raising Error');
                    console.log(err);
                    return reject(err);
                }
                console.log(`** Processing ${i} of ${len}\n`, url);
                console.log(obj);
                let _payload = {
                    url: url,
                    title: obj
                };
                resolve(_payload);
            });
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