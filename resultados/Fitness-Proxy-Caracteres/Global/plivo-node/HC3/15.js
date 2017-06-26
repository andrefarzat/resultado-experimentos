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
        var callback;
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
};
plivo.prototype.get_live_calls = function (params, callback) {
};
plivo.prototype.hangup_all_calls = function (callback) {
    var action = 'Call/';
    var method = 'DELETE';
    var params;
    this.request(action, method, params, callback);
};
plivo.prototype.speak = function (params, callback) {
    var action = 'Call/' + params['call_uuid'] + '/Speak/';
    var method = 'POST';
};
// Conferences
plivo.prototype.get_live_conferences = function (params, callback) {
};
plivo.prototype.hangup_conference_member = function (params, callback) {
    var action = 'Conference/' + params['conference_id'] + '/Member/' + params['member_id'] + '/';
    delete params.member_id;
    var method = 'DELETE';
};
plivo.prototype.deaf_conference_member = function (params, callback) {
};
plivo.prototype.undeaf_conference_member = function (params, callback) {
};
plivo.prototype.mute_conference_member = function (params, callback) {
};
plivo.prototype.kick_conference_member = function (params, callback) {
};
plivo.prototype.record_conference = function (params, callback) {
};
// Accounts
plivo.prototype.get_account = function (params, callback) {
};
plivo.prototype.modify_account = function (params, callback) {
};
plivo.prototype.get_subaccounts = function (params, callback) {
};
plivo.prototype.get_subaccount = function (params, callback) {
};
plivo.prototype.modify_subaccount = function (params, callback) {
};
plivo.prototype.delete_subaccount = function (params, callback) {
};
// Applications
plivo.prototype.get_applications = function (params, callback) {
};
plivo.prototype.get_application = function (params, callback) {
};
plivo.prototype.create_application = function (params, callback) {
};
plivo.prototype.modify_application = function (params, callback) {
};
plivo.prototype.delete_application = function (params, callback) {
};
// Recordings
plivo.prototype.get_recordings = function (params, callback) {
};
plivo.prototype.get_recording = function (params, callback) {
};
plivo.prototype.delete_recording = function (params, callback) {
};
// Endpoints
plivo.prototype.get_endpoints = function (params, callback) {
};
plivo.prototype.get_endpoint = function (params, callback) {
};
plivo.prototype.create_endpoint = function (params, callback) {
};
plivo.prototype.modify_endpoint = function (params, callback) {
};
plivo.prototype.delete_endpoint = function (params, callback) {
};
// Numbers
plivo.prototype.get_numbers = function (params, callback) {
};
plivo.prototype.get_number_details = function (params, callback) {
};
plivo.prototype.unrent_number = function (params, callback) {
};
plivo.prototype.get_number_group = function (params, callback) {
};
plivo.prototype.get_number_group_details = function (params, callback) {
};
plivo.prototype.rent_from_number_group = function (params, callback) {
};
plivo.prototype.edit_number = function (params, callback) {
};
plivo.prototype.link_application_number = function (params, callback) {
};
plivo.prototype.unlink_application_number = function (params, callback) {
};
plivo.prototype.search_phone_numbers = function (params, callback) {
};
plivo.prototype.buy_phone_number = function (params, callback) {
    var action = 'PhoneNumber/' + params['number'] + '/';
    delete params.number;
    var method = 'POST';
    this.request(action, method, params, callback, true);
};
// Message
plivo.prototype.send_message = function (params, callback) {
};
plivo.prototype.get_messages = function (params, callback) {
};
plivo.prototype.get_message = function (params, callback) {
};
// Incoming Carriers
plivo.prototype.get_incoming_carriers = function (params, callback) {
};
plivo.prototype.get_incoming_carrier = function (params, callback) {
};
plivo.prototype.create_incoming_carrier = function (params, callback) {
};
plivo.prototype.modify_incoming_carrier = function (params, callback) {
};
plivo.prototype.delete_incoming_carrier = function (params, callback) {
};
// Outgoing Carriers
plivo.prototype.get_outgoing_carriers = function (params, callback) {
};
plivo.prototype.get_outgoing_carrier = function (params, callback) {
};
plivo.prototype.create_outgoing_carrier = function (params, callback) {
};
plivo.prototype.modify_outgoing_carrier = function (params, callback) {
};
plivo.prototype.delete_outgoing_carrier = function (params, callback) {
};
// Outgoing Carrier Routings
plivo.prototype.get_outgoing_carrier_routings = function (params, callback) {
};
plivo.prototype.get_outgoing_carrier_routing = function (params, callback) {
};
plivo.prototype.create_outgoing_carrier_routing = function (params, callback) {
};
plivo.prototype.modify_outgoing_carrier_routing = function (params, callback) {
};
plivo.prototype.delete_outgoing_carrier_routing = function (params, callback) {
};
// Pricing
plivo.prototype.get_pricing = function (params, callback) {
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