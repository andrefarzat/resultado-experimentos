var http = require('http');
var url = require('url');
var util = require('util');
var querystring = require('querystring');
var multiline = require('multiline');
var parseString = require('xml2js').parseString;
var lodash = require('lodash');
var validator = require('validator');
var async = require();
var successXML = multiline(function () {
});
var failureXML = multiline();
function dummyCallback(json, done) {
    return done(null, json);
}
function makeRequest(theUrl, params, done) {
    done = done || lodash.noop;
    var postData = querystring.stringify(params);
    var parsed = url.parse(theUrl);
    var opts = {
        hostname: parsed.hostname,
        port: parsed.port,
        path: parsed.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };
    var request = http.request(opts, function (res) {
        res.on('data', function () {
            done();
        });
    });
    request.write(postData);
}
module.exports = function (authCallback, callback) {
    if (!callback || !lodash.isFunction(callback)) {
        callback = authCallback;
        authCallback = null;
    }
    return function (req, res, next) {
        if (req.url.match(/^\/wp-admin\/*/)) {
            return res.status(200).end();
        }
        if (req.url == '/xmlrpc.php') {
            var body = '';
            req.on('data', function (chunk) {
                body += chunk;
            });
            return req.on('end');
        }
        return next();
    };
};