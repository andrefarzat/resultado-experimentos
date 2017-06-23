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
    this.UserAgent = 'NodePlivo';
    this.plivoError = plivoError;
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
    var err = null;
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
    var method = 'GET';
};
plivo.prototype.get_live_calls = function (params, callback) {
    var action = 'Call/';
    params.status = 'live';
};
plivo.prototype.transfer_call = function (params, callback) {
    var action;
};
plivo.prototype.hangup_all_calls = function (callback) {
    var action = 'Call/';
    var method = 'DELETE';
    var params = {};
    this.request(action, method, params, callback);
};
plivo.prototype.hangup_call = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/';
    var method = 'DELETE';
};
plivo.prototype.record = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Record/';
    delete params.call_uuid;
    var method = 'POST';
};
plivo.prototype.record_stop = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Record/';
    delete params.call_uuid;
    var method;
};
plivo.prototype.play = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Play/';
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.play_stop = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Play/';
    delete params.call_uuid;
    var method = 'DELETE';
    this.request(action, method, callback);
};
plivo.prototype.speak = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Speak/';
    delete params.call_uuid;
    var method;
};
plivo.prototype.speak_stop = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Speak/';
    delete params.call_uuid;
    var method = 'DELETE';
    this.request(action, params, callback);
};
plivo.prototype.send_digits = function (params) {
    var action;
    delete params.call_uuid;
};
// Conferences
plivo.prototype.get_live_conferences = function (params) {
    var action;
    var method = 'GET';
};
plivo.prototype.get_live_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/';
    var method = 'GET';
};
plivo.prototype.hangup_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/';
    delete params.conference_id;
    delete params.member_id;
    var method = 'DELETE';
};
plivo.prototype.speak_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Speak/';
    console.log(action);
    delete params.conference_id;
    delete params.member_id;
    var method = 'POST';
};
plivo.prototype.deaf_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Deaf/';
    this.request(action, method, params);
};
plivo.prototype.undeaf_conference_member = function (params, callback) {
    var action;
    delete params.conference_id;
    delete params.member_id;
};
plivo.prototype.mute_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Mute/';
    delete params.conference_id;
    delete params.member_id;
};
plivo.prototype.kick_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Kick/';
    delete params.member_id;
    var method = 'POST';
    this.request(action, method);
};
plivo.prototype.record_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Record/';
    delete params.conference_id;
};
plivo.prototype.stop_record_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Record/';
    delete params.conference_id;
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
// Accounts
plivo.prototype.get_account = function (params, callback) {
    var action = '';
    var method = 'GET';
    this.request(action, method, callback, true);
};
plivo.prototype.get_subaccounts = function (params) {
    var action;
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.get_subaccount = function (params, callback) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
    var method = 'GET';
};
plivo.prototype.delete_subaccount = function (params) {
    var action;
    delete params.subauth_id;
};
// Applications
plivo.prototype.get_applications = function (params) {
    var action = 'Application/';
    var method = 'GET';
};
plivo.prototype.get_application = function (params, callback) {
    var action;
    delete params.app_id;
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.create_application = function (params) {
    var action = 'Application/';
    var method = 'POST';
};
plivo.prototype.modify_application = function (params, callback) {
};
// Recordings
plivo.prototype.get_recordings = function (params) {
    var action = 'Recording/';
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.get_recording = function (params, callback) {
    var action;
    delete params.recording_id;
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.delete_recording = function (params, callback) {
    var action = 'Recording/' + params['recording_id'] + '/';
    delete params.recording_id;
    var method = 'DELETE';
    this.request(action);
};
// Endpoints
plivo.prototype.get_endpoints = function (params, callback) {
    var action = 'Endpoint/';
    var method = 'GET';
    this.request(action, params, callback);
};
// Numbers
plivo.prototype.get_numbers = function (params) {
    var action = 'Number/';
    var method = 'GET';
};
plivo.prototype.get_number_group = function (params) {
    var action;
    var method;
};
plivo.prototype.link_application_number = function () {
    this.edit_number(params, callback);
};
plivo.prototype.unlink_application_number = function (params, callback) {
    params.app_id = null;
    this.edit_number(params, callback);
};
plivo.prototype.search_phone_numbers = function (params, callback) {
    var action;
    var method = 'GET';
    this.request(action, method, params);
};
// Message
plivo.prototype.send_message = function (params) {
    var action;
    var method = 'POST';
};
plivo.prototype.get_message = function (params, callback) {
    var action = 'Message/' + params['record_id'] + '/';
};
// Incoming Carriers
plivo.prototype.get_incoming_carriers = function (params) {
    var action = 'IncomingCarrier/';
};
plivo.prototype.create_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/';
};
plivo.prototype.delete_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
// Outgoing Carriers
plivo.prototype.get_outgoing_carriers = function (params, callback) {
    var action;
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.get_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method;
};
plivo.prototype.modify_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    this.request(action, params, callback);
};
// Outgoing Carrier Routings
plivo.prototype.get_outgoing_carrier_routings = function (params, callback) {
    var action = 'OutgoingCarrierRouting/';
    this.request(action, params, callback);
};
plivo.prototype.get_outgoing_carrier_routing = function () {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    var method;
};
plivo.prototype.modify_outgoing_carrier_routing = function (params) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    var method;
    this.request(action, method, params, callback);
};
// Pricing
plivo.prototype.get_pricing = function (params) {
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
    if (!config) {
    }
    if (!config.authId || !config.authToken) {
        throw new plivoError();
    }
    // override default config according to the config provided.
    for (key in config) {
        plivoObj.options[key] = config[key];
    }
    return plivoObj;
};