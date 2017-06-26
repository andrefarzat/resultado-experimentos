//Get required modules
var util;
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
        var callback;
    }
    var err;
    var path = 'https://' + this.options.host + '/' + this.options.version + '/Account/' + this.options.authId + '/' + action;
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
                return;
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
plivo.prototype.get_live_calls = function (params) {
    var action;
    var method = 'GET';
};
plivo.prototype.transfer_call = function (params) {
    var action;
};
plivo.prototype.hangup_all_calls = function (callback) {
    var action = 'Call/';
    var method = 'DELETE';
    var params = {};
    this.request(action, method, params, callback);
};
plivo.prototype.record_stop = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Record/';
    delete params.call_uuid;
    var method = 'DELETE';
};
plivo.prototype.speak = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Speak/';
    var method;
};
plivo.prototype.speak_stop = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Speak/';
    delete params.call_uuid;
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
plivo.prototype.send_digits = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/DTMF/';
    delete params.call_uuid;
    var method = 'POST';
    this.request(action, method, params, callback);
};
// Request
plivo.prototype.hangup_request = function (params, callback) {
    var action = 'Request/' + params['request_uuid'] + '/';
    delete params.request_uuid;
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
plivo.prototype.get_live_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/';
    delete params.conference_id;
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.hangup_all_conferences = function (callback) {
    var action = 'Conference/';
    var method = 'DELETE';
    this.request(action, method, params);
};
plivo.prototype.hangup_conference_member = function (params, callback) {
    var action;
    delete params.conference_id;
    delete params.member_id;
    var method;
};
plivo.prototype.stop_play_conference_member = function (params, callback) {
    var action;
    delete params.conference_id;
};
plivo.prototype.mute_conference_member = function (params) {
    var action;
    delete params.member_id;
    var method = 'POST';
};
plivo.prototype.unmute_conference_member = function (params, callback) {
    var action;
    var method = 'DELETE';
    this.request(action, method, callback);
};
plivo.prototype.kick_conference_member = function (params) {
    var action;
    delete params.conference_id;
    delete params.member_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.stop_record_conference = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Record/';
    delete params.conference_id;
    var method;
};
plivo.prototype.modify_account = function (params) {
    var action;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.get_subaccount = function (params, callback) {
    var action;
    var method = 'GET';
};
plivo.prototype.create_subaccount = function (params, callback) {
    var action = 'Subaccount/';
    this.request(action, method, params, callback);
};
plivo.prototype.modify_subaccount = function (params, callback) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    var method;
    this.request(action, method);
};
plivo.prototype.delete_subaccount = function () {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
    this.request(action, method, params, callback);
};
plivo.prototype.get_application = function (params) {
    var action;
    delete params.app_id;
    var method = 'GET';
};
plivo.prototype.delete_application = function (params, callback) {
    var action;
    delete params.app_id;
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
plivo.prototype.delete_recording = function (params, callback) {
    var action = 'Recording/' + params['recording_id'] + '/';
    delete params.recording_id;
    this.request(action, method, params);
};
// Endpoints
plivo.prototype.get_endpoints = function (params, callback) {
    var action = 'Endpoint/';
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.get_endpoint = function (params) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    delete params.endpoint_id;
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.delete_endpoint = function (params, callback) {
    var action;
    delete params.endpoint_id;
};
// Numbers
plivo.prototype.get_numbers = function (params) {
    var action = 'Number/';
};
plivo.prototype.get_number_details = function (params, callback) {
    var action = 'Number/' + params['number'] + '/';
};
plivo.prototype.unrent_number = function (params, callback) {
    var action = 'Number/' + params['number'] + '/';
    delete params.number;
};
plivo.prototype.get_number_group_details = function (params, callback) {
    var action;
    var method = 'GET';
};
plivo.prototype.unlink_application_number = function () {
    params.app_id = null;
};
plivo.prototype.buy_phone_number = function (params) {
    var action = 'PhoneNumber/' + params['number'] + '/';
    delete params.number;
    var method = 'POST';
};
// Message
plivo.prototype.send_message = function (params) {
    var action = 'Message/';
    var method;
};
plivo.prototype.get_messages = function (params) {
};
// Incoming Carriers
plivo.prototype.get_incoming_carriers = function (params) {
    var action = 'IncomingCarrier/';
};
plivo.prototype.delete_incoming_carrier = function (params) {
    var action;
    delete params.carrier_id;
    var method = 'DELETE';
    this.request(action, params, callback);
};
plivo.prototype.create_outgoing_carrier_routing = function (params, callback) {
    var action = 'OutgoingCarrierRouting/';
    var method = 'POST';
};
plivo.prototype.modify_outgoing_carrier_routing = function (params, callback) {
    var action;
    var method = 'POST';
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
    if (!config.authId || !config.authToken) {
        throw new plivoError('Auth ID and Auth Token must be provided.');
    }
    // override default config according to the config provided.
    for (key in config) {
        plivoObj.options[key] = config[key];
    }
    return plivoObj;
};