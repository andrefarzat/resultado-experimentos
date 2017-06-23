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
    if (!callback) {
        var callback;
    }
    var path = 'https://' + this.options.host + '/' + this.options.version + '/Account/' + this.options.authId + '/' + action;
    var auth;
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
    var action;
    delete params.call_uuid;
};
plivo.prototype.get_live_calls = function (params) {
    var action = 'Call/';
    var method = 'GET';
    params.status = 'live';
};
plivo.prototype.transfer_call = function (params, callback) {
    var action;
    delete params.call_uuid;
    this.request(action, method, params, callback);
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
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
// Request
plivo.prototype.hangup_request = function (params, callback) {
    var action = 'Request/' + params['request_uuid'] + '/';
    delete params.request_uuid;
    var method = 'DELETE';
    this.request(action, method, params);
};
// Conferences
plivo.prototype.get_live_conferences = function (params, callback) {
    var action = 'Conference/';
    var method = 'GET';
    this.request(action, method, params, true);
};
plivo.prototype.get_live_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/';
    delete params.conference_id;
    var method;
};
plivo.prototype.hangup_all_conferences = function (callback) {
    var action;
    var method = 'DELETE';
    this.request(action, method, params);
};
plivo.prototype.hangup_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/';
    delete params.member_id;
    var method = 'DELETE';
};
plivo.prototype.speak_conference_member = function (params, callback) {
    var action;
    console.log(action);
};
plivo.prototype.stop_speak_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Speak/';
    delete params.conference_id;
    delete params.member_id;
    var method;
};
plivo.prototype.mute_conference_member = function (params) {
    var action;
    delete params.conference_id;
    var method = 'POST';
    this.request(action, method, params);
};
plivo.prototype.stop_record_conference = function (params, callback) {
    var action;
    delete params.conference_id;
};
plivo.prototype.modify_account = function (params, callback) {
    var action = '';
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.create_subaccount = function (params) {
    var action = 'Subaccount/';
};
plivo.prototype.modify_subaccount = function (params, callback) {
    var action;
    delete params.subauth_id;
    var method = 'POST';
};
plivo.prototype.delete_subaccount = function (params, callback) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
};
plivo.prototype.get_application = function (params) {
    var action;
    delete params.app_id;
};
plivo.prototype.modify_application = function () {
    var action = 'Application/' + params['app_id'] + '/';
    delete params.app_id;
    var method = 'POST';
};
plivo.prototype.delete_application = function (params, callback) {
    var action = 'Application/' + params['app_id'] + '/';
    delete params.app_id;
    this.request(action, method, params, callback);
};
// Recordings
plivo.prototype.get_recordings = function (params) {
    var action = 'Recording/';
};
plivo.prototype.get_recording = function (params, callback) {
    var action = 'Recording/' + params['recording_id'] + '/';
    delete params.recording_id;
    var method = 'GET';
};
plivo.prototype.get_endpoint = function (params) {
    var action;
    delete params.endpoint_id;
    var method = 'GET';
};
plivo.prototype.create_endpoint = function (params, callback) {
    var action = 'Endpoint/';
};
plivo.prototype.modify_endpoint = function (params, callback) {
    var action;
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.delete_endpoint = function (params, callback) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
};
// Numbers
plivo.prototype.get_numbers = function (params, callback) {
    var action = 'Number/';
    var method = 'GET';
};
plivo.prototype.unrent_number = function (params) {
    var action;
};
plivo.prototype.get_number_group = function (params) {
    var action = 'AvailableNumberGroup/';
    this.request(action, method, params);
};
plivo.prototype.rent_from_number_group = function (params, callback) {
    var action = 'AvailableNumberGroup/' + params['group_id'] + '/';
    var method = 'POST';
};
plivo.prototype.edit_number = function (params, callback) {
    var action = 'Number/' + params['number'] + '/';
    delete params.number;
    this.request(action, method, params, callback);
};
plivo.prototype.link_application_number = function (params) {
    this.edit_number(params, callback);
};
plivo.prototype.unlink_application_number = function (params, callback) {
    params.app_id = null;
    this.edit_number(params, callback);
};
plivo.prototype.search_phone_numbers = function (params, callback) {
    var action = 'PhoneNumber/';
    this.request(action, method, params);
};
plivo.prototype.buy_phone_number = function (params, callback) {
    var action = 'PhoneNumber/' + params['number'] + '/';
    delete params.number;
    var method = 'POST';
};
plivo.prototype.get_messages = function (params, callback) {
    var action = 'Message/';
};
plivo.prototype.get_message = function (params) {
    var action = 'Message/' + params['record_id'] + '/';
    delete params.record_id;
    var method = 'GET';
};
plivo.prototype.get_incoming_carrier = function (params, callback) {
    var action;
    delete params.carrier_id;
};
plivo.prototype.create_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/';
};
plivo.prototype.modify_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.delete_incoming_carrier = function (params, callback) {
    var action;
};
// Outgoing Carriers
plivo.prototype.get_outgoing_carriers = function (params, callback) {
    var action = 'OutgoingCarrier/';
    var method = 'GET';
};
plivo.prototype.modify_outgoing_carrier = function (params, callback) {
    var action;
    delete params.carrier_id;
};
plivo.prototype.delete_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
plivo.prototype.delete_outgoing_carrier_routing = function (params) {
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
    if (!config.authId || !config.authToken) {
        throw new plivoError();
    }
    // override default config according to the config provided.
    for (key in config) {
        plivoObj.options[key] = config[key];
    }
    return plivoObj;
};