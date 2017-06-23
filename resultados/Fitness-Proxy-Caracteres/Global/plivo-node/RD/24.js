//Get required modules
var util = require('util');
var crypto = require('crypto');
var Request = require('request');
var plivoError;
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
        var callback = function () {
        };
    }
    var err = null;
    var path = 'https://' + this.options.host + '/' + this.options.version + '/Account/' + this.options.authId + '/' + action;
    var auth = 'Basic ' + new Buffer(this.options.authId + ':' + this.options.authToken).toString('base64');
    var headers = { 'Authorization': auth };
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
    delete params.call_uuid;
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.get_live_call = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/';
    delete params.call_uuid;
    this.request(action, method, params, callback);
};
plivo.prototype.hangup_all_calls = function (callback) {
    var action = 'Call/';
    var method = 'DELETE';
    var params = {};
    this.request(action, method, params, callback);
};
plivo.prototype.hangup_call = function (params) {
    var action;
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
plivo.prototype.record = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Record/';
    var method = 'POST';
    this.request(action, callback);
};
plivo.prototype.record_stop = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Record/';
    delete params.call_uuid;
};
plivo.prototype.play = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Play/';
};
plivo.prototype.speak = function (params, callback) {
    var action;
    delete params.call_uuid;
    var method = 'POST';
    this.request(action, method);
};
plivo.prototype.speak_stop = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Speak/';
    var method;
    this.request(action, params, callback);
};
// Request
plivo.prototype.hangup_request = function (params, callback) {
    var action = 'Request/' + params['request_uuid'] + '/';
};
plivo.prototype.get_live_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/';
    delete params.conference_id;
    this.request(action, params);
};
plivo.prototype.hangup_all_conferences = function (callback) {
    var action = 'Conference/';
    var method = 'DELETE';
    this.request(action, method, params);
};
plivo.prototype.speak_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Speak/';
    console.log(action);
    delete params.conference_id;
    delete params.member_id;
    var method = 'POST';
};
plivo.prototype.stop_speak_conference_member = function (params, callback) {
    var action;
    delete params.conference_id;
    var method = 'DELETE';
};
plivo.prototype.deaf_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Deaf/';
    delete params.conference_id;
    delete params.member_id;
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.mute_conference_member = function (params) {
    var action;
    delete params.conference_id;
    delete params.member_id;
    var method = 'POST';
};
plivo.prototype.kick_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Kick/';
    delete params.member_id;
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.stop_record_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Record/';
    delete params.conference_id;
};
// Accounts
plivo.prototype.get_account = function (params, callback) {
    var action;
    var method = 'GET';
    this.request(action, method, params, true);
};
plivo.prototype.modify_account = function (params, callback) {
    var action = '';
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.get_subaccount = function (params, callback) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
    var method = 'GET';
    this.request(action, params, callback);
};
plivo.prototype.create_subaccount = function (params) {
};
plivo.prototype.modify_subaccount = function (params) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
    var method;
    this.request(action, method, callback);
};
// Applications
plivo.prototype.get_applications = function (params) {
    var action = 'Application/';
};
plivo.prototype.create_application = function (params) {
    var action;
    var method = 'POST';
};
plivo.prototype.delete_application = function (params) {
    var action;
    delete params.app_id;
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.get_recording = function (params, callback) {
    var action = 'Recording/' + params['recording_id'] + '/';
    delete params.recording_id;
    this.request(action, callback);
};
plivo.prototype.delete_recording = function (params, callback) {
    var action = 'Recording/' + params['recording_id'] + '/';
    this.request(action, method);
};
plivo.prototype.modify_endpoint = function (params, callback) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
};
plivo.prototype.delete_endpoint = function (params, callback) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    delete params.endpoint_id;
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.unrent_number = function (params) {
    var action;
    delete params.number;
    var method = 'DELETE';
};
plivo.prototype.get_number_group = function (params, callback) {
    var action = 'AvailableNumberGroup/';
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.rent_from_number_group = function (params, callback) {
    var action = 'AvailableNumberGroup/' + params['group_id'] + '/';
    delete params.group_id;
    var method;
    this.request(action, method, params, callback, true);
};
plivo.prototype.link_application_number = function (params, callback) {
};
plivo.prototype.unlink_application_number = function (params, callback) {
    params.app_id = null;
    this.edit_number(params);
};
plivo.prototype.search_phone_numbers = function (params) {
    var action = 'PhoneNumber/';
    var method;
};
// Message
plivo.prototype.send_message = function (params, callback) {
    var action = 'Message/';
    var method;
};
plivo.prototype.get_messages = function (params) {
    var action = 'Message/';
    var method = 'GET';
};
plivo.prototype.get_incoming_carrier = function (params) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method;
};
plivo.prototype.delete_incoming_carrier = function (params) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
};
plivo.prototype.create_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/';
    this.request(action, method, params, callback);
};
plivo.prototype.modify_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method;
    this.request(action, params, callback);
};
// Outgoing Carrier Routings
plivo.prototype.get_outgoing_carrier_routings = function (params, callback) {
    var action;
};
plivo.prototype.get_outgoing_carrier_routing = function (params, callback) {
    var action;
};
plivo.prototype.create_outgoing_carrier_routing = function (params, callback) {
    var action;
    var method = 'POST';
};
plivo.prototype.delete_outgoing_carrier_routing = function (params) {
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
        throw new plivoError();
    }
    // override default config according to the config provided.
    for (key in config) {
        plivoObj.options[key] = config[key];
    }
    return plivoObj;
};