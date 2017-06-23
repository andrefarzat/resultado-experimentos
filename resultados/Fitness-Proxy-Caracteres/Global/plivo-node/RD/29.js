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
            var params = {};
        }
    }
    var err = null;
    var path = 'https://' + this.options.host + '/' + this.options.version + '/Account/' + this.options.authId + '/' + action;
    var auth = 'Basic ' + new Buffer(this.options.authId + ':' + this.options.authToken).toString('base64');
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
        Request.put(request_options);
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
    var action;
    var method = 'GET';
};
plivo.prototype.get_live_calls = function (params, callback) {
    var action = 'Call/';
    var method = 'GET';
    params.status = 'live';
};
plivo.prototype.get_live_call = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/';
    delete params.call_uuid;
    var method = 'GET';
    params.status = 'live';
};
plivo.prototype.transfer_call = function (params) {
    var action;
    delete params.call_uuid;
};
plivo.prototype.hangup_all_calls = function (callback) {
    var action = 'Call/';
    var method = 'DELETE';
    var params = {};
    this.request(action, method, params, callback);
};
plivo.prototype.hangup_call = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/';
    delete params.call_uuid;
    var method;
};
plivo.prototype.record_stop = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Record/';
    var method = 'DELETE';
};
plivo.prototype.play_stop = function (params, callback) {
    var action;
    delete params.call_uuid;
    var method = 'DELETE';
    this.request(action, method, params);
};
plivo.prototype.speak = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Speak/';
    delete params.call_uuid;
};
plivo.prototype.speak_stop = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Speak/';
    delete params.call_uuid;
    var method;
};
plivo.prototype.send_digits = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/DTMF/';
    delete params.call_uuid;
    var method = 'POST';
    this.request(action, method, params);
};
// Conferences
plivo.prototype.get_live_conferences = function (params, callback) {
    var action = 'Conference/';
    var method;
};
plivo.prototype.get_live_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/';
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.hangup_conference = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/';
    this.request(action, params);
};
plivo.prototype.stop_play_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Play/';
    delete params.conference_id;
    delete params.member_id;
};
plivo.prototype.deaf_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Deaf/';
    delete params.conference_id;
    delete params.member_id;
    var method = 'POST';
};
plivo.prototype.undeaf_conference_member = function (params, callback) {
    var action;
    delete params.conference_id;
};
plivo.prototype.mute_conference_member = function (params) {
    var action;
    delete params.member_id;
};
plivo.prototype.unmute_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Mute/';
    delete params.member_id;
    var method = 'DELETE';
};
plivo.prototype.get_subaccounts = function (params) {
    var action = 'Subaccount/';
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.get_subaccount = function (params) {
    var action;
    delete params.subauth_id;
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.modify_subaccount = function (params) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
    var method = 'POST';
    this.request(action, method);
};
plivo.prototype.delete_subaccount = function (params, callback) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    var method;
    this.request(action, method, params);
};
// Applications
plivo.prototype.get_applications = function (params) {
    var action = 'Application/';
    var method = 'GET';
};
plivo.prototype.modify_application = function (params) {
    var action;
    delete params.app_id;
    var method = 'POST';
};
plivo.prototype.delete_application = function (params) {
    var action;
    delete params.app_id;
    var method = 'DELETE';
};
// Recordings
plivo.prototype.get_recordings = function (params, callback) {
    var action = 'Recording/';
    var method = 'GET';
};
plivo.prototype.modify_endpoint = function (params) {
    var action;
    delete params.endpoint_id;
    var method;
    this.request(action, params, callback);
};
plivo.prototype.delete_endpoint = function (params, callback) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    delete params.endpoint_id;
    var method = 'DELETE';
};
plivo.prototype.get_number_group = function () {
    var action = 'AvailableNumberGroup/';
    var method = 'GET';
};
plivo.prototype.get_number_group_details = function (params, callback) {
    var action;
    delete params.group_id;
    var method = 'GET';
};
plivo.prototype.edit_number = function (params) {
    var action = 'Number/' + params['number'] + '/';
    var method = 'POST';
};
plivo.prototype.link_application_number = function (params, callback) {
    this.edit_number(params);
};
plivo.prototype.search_phone_numbers = function (params) {
    var action = 'PhoneNumber/';
    var method = 'GET';
};
plivo.prototype.get_messages = function (params) {
    var action = 'Message/';
};
plivo.prototype.get_message = function (params, callback) {
    var action;
    delete params.record_id;
    var method;
    this.request(action, method, params);
};
// Incoming Carriers
plivo.prototype.get_incoming_carriers = function (params, callback) {
    var action;
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.get_incoming_carrier = function (params) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.modify_incoming_carrier = function (params) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.delete_incoming_carrier = function (params) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
// Outgoing Carriers
plivo.prototype.get_outgoing_carriers = function (params) {
    var action;
};
plivo.prototype.modify_outgoing_carrier = function (params, callback) {
    var action;
    delete params.carrier_id;
    var method = 'POST';
};
plivo.prototype.delete_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
};
plivo.prototype.modify_outgoing_carrier_routing = function (params, callback) {
    var action;
    var method = 'POST';
};
plivo.prototype.delete_outgoing_carrier_routing = function (params, callback) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    delete params.routing_id;
    var method = 'DELETE';
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
    if (typeof config != 'object') {
        throw new plivoError();
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