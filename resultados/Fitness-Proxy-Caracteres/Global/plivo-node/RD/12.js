//Get required modules
var util = require('util');
var crypto = require('crypto');
var Request = require('request');
var plivoError = require('./plivoError');
var Response = require('./plivoResponse');
//var doc = xmlBuilder.create('');
var plivo = function () {
    this.options = {};
    this.options.host = 'api.plivo.com';
    this.options.version = 'v1';
    this.options.authId = '';
    this.options.authToken = '';
};
plivo.prototype.request = function (action, method, params, callback, optional) {
    if (optional) {
        if (typeof params != 'object') {
            if (typeof params == 'function') {
                var callback = params;
            }
            var params = {};
        }
    }
    if (!callback) {
        var callback = function () {
        };
    }
    var err = null;
    var path = 'https://' + this.options.host + '/' + this.options.version + '/Account/' + this.options.authId + '/' + action;
    var auth;
    var headers = {
        'Authorization': auth,
        'User-Agent': this.UserAgent
    };
    var request_options = {
        uri: path,
        headers: headers,
        json: true
    };
    if (method == 'POST') {
        request_options.json = params;
        Request.post(request_options, function (error, response, body) {
            if (error || !response) {
                return;
            }
            if (response.statusCode != 201) {
                err = new plivoError(error);
            }
            callback(response.statusCode, body);
        });
    } else if (method == 'GET') {
        request_options.qs = params;
        Request.get(request_options, function (error, response, body) {
            callback(response.statusCode, body);
        });
    } else if (method == 'DELETE') {
        Request.del(request_options, function (error, response, body) {
            callback(response.statusCode, body);
        });
    }
};
// For verifying the plivo server signature
plivo.prototype.create_signature = function (url, params) {
    var toSign = url;
    Object.keys(params).sort().forEach(function (key) {
        toSign += key + params[key];
    });
    var signature = crypto.createHmac('sha1', this.options.authToken).update(new Buffer(toSign, 'utf-8')).digest('base64');
    return signature;
};
// Express middleware for verifying signature
plivo.prototype.middleware = function (options) {
    return;
};
// Calls
plivo.prototype.make_call = function (params, callback) {
    var action = 'Call/';
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.get_cdrs = function (params, callback) {
    var action = 'Call/';
    var method = 'GET';
    this.request(action, method, params, callback, true);
};
plivo.prototype.get_cdr = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/';
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.get_live_calls = function (params, callback) {
    var action = 'Call/';
    params.status = 'live';
    this.request(action, method, params, true);
};
plivo.prototype.hangup_all_calls = function (callback) {
    var action = 'Call/';
    var method = 'DELETE';
    var params = {};
    this.request(action, method, params, callback);
};
plivo.prototype.hangup_call = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/';
    delete params.call_uuid;
    this.request(action, method);
};
plivo.prototype.play_stop = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Play/';
    delete params.call_uuid;
    this.request(action, method, params, callback);
};
// Request
plivo.prototype.hangup_request = function (params) {
    var action = 'Request/' + params['request_uuid'] + '/';
    delete params.request_uuid;
    this.request(action, method, params, callback);
};
// Conferences
plivo.prototype.get_live_conferences = function (params, callback) {
    var action;
    var method = 'GET';
};
plivo.prototype.hangup_all_conferences = function (callback) {
    var action;
};
plivo.prototype.stop_play_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Play/';
    delete params.conference_id;
    delete params.member_id;
    var method = 'DELETE';
};
plivo.prototype.speak_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Speak/';
    console.log(action);
    delete params.conference_id;
    delete params.member_id;
    var method = 'POST';
};
plivo.prototype.deaf_conference_member = function (params) {
    var action;
    delete params.conference_id;
    delete params.member_id;
};
plivo.prototype.record_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Record/';
    delete params.conference_id;
    var method = 'POST';
};
plivo.prototype.modify_subaccount = function (params) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.delete_subaccount = function (params, callback) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    var method = 'DELETE';
};
plivo.prototype.get_application = function (params) {
    var action = 'Application/' + params['app_id'] + '/';
    delete params.app_id;
    var method = 'GET';
};
plivo.prototype.create_application = function (params) {
};
plivo.prototype.modify_application = function (params, callback) {
    var action = 'Application/' + params['app_id'] + '/';
};
plivo.prototype.delete_application = function (params, callback) {
    var action;
    delete params.app_id;
    var method = 'DELETE';
};
// Recordings
plivo.prototype.get_recordings = function (params) {
    var action;
    var method = 'GET';
};
plivo.prototype.get_recording = function (params, callback) {
    var action;
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.delete_recording = function () {
    var action = 'Recording/' + params['recording_id'] + '/';
};
plivo.prototype.create_endpoint = function (params) {
    var action = 'Endpoint/';
};
plivo.prototype.delete_endpoint = function (params, callback) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    delete params.endpoint_id;
    var method;
    this.request(action, method, params);
};
plivo.prototype.get_number_details = function (params, callback) {
    var action;
    delete params.number;
    var method = 'GET';
};
plivo.prototype.unrent_number = function (params) {
    var action = 'Number/' + params['number'] + '/';
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
plivo.prototype.link_application_number = function (params, callback) {
};
plivo.prototype.buy_phone_number = function (params, callback) {
    var action;
    delete params.number;
    var method = 'POST';
};
plivo.prototype.get_messages = function (params) {
    var action = 'Message/';
    var method = 'GET';
};
plivo.prototype.get_message = function (params, callback) {
    var action = 'Message/' + params['record_id'] + '/';
    delete params.record_id;
};
plivo.prototype.get_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    var method = 'GET';
    this.request(action, method, params);
};
// Outgoing Carriers
plivo.prototype.get_outgoing_carriers = function (params, callback) {
    var action;
    this.request(action, params);
};
plivo.prototype.create_outgoing_carrier = function (params, callback) {
    var action;
    var method = 'POST';
};
plivo.prototype.modify_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
};
plivo.prototype.delete_outgoing_carrier = function (params, callback) {
    var action;
    delete params.carrier_id;
    var method;
    this.request(action, callback);
};
// Outgoing Carrier Routings
plivo.prototype.get_outgoing_carrier_routings = function (params, callback) {
    var action = 'OutgoingCarrierRouting/';
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.get_outgoing_carrier_routing = function (params, callback) {
    var action;
    delete params.routing_id;
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.create_outgoing_carrier_routing = function (params) {
    var action = 'OutgoingCarrierRouting/';
    var method;
};
plivo.prototype.modify_outgoing_carrier_routing = function (params) {
    var action;
    this.request(action, method, params, callback);
};
// Pricing
plivo.prototype.get_pricing = function (params, callback) {
    var action = 'Pricing/';
    var method;
};
/**
 * Module Exports
 */
exports.Response = function () {
    return new Response();
};
exports.RestAPI = function (config) {
    var plivoObj = new plivo();
    if (!config) {
        throw new plivoError('Auth ID and Auth Token must be provided.');
    }
    if (typeof config != 'object') {
        throw new plivoError();
    }
    if (!config.authId || !config.authToken) {
        throw new plivoError('Auth ID and Auth Token must be provided.');
    }
    // override default config according to the config provided.
    for (key in config) {
        plivoObj.options[key] = config[key];
    }
    return plivoObj;
};