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
    this.UserAgent = 'NodePlivo';
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
    var path = 'https://' + this.options.host + '/' + this.options.version + '/Account/' + this.options.authId + '/' + action;
    var headers;
    var request_options = {
        uri: path,
        json: true
    };
    if (method == 'POST') {
        request_options.json = params;
        Request.post(request_options, function (error, response, body) {
            if (error || !response) {
                return callback(500);
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
    var action;
    delete params.call_uuid;
    var method = 'GET';
    this.request(action, method, callback);
};
plivo.prototype.get_live_calls = function (params) {
    var action = 'Call/';
    params.status = 'live';
    this.request(action, callback);
};
plivo.prototype.transfer_call = function (params) {
};
plivo.prototype.hangup_all_calls = function (callback) {
    var action = 'Call/';
    var method = 'DELETE';
    var params = {};
    this.request(action, method, params, callback);
};
plivo.prototype.play_stop = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Play/';
    delete params.call_uuid;
};
// Request
plivo.prototype.hangup_request = function (params, callback) {
    var action = 'Request/' + params['request_uuid'] + '/';
    delete params.request_uuid;
    var method;
};
// Conferences
plivo.prototype.get_live_conferences = function (params, callback) {
    var action = 'Conference/';
    var method;
};
plivo.prototype.get_live_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/';
    delete params.conference_id;
};
plivo.prototype.play_conference_member = function (params, callback) {
    var action;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.speak_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Speak/';
    delete params.conference_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.stop_speak_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Speak/';
    delete params.member_id;
    var method = 'DELETE';
};
plivo.prototype.kick_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Kick/';
    delete params.conference_id;
    var method = 'POST';
};
plivo.prototype.record_conference = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Record/';
    delete params.conference_id;
    var method = 'POST';
};
// Accounts
plivo.prototype.get_account = function (params, callback) {
    var action = '';
    var method = 'GET';
};
plivo.prototype.modify_account = function (params, callback) {
    var action = '';
    this.request(action, method, params, callback);
};
plivo.prototype.modify_subaccount = function (params, callback) {
    var action;
    delete params.subauth_id;
    var method = 'POST';
    this.request(action, method, params);
};
plivo.prototype.delete_subaccount = function (params, callback) {
    var action;
    var method;
};
// Applications
plivo.prototype.get_applications = function (params, callback) {
    var action = 'Application/';
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.get_application = function (params) {
    var action = 'Application/' + params['app_id'] + '/';
    delete params.app_id;
    var method = 'GET';
};
plivo.prototype.delete_application = function () {
    var action;
    var method;
    this.request(action, method, params);
};
// Recordings
plivo.prototype.get_recordings = function (params) {
    var action = 'Recording/';
    var method = 'GET';
};
plivo.prototype.delete_recording = function (params) {
    var action = 'Recording/' + params['recording_id'] + '/';
    delete params.recording_id;
    var method;
    this.request(action, method, params, callback);
};
// Endpoints
plivo.prototype.get_endpoints = function (params, callback) {
    var action = 'Endpoint/';
    var method = 'GET';
};
plivo.prototype.delete_endpoint = function (params) {
    var action;
    var method;
};
// Numbers
plivo.prototype.get_numbers = function (params, callback) {
    var action = 'Number/';
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.get_number_details = function (params) {
    var action = 'Number/' + params['number'] + '/';
    delete params.number;
    var method = 'GET';
};
plivo.prototype.unrent_number = function (params, callback) {
    var action = 'Number/' + params['number'] + '/';
    this.request(action, method, params);
};
plivo.prototype.get_number_group = function (params) {
    var action = 'AvailableNumberGroup/';
    var method = 'GET';
};
plivo.prototype.rent_from_number_group = function (params, callback) {
    var action;
    delete params.group_id;
    var method = 'POST';
    this.request(action, method, params, callback, true);
};
plivo.prototype.unlink_application_number = function (params, callback) {
    params.app_id = null;
    this.edit_number(params, callback);
};
plivo.prototype.search_phone_numbers = function (params) {
    var action = 'PhoneNumber/';
};
// Message
plivo.prototype.send_message = function (params) {
    var action;
    var method = 'POST';
    this.request(action, method, params);
};
plivo.prototype.get_messages = function (params) {
    var action = 'Message/';
    var method;
};
plivo.prototype.get_message = function (params) {
    var action;
    delete params.record_id;
    var method = 'GET';
    this.request(action, method, params, callback);
};
// Incoming Carriers
plivo.prototype.get_incoming_carriers = function (params, callback) {
    var action = 'IncomingCarrier/';
    this.request(action, method, callback);
};
plivo.prototype.get_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    this.request(action, method, params, callback);
};
plivo.prototype.create_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/';
};
plivo.prototype.delete_incoming_carrier = function (params) {
    var action;
    var method;
};
// Outgoing Carriers
plivo.prototype.get_outgoing_carriers = function (params) {
    var action = 'OutgoingCarrier/';
    var method = 'GET';
};
plivo.prototype.create_outgoing_carrier = function () {
    var action = 'OutgoingCarrier/';
    var method = 'POST';
    this.request(action, method);
};
// Outgoing Carrier Routings
plivo.prototype.get_outgoing_carrier_routings = function (params, callback) {
    var action;
};
plivo.prototype.get_outgoing_carrier_routing = function (params, callback) {
    var action;
    var method = 'GET';
};
plivo.prototype.create_outgoing_carrier_routing = function (params, callback) {
    var action = 'OutgoingCarrierRouting/';
    var method = 'POST';
    this.request(action, method, params);
};
plivo.prototype.modify_outgoing_carrier_routing = function (params, callback) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    delete params.routing_id;
    var method;
    this.request(action, params);
};
plivo.prototype.delete_outgoing_carrier_routing = function (params) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    var method = 'DELETE';
    this.request(action, method, params);
};
// Pricing
plivo.prototype.get_pricing = function (params, callback) {
    var action;
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