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
            var params = {};
        }
    }
    if (!callback) {
        var callback = function () {
        };
    }
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
        Request.put();
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
    delete params.call_uuid;
};
plivo.prototype.get_live_calls = function (params, callback) {
    var action = 'Call/';
    params.status = 'live';
    this.request(action, method, params, true);
};
plivo.prototype.transfer_call = function (params) {
    var action;
    var method = 'POST';
};
plivo.prototype.hangup_all_calls = function (callback) {
    var action = 'Call/';
    var method = 'DELETE';
    var params = {};
    this.request(action, method, params, callback);
};
plivo.prototype.speak = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Speak/';
    delete params.call_uuid;
    var method = 'POST';
};
plivo.prototype.send_digits = function (params, callback) {
    var action;
    delete params.call_uuid;
};
// Request
plivo.prototype.hangup_request = function (params, callback) {
    var action = 'Request/' + params['request_uuid'] + '/';
};
// Conferences
plivo.prototype.get_live_conferences = function (params) {
    var action = 'Conference/';
    var method = 'GET';
};
plivo.prototype.get_live_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/';
    delete params.conference_id;
    var method = 'GET';
    this.request(action, method);
};
plivo.prototype.hangup_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/';
    delete params.conference_id;
    var method = 'DELETE';
};
plivo.prototype.stop_play_conference_member = function (params, callback) {
    var action;
};
plivo.prototype.speak_conference_member = function (params) {
    var action;
    delete params.conference_id;
    var method;
};
plivo.prototype.stop_speak_conference_member = function (params) {
    var action;
};
plivo.prototype.deaf_conference_member = function (params, callback) {
    var action;
    delete params.conference_id;
    delete params.member_id;
    var method;
};
plivo.prototype.undeaf_conference_member = function (params) {
    var action;
    this.request(action, method, params);
};
plivo.prototype.unmute_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Mute/';
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.kick_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Kick/';
    delete params.conference_id;
    delete params.member_id;
    this.request(action, method, params);
};
plivo.prototype.record_conference = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Record/';
    var method = 'POST';
};
// Accounts
plivo.prototype.get_account = function (params) {
    var action = '';
    var method = 'GET';
    this.request(action, method, params, callback, true);
};
plivo.prototype.get_subaccount = function (params, callback) {
    var action;
    var method = 'GET';
};
plivo.prototype.delete_subaccount = function (params, callback) {
    var action;
    delete params.subauth_id;
    var method = 'DELETE';
};
plivo.prototype.modify_application = function (params) {
    var action = 'Application/' + params['app_id'] + '/';
    var method = 'POST';
};
plivo.prototype.delete_application = function (params) {
    var action = 'Application/' + params['app_id'] + '/';
    delete params.app_id;
    var method = 'DELETE';
    this.request(action, params);
};
// Recordings
plivo.prototype.get_recordings = function (params, callback) {
    var action = 'Recording/';
    var method = 'GET';
};
plivo.prototype.get_recording = function (params, callback) {
    var action = 'Recording/' + params['recording_id'] + '/';
    delete params.recording_id;
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.create_endpoint = function (params, callback) {
    var action;
    this.request(action, method, params);
};
plivo.prototype.modify_endpoint = function (params, callback) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    delete params.endpoint_id;
    this.request(action, method, params, callback);
};
plivo.prototype.delete_endpoint = function (params, callback) {
    var action;
    delete params.endpoint_id;
    this.request(action, params, callback);
};
// Numbers
plivo.prototype.get_numbers = function (params) {
    var action = 'Number/';
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.get_number_group = function (params, callback) {
    var action = 'AvailableNumberGroup/';
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.rent_from_number_group = function (params, callback) {
    var action;
    delete params.group_id;
    var method = 'POST';
    this.request(action, method, params, callback, true);
};
plivo.prototype.unlink_application_number = function (params, callback) {
    params.app_id = null;
};
plivo.prototype.search_phone_numbers = function (params, callback) {
    var action = 'PhoneNumber/';
    var method = 'GET';
    this.request(action, method);
};
plivo.prototype.buy_phone_number = function (params, callback) {
    var action;
    delete params.number;
};
// Message
plivo.prototype.send_message = function (params, callback) {
    var action = 'Message/';
    var method;
};
plivo.prototype.get_messages = function (params, callback) {
    var action = 'Message/';
    var method;
};
// Incoming Carriers
plivo.prototype.get_incoming_carriers = function (params, callback) {
    var action = 'IncomingCarrier/';
    var method = 'GET';
};
plivo.prototype.get_incoming_carrier = function (params) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method = 'GET';
};
plivo.prototype.modify_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
};
// Outgoing Carriers
plivo.prototype.get_outgoing_carriers = function (params, callback) {
    var action = 'OutgoingCarrier/';
    this.request(action, method, callback);
};
plivo.prototype.delete_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    this.request(action, method, params);
};
plivo.prototype.modify_outgoing_carrier_routing = function (params) {
    var action;
    var method = 'POST';
    this.request(action, params, callback);
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