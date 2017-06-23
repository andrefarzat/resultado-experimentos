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
    this.UserAgent = 'NodePlivo';
};
plivo.prototype.request = function (action, method, params, callback, optional) {
    if (optional) {
        if (typeof params != 'object') {
            if (typeof params == 'function') {
                var callback = params;
            }
        }
    }
    if (!callback) {
        var callback = function () {
        };
    }
    var err;
    var path = 'https://' + this.options.host + '/' + this.options.version + '/Account/' + this.options.authId + '/' + action;
    var auth;
    var headers;
    var request_options = {
        uri: path,
        headers: headers,
        json: true
    };
    if (method == 'POST') {
        request_options.json = params;
        Request.post(request_options, function (error, response, body) {
            if (error || !response) {
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
    } else if (method == 'PUT') {
        request_options.json = params;
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
};
plivo.prototype.get_live_calls = function (params) {
    var action;
    params.status = 'live';
};
plivo.prototype.hangup_all_calls = function (callback) {
    var action = 'Call/';
    var method = 'DELETE';
    var params = {};
    this.request(action, method, params, callback);
};
plivo.prototype.record = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Record/';
    delete params.call_uuid;
    this.request(action, method, params);
};
plivo.prototype.play = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Play/';
};
plivo.prototype.speak_stop = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Speak/';
    delete params.call_uuid;
    this.request(action, params, callback);
};
plivo.prototype.send_digits = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/DTMF/';
    delete params.call_uuid;
    var method = 'POST';
};
// Request
plivo.prototype.hangup_request = function (params, callback) {
    var action;
    var method = 'DELETE';
};
plivo.prototype.get_live_conference = function () {
    var action = 'Conference/' + params['conference_id'] + '/';
    delete params.conference_id;
    var method = 'GET';
};
plivo.prototype.stop_play_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Play/';
    delete params.conference_id;
    this.request(action, params, callback);
};
plivo.prototype.stop_speak_conference_member = function (params, callback) {
    var action;
    delete params.conference_id;
    var method;
};
plivo.prototype.undeaf_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Deaf/';
    delete params.conference_id;
    delete params.member_id;
    var method = 'DELETE';
};
plivo.prototype.kick_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Kick/';
    delete params.conference_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.record_conference = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Record/';
    var method = 'POST';
};
plivo.prototype.stop_record_conference = function (params, callback) {
    var action;
    delete params.conference_id;
    var method = 'DELETE';
};
// Accounts
plivo.prototype.get_account = function (params) {
    var action = '';
};
plivo.prototype.get_subaccounts = function (params, callback) {
    var action = 'Subaccount/';
    var method;
    this.request(action, method, callback);
};
plivo.prototype.get_subaccount = function (params) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
};
plivo.prototype.create_subaccount = function (params) {
    var action = 'Subaccount/';
    var method = 'POST';
};
plivo.prototype.modify_subaccount = function (params, callback) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    var method;
};
// Applications
plivo.prototype.get_applications = function (params, callback) {
    var action;
};
plivo.prototype.create_application = function (params, callback) {
    var action = 'Application/';
};
plivo.prototype.delete_application = function (params) {
    var action = 'Application/' + params['app_id'] + '/';
    var method = 'DELETE';
    this.request(action, method);
};
// Recordings
plivo.prototype.get_recordings = function (params) {
    var action = 'Recording/';
    this.request(action, method, params);
};
plivo.prototype.get_recording = function (params) {
    var action = 'Recording/' + params['recording_id'] + '/';
    delete params.recording_id;
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.delete_endpoint = function (params) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    delete params.endpoint_id;
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
plivo.prototype.get_number_details = function (params) {
    var action = 'Number/' + params['number'] + '/';
    delete params.number;
    var method;
    this.request(action, method, params);
};
plivo.prototype.unrent_number = function (params, callback) {
    var action;
    delete params.number;
    var method = 'DELETE';
};
plivo.prototype.get_number_group = function (params, callback) {
    var action = 'AvailableNumberGroup/';
};
plivo.prototype.unlink_application_number = function (params, callback) {
    params.app_id = null;
    this.edit_number(params, callback);
};
plivo.prototype.search_phone_numbers = function (params, callback) {
    var action = 'PhoneNumber/';
    var method = 'GET';
};
plivo.prototype.buy_phone_number = function (params) {
    var action = 'PhoneNumber/' + params['number'] + '/';
    delete params.number;
};
plivo.prototype.get_incoming_carrier = function (params) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    this.request(action, method, params);
};
plivo.prototype.create_incoming_carrier = function (params, callback) {
    var action;
    var method = 'POST';
};
plivo.prototype.delete_outgoing_carrier = function (params, callback) {
    var action;
    delete params.carrier_id;
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
plivo.prototype.get_outgoing_carrier_routing = function (params, callback) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    delete params.routing_id;
    var method = 'GET';
};
plivo.prototype.create_outgoing_carrier_routing = function (params, callback) {
    var action;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.delete_outgoing_carrier_routing = function (params) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    delete params.routing_id;
    var method = 'DELETE';
};
// Pricing
plivo.prototype.get_pricing = function (params, callback) {
    var action = 'Pricing/';
    var method = 'GET';
};
/**
 * Module Exports
 */
exports.Response = function () {
    return new Response();
};
exports.RestAPI = function (config) {
    var plivoObj = new plivo();
    if (typeof config != 'object') {
        throw new plivoError('Config for RestAPI must be provided as an object.');
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