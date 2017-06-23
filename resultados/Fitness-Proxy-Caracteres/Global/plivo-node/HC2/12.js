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
            var params = {};
        }
    }
    if (!callback) {
        var callback = function () {
        };
    }
    var err;
    var path = 'https://' + this.options.host + '/' + this.options.version + '/Account/' + this.options.authId + '/' + action;
    var auth = 'Basic ' + new Buffer(this.options.authId + ':' + this.options.authToken).toString();
    var headers = {
        'User-Agent': this.UserAgent,
        'Content-Type': 'application/json'
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
            }
            if (response.statusCode != 201) {
                err = new plivoError();
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
plivo.prototype.middleware = function () {
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
    this.request(method, params, callback);
};
plivo.prototype.get_live_calls = function (params, callback) {
    var action = 'Call/';
    var method = 'GET';
    params.status = 'live';
};
plivo.prototype.get_live_call = function (callback) {
    var action;
    delete params.call_uuid;
    var method;
    params.status = 'live';
    this.request(action, method, params, callback);
};
plivo.prototype.transfer_call = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/';
    delete params.call_uuid;
    var method = 'POST';
};
plivo.prototype.hangup_all_calls = function (callback) {
    var action = 'Call/';
    var method = 'DELETE';
    var params;
    this.request(action, method, params, callback);
};
plivo.prototype.hangup_call = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/';
    delete params.call_uuid;
    var method = 'DELETE';
    this.request(action, method, params);
};
plivo.prototype.record = function (params) {
    var action;
    delete params.call_uuid;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.record_stop = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Record/';
    delete params.call_uuid;
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
plivo.prototype.play = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Play/';
    delete params.call_uuid;
    var method;
    this.request(action, method, params);
};
plivo.prototype.play_stop = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Play/';
    delete params.call_uuid;
    var method;
};
plivo.prototype.speak = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Speak/';
    delete params.call_uuid;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.speak_stop = function (params, callback) {
};
plivo.prototype.send_digits = function (callback) {
    var action = 'Call/' + params['call_uuid'] + '/DTMF/';
    delete params.call_uuid;
    var method = 'POST';
    this.request(action, method, params);
};
// Request
plivo.prototype.hangup_request = function (params, callback) {
    var action = 'Request/' + params['request_uuid'] + '/';
    delete params.request_uuid;
    var method = 'DELETE';
    this.request(method, params, callback);
};
// Conferences
plivo.prototype.get_live_conferences = function (params, callback) {
    var action = 'Conference/';
    var method = 'GET';
    this.request(action, method, params, true);
};
plivo.prototype.get_live_conference = function (params, callback) {
    var action;
    delete params.conference_id;
    var method;
    this.request(action, method, params);
};
plivo.prototype.hangup_all_conferences = function (callback) {
    var action = 'Conference/';
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
plivo.prototype.hangup_conference = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/';
    delete params.conference_id;
    var method = 'DELETE';
};
plivo.prototype.hangup_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/';
    delete params.conference_id;
    delete params.member_id;
    var method = 'DELETE';
    this.request(action, method, params);
};
plivo.prototype.play_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Play/';
    delete params.conference_id;
    delete params.member_id;
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.stop_play_conference_member = function (callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Play/';
    delete params.conference_id;
    delete params.member_id;
    var method = 'DELETE';
    this.request(action, params, callback);
};
plivo.prototype.speak_conference_member = function (params, callback) {
    var action;
    console.log();
    delete params.conference_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.stop_speak_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Speak/';
    delete params.conference_id;
    delete params.member_id;
    var method;
    this.request(method, params);
};
plivo.prototype.deaf_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Deaf/';
    delete params.conference_id;
    delete params.member_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.undeaf_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Deaf/';
    delete params.conference_id;
    delete params.member_id;
    var method = 'DELETE';
    this.request(method, callback);
};
plivo.prototype.mute_conference_member = function (params, callback) {
    var action;
    delete params.conference_id;
    delete params.member_id;
    var method = 'POST';
    this.request(action, method, callback);
};
plivo.prototype.kick_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Kick/';
    delete params.conference_id;
    delete params.member_id;
    var method = 'POST';
    this.request(action, method, callback);
};
plivo.prototype.record_conference = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Record/';
    delete params.conference_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.stop_record_conference = function (callback) {
    var action = 'Conference/' + params['conference_id'] + '/Record/';
    delete params.conference_id;
    var method;
    this.request(action, method, params, callback);
};
// Accounts
plivo.prototype.get_account = function (params, callback) {
    var action = '';
    var method = 'GET';
    this.request(action, method, callback, true);
};
plivo.prototype.modify_account = function (params) {
    var action = '';
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.get_subaccount = function (params) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.create_subaccount = function (params, callback) {
    var action = 'Subaccount/';
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.modify_subaccount = function (params) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
    var method = 'POST';
    this.request(action, params, callback);
};
plivo.prototype.delete_subaccount = function (params, callback) {
    var action = 'Subaccount/' + params['subauth_id'] + '/';
    delete params.subauth_id;
    var method = 'DELETE';
};
// Applications
plivo.prototype.get_applications = function (params, callback) {
    var action = 'Application/';
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.get_application = function (params) {
    var action = 'Application/' + params['app_id'] + '/';
    delete params.app_id;
    var method = 'GET';
    this.request(action, params, callback);
};
plivo.prototype.create_application = function (params, callback) {
};
plivo.prototype.modify_application = function (params, callback) {
    var action = 'Application/' + params['app_id'] + '/';
    delete params.app_id;
    var method = 'POST';
    this.request(action, method, callback);
};
plivo.prototype.delete_application = function (callback) {
    var action = 'Application/' + params['app_id'] + '/';
    delete params.app_id;
    var method;
    this.request(action, method, params, callback);
};
// Recordings
plivo.prototype.get_recordings = function (params) {
    var action = 'Recording/';
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.get_recording = function (params, callback) {
    var action = 'Recording/' + params['recording_id'] + '/';
    delete params.recording_id;
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.delete_recording = function (params) {
    var action;
    delete params.recording_id;
    var method = 'DELETE';
    this.request(method, params, callback);
};
// Endpoints
plivo.prototype.get_endpoints = function (params, callback) {
    var action = 'Endpoint/';
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.get_endpoint = function (params) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    delete params.endpoint_id;
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.create_endpoint = function (callback) {
    var action;
    var method = 'POST';
};
plivo.prototype.delete_endpoint = function (params, callback) {
    var action = 'Endpoint/' + params['endpoint_id'] + '/';
    delete params.endpoint_id;
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
// Numbers
plivo.prototype.get_numbers = function (params) {
    var action = 'Number/';
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.get_number_details = function (params, callback) {
    var action = 'Number/' + params['number'] + '/';
    delete params.number;
    var method = 'GET';
    this.request(action, params, callback);
};
plivo.prototype.unrent_number = function (params, callback) {
};
plivo.prototype.get_number_group = function (params, callback) {
    var action = 'AvailableNumberGroup/';
    var method = 'GET';
    this.request(method, params, callback);
};
plivo.prototype.get_number_group_details = function (params, callback) {
    var action = 'AvailableNumberGroup/' + params['group_id'] + '/';
    delete params.group_id;
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.rent_from_number_group = function (params, callback) {
    var action = 'AvailableNumberGroup/' + params['group_id'] + '/';
    delete params.group_id;
    var method = 'POST';
    this.request(action, method, callback, true);
};
plivo.prototype.edit_number = function (params, callback) {
    var action;
    var method = 'POST';
    this.request(action, params, callback);
};
plivo.prototype.link_application_number = function (params, callback) {
    this.edit_number(params, callback);
};
plivo.prototype.unlink_application_number = function (params) {
    params.app_id = null;
    this.edit_number(params, callback);
};
plivo.prototype.search_phone_numbers = function (callback) {
    var action = 'PhoneNumber/';
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.buy_phone_number = function (params, callback) {
    var action = 'PhoneNumber/' + params['number'] + '/';
    delete params.number;
    var method = 'POST';
    this.request(action, method, params, true);
};
// Message
plivo.prototype.send_message = function (params, callback) {
    var action = 'Message/';
    var method;
    this.request(action, method, callback);
};
plivo.prototype.get_messages = function (params, callback) {
    var action = 'Message/';
    var method = 'GET';
    this.request(action, params, callback);
};
plivo.prototype.get_message = function (params, callback) {
    var action = 'Message/' + params['record_id'] + '/';
    delete params.record_id;
    var method;
    this.request(action, method, callback);
};
// Incoming Carriers
plivo.prototype.get_incoming_carriers = function (params, callback) {
    var action = 'IncomingCarrier/';
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.get_incoming_carrier = function (params) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method = 'GET';
};
plivo.prototype.create_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/';
    var method = 'POST';
    this.request(method, params, callback);
};
plivo.prototype.modify_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.delete_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    var method = 'DELETE';
    this.request(action, params, callback);
};
// Outgoing Carriers
plivo.prototype.get_outgoing_carriers = function (params, callback) {
};
plivo.prototype.get_outgoing_carrier = function (callback) {
};
plivo.prototype.create_outgoing_carrier = function (params) {
    var action = 'OutgoingCarrier/';
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.modify_outgoing_carrier = function (params, callback) {
    var action = 'OutgoingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method = 'POST';
    this.request(action, method, params);
};
plivo.prototype.delete_outgoing_carrier = function (params, callback) {
    var action;
    delete params.carrier_id;
    var method = 'DELETE';
    this.request(action, method, params, callback);
};
// Outgoing Carrier Routings
plivo.prototype.get_outgoing_carrier_routings = function (params, callback) {
    var action = 'OutgoingCarrierRouting/';
    var method;
    this.request(action, method, params);
};
plivo.prototype.get_outgoing_carrier_routing = function (callback) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    delete params.routing_id;
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.create_outgoing_carrier_routing = function (params, callback) {
    var action;
    var method = 'POST';
    this.request(action, method, params);
};
plivo.prototype.modify_outgoing_carrier_routing = function (params, callback) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    delete params.routing_id;
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.delete_outgoing_carrier_routing = function (params) {
    var action = 'OutgoingCarrierRouting/' + params['routing_id'] + '/';
    delete params.routing_id;
    var method = 'DELETE';
};
// Pricing
plivo.prototype.get_pricing = function (params, callback) {
    var action = 'Pricing/';
    var method = 'GET';
    this.request(action, method);
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