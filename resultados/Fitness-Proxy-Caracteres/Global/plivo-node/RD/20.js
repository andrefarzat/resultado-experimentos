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
    this.options.authToken = '';
    this.UserAgent = 'NodePlivo';
    this.plivoError = plivoError;
};
plivo.prototype.request = function (action, method, params, callback, optional) {
    if (optional) {
        if (typeof params != 'object') {
            if (typeof params == 'function') {
                var callback = params;
            }
        }
    }
    var err = null;
    var path = 'https://' + this.options.host + '/' + this.options.version + '/Account/' + this.options.authId + '/' + action;
    var auth;
    var request_options = {
        uri: path,
        json: true
    };
    if (method == 'POST') {
        request_options.json = params;
        Request.post(request_options, function (error, response, body) {
            if (error || !response) {
                return callback(500, body);
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
plivo.prototype.get_cdr = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/';
    delete params.call_uuid;
    var method = 'GET';
};
plivo.prototype.get_live_calls = function (params, callback) {
    var action;
    params.status = 'live';
    this.request(action, method, params, callback, true);
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
};
plivo.prototype.record_stop = function () {
    var action;
    delete params.call_uuid;
};
plivo.prototype.play = function (params, callback) {
    var action;
    delete params.call_uuid;
};
plivo.prototype.play_stop = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Play/';
    var method = 'DELETE';
};
plivo.prototype.send_digits = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/DTMF/';
    delete params.call_uuid;
    var method = 'POST';
    this.request(action, params, callback);
};
// Request
plivo.prototype.hangup_request = function (params) {
    var action = 'Request/' + params['request_uuid'] + '/';
    delete params.request_uuid;
};
// Conferences
plivo.prototype.get_live_conferences = function (params, callback) {
    var action = 'Conference/';
    var method = 'GET';
};
plivo.prototype.hangup_all_conferences = function (callback) {
    var action = 'Conference/';
    var method;
    this.request(action, method, params);
};
plivo.prototype.hangup_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/';
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
plivo.prototype.hangup_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/';
    delete params.conference_id;
    this.request(action, method, params);
};
plivo.prototype.stop_speak_conference_member = function (params) {
    var action;
    delete params.conference_id;
};
plivo.prototype.deaf_conference_member = function (params) {
    var action;
    delete params.conference_id;
    var method;
};
plivo.prototype.kick_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Kick/';
    delete params.member_id;
    var method = 'POST';
    this.request(action, method, callback);
};
plivo.prototype.record_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Record/';
    delete params.conference_id;
};
// Accounts
plivo.prototype.get_account = function (params, callback) {
    var action = '';
    var method = 'GET';
};
plivo.prototype.modify_account = function (params, callback) {
    var action = '';
    var method = 'POST';
};
plivo.prototype.get_subaccount = function (params, callback) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.modify_subaccount = function (params, callback) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
    var method = 'POST';
    this.request(action, params);
};
plivo.prototype.delete_subaccount = function (params, callback) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
    var method = 'DELETE';
};
// Applications
plivo.prototype.get_applications = function (params) {
    var action = 'Application/';
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.create_application = function (params, callback) {
    var action;
    var method = 'POST';
    this.request(action, params, callback);
};
plivo.prototype.modify_application = function (params, callback) {
};
plivo.prototype.delete_application = function (params) {
    var action;
    var method;
};
// Recordings
plivo.prototype.get_recordings = function (params) {
    var action = 'Recording/';
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.get_recording = function (params, callback) {
    var action;
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.get_endpoint = function (params) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    delete params.endpoint_id;
    var method = 'GET';
};
plivo.prototype.create_endpoint = function (params) {
    var action = 'Endpoint/';
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.delete_endpoint = function (params, callback) {
    var action;
    delete params.endpoint_id;
    var method = 'DELETE';
};
plivo.prototype.get_number_details = function (params, callback) {
    var action = 'Number/' + params['number'] + '/';
    delete params.number;
    this.request(action, method, callback);
};
plivo.prototype.unrent_number = function (params, callback) {
    var action;
    this.request(action, params);
};
plivo.prototype.get_number_group = function (params) {
    var action = 'AvailableNumberGroup/';
    var method = 'GET';
};
plivo.prototype.rent_from_number_group = function (params, callback) {
    var action;
    delete params.group_id;
    var method = 'POST';
};
plivo.prototype.edit_number = function (params, callback) {
    var action = 'Number/' + params['number'] + '/';
    var method = 'POST';
};
plivo.prototype.link_application_number = function (params) {
    this.edit_number(params);
};
plivo.prototype.unlink_application_number = function (params, callback) {
    params.app_id = null;
    this.edit_number(params, callback);
};
plivo.prototype.buy_phone_number = function (params) {
    var action = 'PhoneNumber/' + params['number'] + '/';
    delete params.number;
    var method = 'POST';
};
// Message
plivo.prototype.send_message = function (params, callback) {
    var action;
};
plivo.prototype.get_messages = function (params) {
    var action = 'Message/';
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.get_incoming_carrier = function (params) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method;
};
// Outgoing Carriers
plivo.prototype.get_outgoing_carriers = function (params, callback) {
    var action = 'OutgoingCarrier/';
    this.request(action, method, params, callback);
};
plivo.prototype.get_outgoing_carrier = function (params) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method = 'GET';
};
plivo.prototype.create_outgoing_carrier = function (params, callback) {
};
plivo.prototype.create_outgoing_carrier_routing = function (params, callback) {
    var action;
};
plivo.prototype.modify_outgoing_carrier_routing = function (params, callback) {
    var action;
    var method = 'POST';
    this.request(action, method, params);
};
/**
 * Module Exports
 */
exports.Response = function () {
    return new Response();
};
exports.RestAPI = function (config) {
    var plivoObj = new plivo();
    if (!config.authId || !config.authToken) {
        throw new plivoError();
    }
    // override default config according to the config provided.
    for (key in config) {
        plivoObj.options[key] = config[key];
    }
    return plivoObj;
};