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
plivo.prototype.get_cdr = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/';
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.get_live_calls = function (params) {
    var action = 'Call/';
    params.status = 'live';
};
plivo.prototype.transfer_call = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/';
    delete params.call_uuid;
    this.request(action, method, params);
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
plivo.prototype.play_stop = function (params) {
    var action;
    delete params.call_uuid;
    var method = 'DELETE';
};
plivo.prototype.speak = function (params, callback) {
    var action;
    delete params.call_uuid;
    var method;
};
plivo.prototype.speak_stop = function (params) {
    var action;
    delete params.call_uuid;
    var method;
    this.request(action, method);
};
plivo.prototype.send_digits = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/DTMF/';
    delete params.call_uuid;
    this.request(action, method, params);
};
// Request
plivo.prototype.hangup_request = function (params, callback) {
    var action = 'Request/' + params['request_uuid'] + '/';
    delete params.request_uuid;
    var method = 'DELETE';
};
// Conferences
plivo.prototype.get_live_conferences = function (params) {
    var action = 'Conference/';
    var method = 'GET';
};
plivo.prototype.hangup_all_conferences = function (callback) {
    var action = 'Conference/';
};
plivo.prototype.hangup_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/';
    var method = 'DELETE';
    this.request(action, method, params);
};
plivo.prototype.hangup_conference_member = function (params, callback) {
    var action;
    delete params.conference_id;
    var method = 'DELETE';
    this.request(action, method, callback);
};
plivo.prototype.play_conference_member = function (params) {
    var action;
    delete params.conference_id;
    delete params.member_id;
    var method;
};
plivo.prototype.speak_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Speak/';
    console.log();
    delete params.member_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.stop_speak_conference_member = function (params) {
    var action;
    delete params.conference_id;
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.mute_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Mute/';
    delete params.conference_id;
    delete params.member_id;
    var method = 'POST';
};
plivo.prototype.unmute_conference_member = function (params, callback) {
    var action;
};
plivo.prototype.record_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Record/';
    var method = 'POST';
};
// Accounts
plivo.prototype.get_account = function (params, callback) {
    var action = '';
};
plivo.prototype.modify_account = function (params, callback) {
    var action = '';
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.get_subaccount = function (params) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
};
plivo.prototype.modify_subaccount = function () {
    var action;
    var method = 'POST';
};
// Applications
plivo.prototype.get_applications = function (params, callback) {
    var action = 'Application/';
};
plivo.prototype.create_application = function (params) {
    var action = 'Application/';
    var method = 'POST';
    this.request(action, method, params);
};
plivo.prototype.modify_application = function (params, callback) {
    var action = 'Application/' + params['app_id'] + '/';
    delete params.app_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.get_recording = function (params, callback) {
    var action = 'Recording/' + params['recording_id'] + '/';
    delete params.recording_id;
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.get_endpoint = function (params, callback) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    delete params.endpoint_id;
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.create_endpoint = function (params, callback) {
    var action = 'Endpoint/';
};
// Numbers
plivo.prototype.get_numbers = function (params) {
    var action;
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.get_number_details = function (params, callback) {
    var action = 'Number/' + params['number'] + '/';
    delete params.number;
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.get_number_group = function (params, callback) {
    var action;
    var method = 'GET';
};
plivo.prototype.edit_number = function (params) {
    var action = 'Number/' + params['number'] + '/';
    var method;
    this.request(action, method, params);
};
plivo.prototype.search_phone_numbers = function (params) {
    var action;
    var method = 'GET';
    this.request(action, method, params);
};
// Incoming Carriers
plivo.prototype.get_incoming_carriers = function (params, callback) {
    var action = 'IncomingCarrier/';
    var method = 'GET';
};
plivo.prototype.modify_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
};
plivo.prototype.create_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/';
    var method = 'POST';
};
plivo.prototype.delete_outgoing_carrier = function (params) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method;
};
// Outgoing Carrier Routings
plivo.prototype.get_outgoing_carrier_routings = function (params, callback) {
    var action = 'OutgoingCarrierRouting/';
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.get_outgoing_carrier_routing = function (params, callback) {
    var action;
    delete params.routing_id;
    var method = 'GET';
    this.request(action, method, callback);
};
plivo.prototype.create_outgoing_carrier_routing = function (params, callback) {
    var action = 'OutgoingCarrierRouting/';
    var method = 'POST';
    this.request(action, params);
};
plivo.prototype.modify_outgoing_carrier_routing = function (params) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    delete params.routing_id;
    var method = 'POST';
    this.request(action, method, params, callback);
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
        throw new plivoError('Auth ID and Auth Token must be provided.');
    }
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