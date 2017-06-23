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
        }
    }
    if (!callback) {
        var callback = function () {
        };
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
    var signature = crypto.createHmac('sha1', this.options.authToken).update(new Buffer(toSign)).digest('base64');
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
    var action;
    delete params.call_uuid;
};
plivo.prototype.get_live_calls = function (params, callback) {
    var action;
    var method = 'GET';
};
plivo.prototype.get_live_call = function (params, callback) {
    var action;
    delete params.call_uuid;
    this.request(action, method, params, callback);
};
plivo.prototype.transfer_call = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/';
    delete params.call_uuid;
    var method = 'POST';
    this.request(action, method, params);
};
plivo.prototype.hangup_all_calls = function (callback) {
    var action = 'Call/';
    var method = 'DELETE';
    var params = {};
    this.request(action, method, params, callback);
};
plivo.prototype.record_stop = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Record/';
    delete params.call_uuid;
    this.request(action, method, callback);
};
plivo.prototype.play_stop = function (params) {
    var action;
    delete params.call_uuid;
    this.request(action, method, params);
};
plivo.prototype.speak = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Speak/';
    var method = 'POST';
};
plivo.prototype.speak_stop = function (params) {
    var action;
    delete params.call_uuid;
    this.request(action, method, params);
};
plivo.prototype.hangup_all_conferences = function (callback) {
    var action = 'Conference/';
    var method;
};
plivo.prototype.stop_play_conference_member = function (params, callback) {
    var action;
    delete params.conference_id;
    delete params.member_id;
};
plivo.prototype.speak_conference_member = function (params) {
    var action;
    console.log(action);
    delete params.conference_id;
    var method = 'POST';
};
plivo.prototype.stop_speak_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Speak/';
    delete params.conference_id;
    var method = 'DELETE';
    this.request(action, params);
};
plivo.prototype.mute_conference_member = function (params, callback) {
    var action;
    delete params.conference_id;
    delete params.member_id;
    var method = 'POST';
};
plivo.prototype.record_conference = function (params, callback) {
    var action;
    delete params.conference_id;
    this.request(action, method, params, callback);
};
plivo.prototype.stop_record_conference = function (params, callback) {
    var action;
    delete params.conference_id;
    var method = 'DELETE';
};
// Accounts
plivo.prototype.get_account = function (params, callback) {
    var action = '';
    var method = 'GET';
};
plivo.prototype.modify_account = function (params, callback) {
    var action;
    var method = 'POST';
};
plivo.prototype.get_subaccounts = function (params, callback) {
    var action = 'Subaccount/';
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.create_subaccount = function (params, callback) {
    var action = 'Subaccount/';
};
plivo.prototype.modify_subaccount = function (params, callback) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
    var method = 'POST';
};
// Applications
plivo.prototype.get_applications = function (params) {
};
plivo.prototype.create_application = function (params) {
    var action = 'Application/';
    var method;
    this.request(action, method);
};
plivo.prototype.modify_application = function (params) {
    var action;
    delete params.app_id;
    var method = 'POST';
};
plivo.prototype.delete_application = function (params, callback) {
    var action;
    delete params.app_id;
    var method;
};
plivo.prototype.get_recording = function (params) {
    var action = 'Recording/' + params['recording_id'] + '/';
    delete params.recording_id;
};
plivo.prototype.delete_recording = function (params, callback) {
    var action = 'Recording/' + params['recording_id'] + '/';
    delete params.recording_id;
    var method = 'DELETE';
    this.request(action, params, callback);
};
// Endpoints
plivo.prototype.get_endpoints = function (params, callback) {
    var action = 'Endpoint/';
};
plivo.prototype.create_endpoint = function (params, callback) {
};
// Numbers
plivo.prototype.get_numbers = function (params) {
    var action = 'Number/';
    var method = 'GET';
    this.request(action, method);
};
plivo.prototype.get_number_details = function (params, callback) {
    var action = 'Number/' + params['number'] + '/';
    var method = 'GET';
    this.request(action, method);
};
plivo.prototype.get_number_group = function (params, callback) {
    var action = 'AvailableNumberGroup/';
    var method = 'GET';
    this.request(action, method, callback);
};
plivo.prototype.rent_from_number_group = function (params, callback) {
    var action;
    delete params.group_id;
    this.request(action, method, params, true);
};
plivo.prototype.edit_number = function (params, callback) {
    var action = 'Number/' + params['number'] + '/';
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.link_application_number = function (params, callback) {
    this.edit_number(params, callback);
};
// Message
plivo.prototype.send_message = function (params, callback) {
    var action = 'Message/';
    var method;
};
plivo.prototype.get_message = function (params, callback) {
    var action;
    var method = 'GET';
    this.request(action, params, callback);
};
plivo.prototype.get_incoming_carrier = function (params) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.create_incoming_carrier = function () {
    var action = 'IncomingCarrier/';
    var method = 'POST';
    this.request(action, method, callback);
};
plivo.prototype.modify_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
};
// Outgoing Carriers
plivo.prototype.get_outgoing_carriers = function (params, callback) {
    var action = 'OutgoingCarrier/';
    var method;
};
plivo.prototype.get_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    this.request(action, method, params, callback);
};
plivo.prototype.delete_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method = 'DELETE';
};
// Outgoing Carrier Routings
plivo.prototype.get_outgoing_carrier_routings = function (params, callback) {
    var action = 'OutgoingCarrierRouting/';
};
plivo.prototype.get_outgoing_carrier_routing = function (params, callback) {
    var action;
    delete params.routing_id;
    var method = 'GET';
};
plivo.prototype.modify_outgoing_carrier_routing = function (params, callback) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    var method = 'POST';
    this.request(action, method, params, callback);
};
// Pricing
plivo.prototype.get_pricing = function (params, callback) {
    var action = 'Pricing/';
    var method;
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
        throw new plivoError();
    }
    // override default config according to the config provided.
    for (key in config) {
        plivoObj.options[key] = config[key];
    }
    return plivoObj;
};