'use strict()';

const fs = require('fs');
const xml2js = require('xml2js');
const r = require('request-promise');
const phantom = require('x-ray-phantom');
const Xray = require('x-ray');

const x = Xray()
    .driver(phantom());

let options = {
    uri: 'https://theta.pep.siemens.knowledgeanywhere.com/sitemap.xml',

}

r('https://theta.pep.siemens.knowledgeanywhere.com/sitemap.xml')
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
/*

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/foo.xml', function (err, data) {
    parser.parseString(data, function (err, result) {
        console.dir(result);
        console.log('Done');
    });
});

x('http://google.com', 'title')(function (err, str) {
    if (err) return done(err);
    assert.equal('Google', str);
    done();
}) */