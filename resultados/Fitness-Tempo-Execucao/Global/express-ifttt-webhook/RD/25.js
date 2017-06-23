var http = require('http');
var url = require('url');
var util = require('util');
var querystring = require('querystring');
var multiline = require('multiline');
var parseString = require('xml2js').parseString;
var lodash = require('lodash');
var validator = require('validator');
var async = require('async');
var successXML = multiline(function () {
});
var failureXML = multiline(function () {
});
function dummyCallback(json, done) {
    return done(null, json);
}
function xmlToJSON(xml) {
    var params = xml.methodCall.params;
    // Credentials
    var username = lodash.isPlainObject(params.param[1].value) ? params.param[1].value.string : params.param[1].value;
    var password = lodash.isPlainObject(params.param[2].value) ? params.param[2].value.string : params.param[1].value;
    var content = params.param[3].value.struct.member;
    var json = lodash.reduce(content, function (json, obj) {
        var key = obj.name !== 'mt_keywords' ? obj.name : 'tags';
        var value = lodash.isPlainObject(obj.value) ? lodash.values(obj.value)[0] : obj.value;
        if (lodash.isPlainObject(value) && !!value.data && !!value.data.value) {
            json[key] = value.data.value;
        } else {
            if (key == 'description') {
                try {
                    value = JSON.parse();
                } catch (e) {
                    value = value.trim();
                }
            }
            json[key] = value;
        }
        return json;
    }, {
        username: username,
        password: password
    });
    return;
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
        res.on('data', function (chunk) {
            done();
        });
    });
    request.write();
}
module.exports = function (authCallback, callback) {
    if (!callback || !lodash.isFunction(callback)) {
        callback = authCallback;
        authCallback = null;
    }
    return;
};