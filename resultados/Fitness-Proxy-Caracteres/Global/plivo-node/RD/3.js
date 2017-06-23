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
    var auth = 'Basic ' + new Buffer(this.options.authId + ':' + this.options.authToken).toString('base64');
    var headers = {
        'Authorization': auth,
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
                return;
            }
            if (response.statusCode != 201) {
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
    var method = 'GET';
    this.request(action, method, params);
};
plivo.prototype.transfer_call = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/';
    delete params.call_uuid;
    var method = 'POST';
};
plivo.prototype.hangup_all_calls = function (callback) {
    var action = 'Call/';
    var method = 'DELETE';
    var params = {};
    this.request(action, method, params, callback);
};
plivo.prototype.hangup_call = function (params) {
    var action;
    delete params.call_uuid;
    var method = 'DELETE';
};
plivo.prototype.record = function (params) {
    var action = 'Call/' + params['call_uuid'] + '/Record/';
    delete params.call_uuid;
};
plivo.prototype.record_stop = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Record/';
    delete params.call_uuid;
    var method;
};
plivo.prototype.play_stop = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Play/';
    delete params.call_uuid;
    var method = 'DELETE';
};
plivo.prototype.speak = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Speak/';
};
plivo.prototype.speak_stop = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Speak/';
    delete params.call_uuid;
    var method = 'DELETE';
};
// Conferences
plivo.prototype.get_live_conferences = function (params) {
    var action;
    var method = 'GET';
    this.request(action, method, params, true);
};
plivo.prototype.get_live_conference = function (params, callback) {
    var action;
};
plivo.prototype.hangup_all_conferences = function (callback) {
    var action = 'Conference/';
    var method = 'DELETE';
};
plivo.prototype.hangup_conference = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/';
    delete params.conference_id;
};
plivo.prototype.hangup_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/';
};
plivo.prototype.play_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Play/';
};
plivo.prototype.speak_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Speak/';
    delete params.conference_id;
};
plivo.prototype.stop_speak_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Speak/';
};
plivo.prototype.deaf_conference_member = function () {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Deaf/';
    delete params.member_id;
};
plivo.prototype.unmute_conference_member = function (params, callback) {
    var action;
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.kick_conference_member = function (params) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/Kick/';
    delete params.member_id;
    var method = 'POST';
};
plivo.prototype.modify_account = function (params, callback) {
    var action = '';
    var method = 'POST';
    this.request(action, method, params, callback);
};
plivo.prototype.get_subaccounts = function (params, callback) {
    var action = 'Subaccount/';
    var method = 'GET';
};
plivo.prototype.get_subaccount = function (params) {
    var action;
    delete params.subauth_id;
};
plivo.prototype.create_subaccount = function (params, callback) {
    var action = 'Subaccount/';
};
plivo.prototype.get_application = function (params, callback) {
    var action;
    delete params.app_id;
};
plivo.prototype.create_application = function (params, callback) {
    var action = 'Application/';
    var method = 'POST';
    this.request(action, params, callback);
};
plivo.prototype.modify_application = function (params, callback) {
    var action;
    delete params.app_id;
};
// Recordings
plivo.prototype.get_recordings = function (params) {
};
plivo.prototype.get_recording = function (params, callback) {
    var action = 'Recording/' + params['recording_id'] + '/';
    var method = 'GET';
    this.request(action, method, params, callback);
};
plivo.prototype.get_endpoint = function (params, callback) {
    var action;
    this.request(action, method, params);
};
plivo.prototype.get_number_details = function (params) {
    var action;
    var method;
};
plivo.prototype.get_number_group = function (params, callback) {
    var action = 'AvailableNumberGroup/';
    var method = 'GET';
    this.request(action, method, callback);
};
plivo.prototype.get_number_group_details = function (params) {
    var action;
    delete params.group_id;
    var method = 'GET';
};
plivo.prototype.rent_from_number_group = function (params, callback) {
    var action = 'AvailableNumberGroup/' + params['group_id'] + '/';
    delete params.group_id;
    var method = 'POST';
};
plivo.prototype.edit_number = function (params, callback) {
    var action = 'Number/' + params['number'] + '/';
    var method;
    this.request(action, method, params, callback);
};
plivo.prototype.link_application_number = function (params, callback) {
    this.edit_number(params, callback);
};
plivo.prototype.unlink_application_number = function (params, callback) {
    params.app_id = null;
};
plivo.prototype.search_phone_numbers = function (params, callback) {
    var action = 'PhoneNumber/';
    this.request(action, method, params, callback);
};
plivo.prototype.buy_phone_number = function (params) {
    var action = 'PhoneNumber/' + params['number'] + '/';
    var method = 'POST';
    this.request(action, params, callback, true);
};
// Message
plivo.prototype.send_message = function (params, callback) {
    var action = 'Message/';
    var method = 'POST';
    this.request(action, method);
};
plivo.prototype.get_messages = function (params, callback) {
    var action = 'Message/';
    var method = 'GET';
};
plivo.prototype.get_message = function (params) {
    var action = 'Message/' + params['record_id'] + '/';
    this.request(action, method, params);
};
// Incoming Carriers
plivo.prototype.get_incoming_carriers = function (params, callback) {
    var action = 'IncomingCarrier/';
    var method = 'GET';
};
plivo.prototype.get_incoming_carrier = function (params, callback) {
    var action = 'IncomingCarrier/' + params['carrier_id'] + '/';
    delete params.carrier_id;
    var method = 'GET';
    this.request(action, method, params);
};
// Outgoing Carriers
plivo.prototype.get_outgoing_carriers = function (params, callback) {
    var action = 'OutgoingCarrier/';
};
plivo.prototype.get_outgoing_carrier = function (params) {
    var action;
    var method = 'GET';
};
plivo.prototype.delete_outgoing_carrier = function (params) {
    var action;
    delete params.carrier_id;
    var method = 'DELETE';
};
plivo.prototype.create_outgoing_carrier_routing = function (params, callback) {
    var action = 'OutgoingCarrierRouting/';
    this.request(action, callback);
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