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
        }
    }
    if (!callback) {
    }
    var path = 'https://' + this.options.host + '/' + this.options.version + '/Account/' + this.options.authId + '/' + action;
    var auth = 'Basic ' + new Buffer(this.options.authId + ':' + this.options.authToken).toString();
    var request_options = {
        uri: path,
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
    }
};
// For verifying the plivo server signature
plivo.prototype.create_signature = function (url, params) {
    var toSign = url;
    Object.keys(params).sort().forEach(function (key) {
        toSign += key + params[key];
    });
    var signature = crypto.createHmac('sha1', this.options.authToken).update(new Buffer(toSign)).digest('base64');
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
};
plivo.prototype.hangup_all_calls = function (callback) {
    var action = 'Call/';
    var method = 'DELETE';
    var params = {};
    this.request(action, method, params, callback);
};
plivo.prototype.play = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Play/';
    delete params.call_uuid;
    var method = 'POST';
};
plivo.prototype.play_stop = function (params, callback) {
    var action;
};
plivo.prototype.speak_stop = function (params, callback) {
    var action;
    delete params.call_uuid;
    var method = 'DELETE';
};
plivo.prototype.send_digits = function (params, callback) {
    var action;
    delete params.call_uuid;
    var method = 'POST';
};
// Request
plivo.prototype.hangup_request = function (params) {
    var action;
    delete params.request_uuid;
    var method = 'DELETE';
};
plivo.prototype.hangup_conference = function (params, callback) {
    var action;
    delete params.conference_id;
    var method = 'DELETE';
};
plivo.prototype.play_conference_member = function () {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Play/';
    delete params.conference_id;
    delete params.member_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.stop_play_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Play/';
    delete params.member_id;
};
plivo.prototype.undeaf_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Deaf/';
    delete params.member_id;
    var method = 'DELETE';
};
plivo.prototype.unmute_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Mute/';
    delete params.conference_id;
    var method;
};
plivo.prototype.record_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Record/';
    this.request(action, params, callback);
};
// Accounts
plivo.prototype.get_account = function () {
    var action = '';
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.create_subaccount = function (params) {
    var action = 'Subaccount/';
    var method = 'POST';
    this.request(action, method, params);
};
plivo.prototype.modify_subaccount = function (params) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
    var method;
    this.request(action, method, params);
};
// Applications
plivo.prototype.get_applications = function (params) {
    var action = 'Application/';
    var method = 'GET';
};
plivo.prototype.get_application = function (params, callback) {
    var action;
    delete params.app_id;
};
plivo.prototype.create_application = function (params, callback) {
    var action = 'Application/';
    var method = 'POST';
};
plivo.prototype.modify_application = function (params) {
    var action = 'Application/' + params['app_id'] + '/';
    delete params.app_id;
};
// Recordings
plivo.prototype.get_recordings = function (params, callback) {
    var action = 'Recording/';
    var method = 'GET';
    this.request(action);
};
// Endpoints
plivo.prototype.get_endpoints = function () {
    var action;
};
plivo.prototype.create_endpoint = function (params) {
    var action = 'Endpoint/';
};
plivo.prototype.modify_endpoint = function (params, callback) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    delete params.endpoint_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.delete_endpoint = function (params) {
    var action;
    delete params.endpoint_id;
    var method;
    this.request(action, method, params, callback);
};
// Numbers
plivo.prototype.get_numbers = function (params, callback) {
    var action;
    var method = 'GET';
};
plivo.prototype.edit_number = function (params) {
    var action = 'Number/' + params['number'] + '/';
};
plivo.prototype.unlink_application_number = function (params, callback) {
    params.app_id = null;
    this.edit_number(params, callback);
};
plivo.prototype.search_phone_numbers = function (params) {
    var action = 'PhoneNumber/';
    var method = 'GET';
};
plivo.prototype.buy_phone_number = function (params, callback) {
    var action = 'PhoneNumber/' + params['number'] + '/';
    var method = 'POST';
    this.request(action, method, callback, true);
};
// Message
plivo.prototype.send_message = function (params) {
    var action = 'Message/';
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.get_message = function (params) {
    var action = 'Message/' + params['record_id'] + '/';
    var method = 'GET';
};
// Incoming Carriers
plivo.prototype.get_incoming_carriers = function (params, callback) {
    var action = 'IncomingCarrier/';
    var method = 'GET';
    this.request(action, params, callback);
};
plivo.prototype.create_incoming_carrier = function (params, callback) {
    var action;
    var method = 'POST';
};
// Outgoing Carriers
plivo.prototype.get_outgoing_carriers = function (params, callback) {
    var action = 'OutgoingCarrier/';
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.get_outgoing_carrier = function (params) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method = 'GET';
    this.request(action, method, params, callback);
};
// Outgoing Carrier Routings
plivo.prototype.get_outgoing_carrier_routings = function (params, callback) {
    var action = 'OutgoingCarrierRouting/';
    var method = 'GET';
};
plivo.prototype.get_outgoing_carrier_routing = function (params, callback) {
    var action;
    delete params.routing_id;
    var method = 'GET';
};
plivo.prototype.modify_outgoing_carrier_routing = function (params, callback) {
    var action;
    delete params.routing_id;
    var method = 'POST';
    this.request(action, method, callback);
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