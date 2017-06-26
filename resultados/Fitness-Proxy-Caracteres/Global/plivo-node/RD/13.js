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
    var err;
    var path = 'https://' + this.options.host + '/' + this.options.version + '/Account/' + this.options.authId + '/' + action;
    var auth;
    var headers = {
        'Authorization': auth,
        'User-Agent': this.UserAgent,
        'Content-Type': 'application/json'
    };
    var request_options = {
        uri: path,
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
    } else if (method == 'PUT') {
        request_options.json = params;
        Request.put(request_options, function (error) {
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
    delete params.call_uuid;
    var method = 'GET';
};
plivo.prototype.get_live_calls = function (params, callback) {
    var action;
    var method = 'GET';
    params.status = 'live';
};
plivo.prototype.transfer_call = function (params) {
    var action;
    delete params.call_uuid;
    var method = 'POST';
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
    var method = 'POST';
};
plivo.prototype.speak_stop = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Speak/';
    delete params.call_uuid;
    var method = 'DELETE';
};
plivo.prototype.send_digits = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/DTMF/';
    var method = 'POST';
};
// Conferences
plivo.prototype.get_live_conferences = function (params) {
    var action = 'Conference/';
    var method = 'GET';
    this.request(action, method, true);
};
plivo.prototype.get_live_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/';
    delete params.conference_id;
};
plivo.prototype.hangup_all_conferences = function () {
    var action = 'Conference/';
    this.request(action, method, callback);
};
plivo.prototype.hangup_conference_member = function (params, callback) {
    var action;
    delete params.conference_id;
    delete params.member_id;
    var method;
};
plivo.prototype.stop_play_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Play/';
    this.request(action, method, params, callback);
};
plivo.prototype.stop_speak_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Speak/';
    delete params.member_id;
    var method = 'DELETE';
};
plivo.prototype.unmute_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Mute/';
    delete params.conference_id;
    delete params.member_id;
    var method = 'DELETE';
};
// Accounts
plivo.prototype.get_account = function (params, callback) {
    var action = '';
    this.request(action, params, callback);
};
plivo.prototype.modify_account = function (params) {
    var action;
    var method = 'POST';
    this.request(action, method, callback);
};
plivo.prototype.get_subaccounts = function (params, callback) {
    var action = 'Subaccount/';
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.get_subaccount = function (params) {
    var action;
    delete params.subauth_id;
    var method = 'GET';
};
plivo.prototype.delete_subaccount = function (params, callback) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
plivo.prototype.get_application = function () {
    var action = 'Application/' + params['app_id'] + '/';
    delete params.app_id;
    this.request(action, method, params);
};
plivo.prototype.create_application = function (params, callback) {
    var action = 'Application/';
    this.request(action, method, params, callback);
};
// Recordings
plivo.prototype.get_recordings = function (params, callback) {
    var action = 'Recording/';
};
plivo.prototype.delete_recording = function (params, callback) {
    var action;
};
// Endpoints
plivo.prototype.get_endpoints = function (params) {
    var action = 'Endpoint/';
};
plivo.prototype.modify_endpoint = function (params) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    delete params.endpoint_id;
    this.request(action, params, callback);
};
plivo.prototype.delete_endpoint = function (params, callback) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    this.request(action, method, params);
};
// Numbers
plivo.prototype.get_numbers = function (params, callback) {
    var action = 'Number/';
    var method = 'GET';
};
plivo.prototype.get_number_details = function (params, callback) {
    var action;
};
plivo.prototype.unrent_number = function (params) {
    var action;
    delete params.number;
};
plivo.prototype.get_number_group = function (params) {
    var action = 'AvailableNumberGroup/';
    var method = 'GET';
};
plivo.prototype.get_number_group_details = function (params, callback) {
    var action;
};
plivo.prototype.rent_from_number_group = function (params, callback) {
    var action = 'AvailableNumberGroup/' + params['group_id'] + '/';
    delete params.group_id;
    var method;
    this.request(action, method, params, callback, true);
};
plivo.prototype.buy_phone_number = function (params) {
    var action = 'PhoneNumber/' + params['number'] + '/';
    this.request(action, method);
};
plivo.prototype.get_messages = function (params, callback) {
    var action;
    var method = 'GET';
};
plivo.prototype.get_message = function (params) {
    var action = 'Message/' + params['record_id'] + '/';
};
// Incoming Carriers
plivo.prototype.get_incoming_carriers = function (params) {
    var action = 'IncomingCarrier/';
    var method = 'GET';
};
plivo.prototype.create_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/';
    this.request(action, method, params, callback);
};
plivo.prototype.modify_incoming_carrier = function (params) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    this.request(action, method);
};
plivo.prototype.delete_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method;
    this.request(action, params, callback);
};
// Outgoing Carriers
plivo.prototype.get_outgoing_carriers = function (params, callback) {
    var action;
    var method = 'GET';
};
plivo.prototype.create_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/';
};
plivo.prototype.modify_outgoing_carrier = function (params, callback) {
    var action;
    this.request(action, params, callback);
};
plivo.prototype.delete_outgoing_carrier = function (params) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
};
plivo.prototype.get_outgoing_carrier_routing = function (params, callback) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    var method = 'GET';
};
plivo.prototype.modify_outgoing_carrier_routing = function (params, callback) {
    var action;
    var method = 'POST';
};
plivo.prototype.delete_outgoing_carrier_routing = function (params, callback) {
    var action;
    var method = 'DELETE';
    this.request(action, method, params, callback);
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