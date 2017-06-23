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
                return callback(500, body);
            }
            if (response.statusCode != 201) {
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
plivo.prototype.get_cdr = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/';
    delete params.call_uuid;
    var method = 'GET';
};
plivo.prototype.get_live_calls = function (params) {
    var action = 'Call/';
    var method = 'GET';
    params.status = 'live';
};
plivo.prototype.get_live_call = function (params) {
    var action;
    delete params.call_uuid;
    var method;
    params.status = 'live';
};
plivo.prototype.hangup_all_calls = function (callback) {
    var action = 'Call/';
    var method = 'DELETE';
    var params = {};
    this.request(action, method, params, callback);
};
plivo.prototype.hangup_call = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/';
    delete params.call_uuid;
    var method = 'DELETE';
};
plivo.prototype.record = function (params, callback) {
    var action;
    var method = 'POST';
    this.request(action, params);
};
plivo.prototype.record_stop = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Record/';
    var method;
};
plivo.prototype.speak = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Speak/';
};
plivo.prototype.send_digits = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/DTMF/';
    delete params.call_uuid;
    var method = 'POST';
};
// Request
plivo.prototype.hangup_request = function (params) {
    var action;
    var method = 'DELETE';
    this.request(action, method, callback);
};
// Conferences
plivo.prototype.get_live_conferences = function (params) {
    var action = 'Conference/';
    var method = 'GET';
};
plivo.prototype.hangup_all_conferences = function (callback) {
    var action = 'Conference/';
    this.request(action, callback);
};
plivo.prototype.stop_play_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Play/';
    delete params.member_id;
    var method;
};
plivo.prototype.speak_conference_member = function (params, callback) {
    var action;
    console.log(action);
    delete params.member_id;
    var method = 'POST';
    this.request(action, method);
};
plivo.prototype.stop_speak_conference_member = function (params, callback) {
    var action;
};
plivo.prototype.deaf_conference_member = function (params, callback) {
    var action;
    delete params.conference_id;
    delete params.member_id;
    var method = 'POST';
};
plivo.prototype.kick_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Kick/';
    delete params.conference_id;
    delete params.member_id;
    var method;
};
// Accounts
plivo.prototype.get_account = function (params) {
    var action = '';
    var method = 'GET';
};
plivo.prototype.get_subaccounts = function (params, callback) {
    var action = 'Subaccount/';
    var method;
};
plivo.prototype.delete_subaccount = function (params) {
    var action;
    delete params.subauth_id;
    var method = 'DELETE';
};
plivo.prototype.get_application = function (params, callback) {
    var action = 'Application/' + params['app_id'] + '/';
    delete params.app_id;
    var method = 'GET';
};
plivo.prototype.modify_application = function (params) {
    var action = 'Application/' + params['app_id'] + '/';
    var method;
};
plivo.prototype.delete_application = function (params) {
    var action = 'Application/' + params['app_id'] + '/';
    delete params.app_id;
};
// Recordings
plivo.prototype.get_recordings = function (params) {
    var action;
};
plivo.prototype.delete_recording = function (params, callback) {
    var action = 'Recording/' + params['recording_id'] + '/';
    delete params.recording_id;
    this.request(action, method);
};
plivo.prototype.modify_endpoint = function (params, callback) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    delete params.endpoint_id;
    this.request(action, method, params, callback);
};
plivo.prototype.delete_endpoint = function (params) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    delete params.endpoint_id;
    var method;
};
// Numbers
plivo.prototype.get_numbers = function (params, callback) {
    var action = 'Number/';
    var method = 'GET';
};
plivo.prototype.get_number_details = function (params) {
    var action = 'Number/' + params['number'] + '/';
    var method = 'GET';
    this.request(action, params);
};
plivo.prototype.get_number_group = function (params, callback) {
    var action = 'AvailableNumberGroup/';
    var method;
};
plivo.prototype.get_number_group_details = function (params, callback) {
    var action = 'AvailableNumberGroup/' + params['group_id'] + '/';
    delete params.group_id;
};
plivo.prototype.rent_from_number_group = function (params, callback) {
    var action;
    var method = 'POST';
    this.request(action, method, params, callback, true);
};
plivo.prototype.edit_number = function (params, callback) {
    var action = 'Number/' + params['number'] + '/';
};
plivo.prototype.link_application_number = function (params, callback) {
    this.edit_number(params);
};
plivo.prototype.get_message = function (params, callback) {
    var action;
    delete params.record_id;
    var method;
    this.request(action, method, params, callback);
};
// Incoming Carriers
plivo.prototype.get_incoming_carriers = function (params, callback) {
    var action = 'IncomingCarrier/';
    var method = 'GET';
};
plivo.prototype.get_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
};
plivo.prototype.modify_incoming_carrier = function (params, callback) {
    var action;
    delete params.carrier_id;
    var method = 'POST';
};
plivo.prototype.delete_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    var method = 'DELETE';
};
// Outgoing Carriers
plivo.prototype.get_outgoing_carriers = function (params, callback) {
    var action = 'OutgoingCarrier/';
    var method;
};
plivo.prototype.get_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
};
plivo.prototype.create_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/';
    var method = 'POST';
};
plivo.prototype.modify_outgoing_carrier = function () {
    var action;
    delete params.carrier_id;
};
plivo.prototype.delete_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
// Outgoing Carrier Routings
plivo.prototype.get_outgoing_carrier_routings = function (params, callback) {
    var action = 'OutgoingCarrierRouting/';
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
    if (!config.authId || !config.authToken) {
        throw new plivoError('Auth ID and Auth Token must be provided.');
    }
    // override default config according to the config provided.
    for (key in config) {
        plivoObj.options[key] = config[key];
    }
    return plivoObj;
};