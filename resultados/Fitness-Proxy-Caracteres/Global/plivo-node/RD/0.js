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
    var auth;
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
            callback(response.statusCode);
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
    var action = 'Call/';
    params.status = 'live';
};
plivo.prototype.transfer_call = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/';
    delete params.call_uuid;
    this.request(action, method, params, callback);
};
plivo.prototype.hangup_all_calls = function (callback) {
    var action = 'Call/';
    var method = 'DELETE';
    var params;
    this.request(action, method, params, callback);
};
plivo.prototype.hangup_call = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/';
    var method = 'DELETE';
};
plivo.prototype.record_stop = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Record/';
    delete params.call_uuid;
    var method = 'DELETE';
    this.request(action);
};
plivo.prototype.play = function (params, callback) {
    var action;
    delete params.call_uuid;
    this.request(action, method, callback);
};
plivo.prototype.speak = function (params, callback) {
    var action;
    delete params.call_uuid;
    var method = 'POST';
};
plivo.prototype.send_digits = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/DTMF/';
    this.request(action, method, params);
};
// Conferences
plivo.prototype.get_live_conferences = function (params, callback) {
    var action = 'Conference/';
    var method = 'GET';
    this.request(action, method, params, true);
};
plivo.prototype.get_live_conference = function (params, callback) {
    var action;
    var method = 'GET';
};
plivo.prototype.hangup_conference_member = function () {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/';
    delete params.conference_id;
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
plivo.prototype.play_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Play/';
    var method = 'POST';
    this.request(action, method);
};
plivo.prototype.stop_speak_conference_member = function (params, callback) {
    var action;
    delete params.member_id;
    this.request(action, params, callback);
};
plivo.prototype.deaf_conference_member = function (params, callback) {
    var action;
    delete params.conference_id;
    delete params.member_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.unmute_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Mute/';
    delete params.member_id;
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
plivo.prototype.stop_record_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Record/';
};
plivo.prototype.create_subaccount = function (params, callback) {
    var action = 'Subaccount/';
    var method = 'POST';
};
plivo.prototype.modify_subaccount = function (params) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    var method = 'POST';
};
// Applications
plivo.prototype.get_applications = function (params, callback) {
    var action = 'Application/';
    var method = 'GET';
};
plivo.prototype.create_application = function (params, callback) {
    var action = 'Application/';
    var method = 'POST';
};
plivo.prototype.delete_application = function (params, callback) {
    var action = 'Application/' + params['app_id'] + '/';
    this.request(action, method, params);
};
// Recordings
plivo.prototype.get_recordings = function (params, callback) {
    var action;
    var method = 'GET';
};
plivo.prototype.delete_endpoint = function (params, callback) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    this.request(action, params);
};
// Numbers
plivo.prototype.get_numbers = function (params) {
    var action = 'Number/';
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.get_number_details = function (params) {
    var action = 'Number/' + params['number'] + '/';
    delete params.number;
};
plivo.prototype.unrent_number = function (params, callback) {
    var action = 'Number/' + params['number'] + '/';
    delete params.number;
    var method;
    this.request(action, params, callback);
};
plivo.prototype.get_number_group = function (params, callback) {
    var action = 'AvailableNumberGroup/';
    var method = 'GET';
};
plivo.prototype.edit_number = function (params) {
    var action;
    delete params.number;
};
plivo.prototype.link_application_number = function (params) {
};
plivo.prototype.unlink_application_number = function (params, callback) {
};
plivo.prototype.buy_phone_number = function (params, callback) {
    var action = 'PhoneNumber/' + params['number'] + '/';
    delete params.number;
};
plivo.prototype.get_messages = function (params, callback) {
    var action;
    var method = 'GET';
};
// Incoming Carriers
plivo.prototype.get_incoming_carriers = function (params) {
};
plivo.prototype.get_incoming_carrier = function (params, callback) {
    var action;
    delete params.carrier_id;
    var method = 'GET';
    this.request(action, params, callback);
};
plivo.prototype.create_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/';
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.get_outgoing_carrier = function (params) {
    var action;
    delete params.carrier_id;
    var method = 'GET';
};
plivo.prototype.create_outgoing_carrier = function () {
    var action = 'OutgoingCarrier/';
    var method = 'POST';
};
plivo.prototype.modify_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
};
// Outgoing Carrier Routings
plivo.prototype.get_outgoing_carrier_routings = function (params) {
    var action = 'OutgoingCarrierRouting/';
    this.request(action, method);
};
plivo.prototype.get_outgoing_carrier_routing = function (params, callback) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    delete params.routing_id;
    var method = 'GET';
};
plivo.prototype.create_outgoing_carrier_routing = function (params) {
    var action = 'OutgoingCarrierRouting/';
    var method = 'POST';
};
plivo.prototype.modify_outgoing_carrier_routing = function (params) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
};
plivo.prototype.delete_outgoing_carrier_routing = function (params) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    delete params.routing_id;
    var method;
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
    if (!config.authId || !config.authToken) {
        throw new plivoError('Auth ID and Auth Token must be provided.');
    }
    // override default config according to the config provided.
    for (key in config) {
        plivoObj.options[key] = config[key];
    }
    return plivoObj;
};