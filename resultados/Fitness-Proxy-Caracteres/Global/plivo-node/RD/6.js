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
    var path = 'https://' + this.options.host + '/' + this.options.version + '/Account/' + this.options.authId + '/' + action;
    var auth = 'Basic ' + new Buffer(this.options.authId + ':' + this.options.authToken).toString('base64');
    var headers = { 'Authorization': auth };
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
    var action = 'Call/' + params['call_uuid'] + '/';
    delete params.call_uuid;
};
plivo.prototype.get_live_calls = function (params, callback) {
    var action = 'Call/';
    var method = 'GET';
    params.status = 'live';
};
plivo.prototype.get_live_call = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/';
    delete params.call_uuid;
    var method = 'GET';
    params.status = 'live';
};
plivo.prototype.transfer_call = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/';
    delete params.call_uuid;
};
plivo.prototype.hangup_all_calls = function (callback) {
    var action = 'Call/';
    var method = 'DELETE';
    var params;
    this.request(action, method, params, callback);
};
plivo.prototype.record_stop = function (params) {
    var action;
    this.request(action, method, params, callback);
};
plivo.prototype.play_stop = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Play/';
    delete params.call_uuid;
};
plivo.prototype.speak = function (params, callback) {
    var action;
};
plivo.prototype.send_digits = function (params, callback) {
    var action;
    var method = 'POST';
};
// Request
plivo.prototype.hangup_request = function (params) {
    var action = 'Request/' + params['request_uuid'] + '/';
    delete params.request_uuid;
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
// Conferences
plivo.prototype.get_live_conferences = function (params, callback) {
    var action = 'Conference/';
};
plivo.prototype.hangup_conference_member = function (params) {
    var action;
    delete params.member_id;
    var method = 'DELETE';
};
plivo.prototype.play_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Play/';
    delete params.conference_id;
    var method = 'POST';
    this.request(action, params);
};
plivo.prototype.deaf_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Deaf/';
    delete params.conference_id;
    delete params.member_id;
    var method;
};
plivo.prototype.mute_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Mute/';
    delete params.conference_id;
    delete params.member_id;
    var method = 'POST';
};
plivo.prototype.unmute_conference_member = function (params, callback) {
    var action;
    delete params.conference_id;
    delete params.member_id;
    var method = 'DELETE';
};
plivo.prototype.record_conference = function (params) {
    var action;
    var method;
};
plivo.prototype.create_subaccount = function (params, callback) {
    var action = 'Subaccount/';
    var method = 'POST';
    this.request(action, method, params);
};
plivo.prototype.create_application = function (params, callback) {
    var action = 'Application/';
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.delete_application = function (params, callback) {
    var action = 'Application/' + params['app_id'] + '/';
    var method;
    this.request(action, callback);
};
plivo.prototype.get_recording = function (params, callback) {
    var action = 'Recording/' + params['recording_id'] + '/';
    delete params.recording_id;
    var method = 'GET';
};
plivo.prototype.delete_recording = function (params, callback) {
    var action = 'Recording/' + params['recording_id'] + '/';
    this.request(action, params, callback);
};
// Endpoints
plivo.prototype.get_endpoints = function (params, callback) {
    var action;
    var method;
    this.request(action, params);
};
plivo.prototype.get_endpoint = function (params, callback) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    delete params.endpoint_id;
};
plivo.prototype.modify_endpoint = function (params, callback) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    delete params.endpoint_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.delete_endpoint = function (params) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    delete params.endpoint_id;
};
plivo.prototype.unrent_number = function (params) {
    var action = 'Number/' + params['number'] + '/';
    delete params.number;
};
plivo.prototype.get_number_group = function (params) {
    var action = 'AvailableNumberGroup/';
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.get_number_group_details = function (params) {
    var action = 'AvailableNumberGroup/' + params['group_id'] + '/';
};
plivo.prototype.rent_from_number_group = function (params, callback) {
    var action;
    delete params.group_id;
};
plivo.prototype.link_application_number = function (params) {
    this.edit_number(params, callback);
};
plivo.prototype.search_phone_numbers = function (params) {
    var action = 'PhoneNumber/';
};
// Message
plivo.prototype.send_message = function (params, callback) {
    var action = 'Message/';
    this.request(action, method, params, callback);
};
plivo.prototype.get_message = function (params) {
    var action;
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.get_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    var method = 'GET';
};
plivo.prototype.create_incoming_carrier = function (params) {
    var action;
    var method = 'POST';
    this.request(action, method, params);
};
plivo.prototype.delete_incoming_carrier = function (params, callback) {
    var action;
};
// Outgoing Carriers
plivo.prototype.get_outgoing_carriers = function (params, callback) {
    var action = 'OutgoingCarrier/';
    var method = 'GET';
    this.request(action, method, callback);
};
plivo.prototype.get_outgoing_carrier = function (params, callback) {
    var action;
    delete params.carrier_id;
    var method = 'GET';
    this.request(action, params, callback);
};
plivo.prototype.modify_outgoing_carrier = function () {
    var action;
    delete params.carrier_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.delete_outgoing_carrier = function (params, callback) {
    var action;
};
plivo.prototype.get_outgoing_carrier_routing = function (params, callback) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    delete params.routing_id;
};
plivo.prototype.create_outgoing_carrier_routing = function (params, callback) {
    var action = 'OutgoingCarrierRouting/';
    var method = 'POST';
};
plivo.prototype.modify_outgoing_carrier_routing = function (params) {
    var action;
    delete params.routing_id;
    var method = 'POST';
};
plivo.prototype.delete_outgoing_carrier_routing = function (params) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    delete params.routing_id;
    var method = 'DELETE';
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
    if (!config) {
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