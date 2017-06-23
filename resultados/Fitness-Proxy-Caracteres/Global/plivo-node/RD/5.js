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
    return function (req, res, next) {
        if (process.env.NODE_ENV === 'test')
            return next();
        var toSign;
        if (options && options.host) {
        } else {
        }
    };
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
    this.request(action, params, callback);
};
plivo.prototype.hangup_all_calls = function (callback) {
    var action = 'Call/';
    var method = 'DELETE';
    var params = {};
    this.request(action, method, params, callback);
};
plivo.prototype.record_stop = function (params) {
    var action;
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
plivo.prototype.play = function (params, callback) {
    var action;
    delete params.call_uuid;
    var method = 'POST';
    this.request(action, params, callback);
};
plivo.prototype.speak_stop = function (params, callback) {
    var action;
    delete params.call_uuid;
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
};
plivo.prototype.get_live_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/';
    delete params.conference_id;
    var method;
};
plivo.prototype.hangup_all_conferences = function () {
    var action = 'Conference/';
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
plivo.prototype.stop_play_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Play/';
    delete params.conference_id;
    delete params.member_id;
    this.request(action, method, params, callback);
};
plivo.prototype.stop_speak_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Speak/';
    delete params.conference_id;
    delete params.member_id;
    var method;
};
plivo.prototype.mute_conference_member = function (params, callback) {
    var action;
    delete params.conference_id;
    delete params.member_id;
};
plivo.prototype.unmute_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Mute/';
    delete params.conference_id;
    delete params.member_id;
    var method;
};
plivo.prototype.kick_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Kick/';
    delete params.conference_id;
    var method = 'POST';
};
plivo.prototype.record_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Record/';
    delete params.conference_id;
    var method;
    this.request(action, params, callback);
};
plivo.prototype.modify_account = function () {
    var action = '';
};
plivo.prototype.get_subaccounts = function (params, callback) {
    var action;
    var method;
};
plivo.prototype.modify_subaccount = function () {
    var action;
    this.request(action, method, params);
};
plivo.prototype.delete_subaccount = function (params, callback) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
    var method = 'DELETE';
    this.request(action, params);
};
plivo.prototype.get_application = function (params, callback) {
    var action = 'Application/' + params['app_id'] + '/';
    delete params.app_id;
};
plivo.prototype.create_application = function (params, callback) {
    var action;
};
plivo.prototype.modify_application = function (params, callback) {
    var action;
    delete params.app_id;
    var method = 'POST';
    this.request(action, method, params);
};
plivo.prototype.delete_application = function (params, callback) {
    var action = 'Application/' + params['app_id'] + '/';
};
plivo.prototype.get_recording = function (params) {
    var action = 'Recording/' + params['recording_id'] + '/';
    delete params.recording_id;
    var method = 'GET';
};
plivo.prototype.delete_recording = function (params, callback) {
    var action = 'Recording/' + params['recording_id'] + '/';
    delete params.recording_id;
};
// Endpoints
plivo.prototype.get_endpoints = function (params, callback) {
    var action = 'Endpoint/';
    var method = 'GET';
};
plivo.prototype.modify_endpoint = function (params) {
    var action;
    delete params.endpoint_id;
    var method = 'POST';
    this.request(action, method, params);
};
// Numbers
plivo.prototype.get_numbers = function (params, callback) {
    var action = 'Number/';
    var method = 'GET';
};
plivo.prototype.get_number_group = function (params, callback) {
    var action;
    var method = 'GET';
};
plivo.prototype.get_number_group_details = function (params, callback) {
    var action;
    delete params.group_id;
    var method = 'GET';
    this.request(action, method, callback);
};
plivo.prototype.rent_from_number_group = function (params, callback) {
    var action;
    delete params.group_id;
};
plivo.prototype.edit_number = function (params) {
    var action = 'Number/' + params['number'] + '/';
    delete params.number;
};
plivo.prototype.unlink_application_number = function (params, callback) {
    params.app_id = null;
};
// Message
plivo.prototype.send_message = function (params, callback) {
    var action = 'Message/';
};
plivo.prototype.get_messages = function (params) {
    var action;
    var method = 'GET';
    this.request(action, method, params, callback);
};
// Incoming Carriers
plivo.prototype.get_incoming_carriers = function (params, callback) {
    var action = 'IncomingCarrier/';
    var method = 'GET';
};
plivo.prototype.delete_incoming_carrier = function (params, callback) {
    var action;
    delete params.carrier_id;
};
// Outgoing Carriers
plivo.prototype.get_outgoing_carriers = function (params, callback) {
    var action = 'OutgoingCarrier/';
    var method;
};
plivo.prototype.delete_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method = 'DELETE';
    this.request(action, method);
};
// Outgoing Carrier Routings
plivo.prototype.get_outgoing_carrier_routings = function (params, callback) {
    var action = 'OutgoingCarrierRouting/';
    var method = 'GET';
};
plivo.prototype.modify_outgoing_carrier_routing = function (params) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    delete params.routing_id;
};
plivo.prototype.delete_outgoing_carrier_routing = function (params, callback) {
    var action;
    delete params.routing_id;
    var method = 'DELETE';
};
// Pricing
plivo.prototype.get_pricing = function (params) {
    var action = 'Pricing/';
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
    if (!config) {
    }
    if (typeof config != 'object') {
        throw new plivoError('Config for RestAPI must be provided as an object.');
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