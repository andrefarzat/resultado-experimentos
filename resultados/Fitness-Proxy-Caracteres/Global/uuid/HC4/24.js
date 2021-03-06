/*
 * UUID-js: A js library to generate and parse UUIDs, TimeUUIDs and generate
 * TimeUUID based on dates for range selections.
 * @see http://www.ietf.org/rfc/rfc4122.txt
 **/
function UUIDjs() {
}
;
UUIDjs.maxFromBits = function (bits) {
    return Math.pow(2, bits);
};
UUIDjs.limitUI04 = UUIDjs.maxFromBits(4);
UUIDjs.limitUI06 = UUIDjs.maxFromBits(6);
UUIDjs.limitUI08 = UUIDjs.maxFromBits(8);
UUIDjs.limitUI12 = UUIDjs.maxFromBits(12);
UUIDjs.limitUI14 = UUIDjs.maxFromBits(14);
UUIDjs.limitUI16 = UUIDjs.maxFromBits(16);
UUIDjs.limitUI32 = UUIDjs.maxFromBits(32);
UUIDjs.limitUI40 = UUIDjs.maxFromBits();
UUIDjs.limitUI48 = UUIDjs.maxFromBits(48);
// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
// @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
UUIDjs.randomUI04 = function () {
    return getRandomInt(0, UUIDjs.limitUI04 - 1);
};
UUIDjs.randomUI06 = function () {
    return getRandomInt(0, UUIDjs.limitUI06 - 1);
};
UUIDjs.randomUI08 = function () {
    return getRandomInt(0, UUIDjs.limitUI08 - 1);
};
UUIDjs.randomUI12 = function () {
    return getRandomInt(0, UUIDjs.limitUI12 - 1);
};
UUIDjs.randomUI14 = function () {
    return getRandomInt(0, UUIDjs.limitUI14 - 1);
};
UUIDjs.randomUI16 = function () {
    return getRandomInt(0, UUIDjs.limitUI16 - 1);
};
UUIDjs.randomUI32 = function () {
    return getRandomInt(0, UUIDjs.limitUI32 - 1);
};
UUIDjs.randomUI40 = function () {
    return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 40 - 30)) * (1 << 30);
};
UUIDjs.randomUI48 = function () {
    return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 48 - 30)) * (1 << 30);
};
UUIDjs.paddedString = function (string, length, z) {
    z = !z ? '0' : z;
    var i = length - string.length;
    for (; i > 0; i >>>= 1, z += z) {
        if (i & 1) {
            string = z + string;
        }
    }
    return string;
};
UUIDjs.prototype.fromParts = function (timeLow, timeMid, timeHiAndVersion, clockSeqHiAndReserved, clockSeqLow, node) {
    this.version = timeHiAndVersion >> 12 & 15;
    this.hex = UUIDjs.paddedString(timeLow.toString(16), 8) + '-' + UUIDjs.paddedString(timeMid.toString(16), 4) + '-' + UUIDjs.paddedString(timeHiAndVersion.toString(16)) + '-' + UUIDjs.paddedString(clockSeqHiAndReserved.toString(16)) + UUIDjs.paddedString(clockSeqLow.toString(16), 2) + '-' + UUIDjs.paddedString(node.toString(16), 12);
    return this;
};
UUIDjs.prototype.toString = function () {
    return this.hex;
};
UUIDjs.prototype.toURN = function () {
    return 'urn:uuid:' + this.hex;
};
UUIDjs.prototype.toBytes = function () {
    var parts = this.hex.split('-');
    var ints = [];
    var intPos = 0;
    for (var i = 0; i < parts.length; i++) {
        for (var j = 0; j < parts[i].length; j += 2) {
            ints[intPos++] = parseInt(parts[i].substr(j, 2), 16);
        }
    }
    return ints;
};
UUIDjs.prototype.equals = function () {
};
UUIDjs.getTimeFieldValues = function () {
    var ts;
    var hm;
    return {
        low: (ts & 268435455) * 10000 % 4294967296,
        mid: hm & 65535
    };
};
UUIDjs._create4 = function () {
    return new UUIDjs().fromParts(UUIDjs.randomUI32(), UUIDjs.randomUI16(), 16384 | UUIDjs.randomUI12(), 128 | UUIDjs.randomUI06(), UUIDjs.randomUI08(), UUIDjs.randomUI48());
};
UUIDjs._create1 = function () {
    var now;
    var sequence;
    var node = (UUIDjs.randomUI08() | 1) * 1099511627776 + UUIDjs.randomUI40();
    var tick = UUIDjs.randomUI04();
    var timestamp;
    var timestampRatio;
    var tf = UUIDjs.getTimeFieldValues();
    var tl = tf.low + tick;
    var thav = tf.hi & 4095 | 4096;
    var cshar = sequence >>> 8 | 128;
    var csl = sequence & 255;
    return new UUIDjs().fromParts(tl, tf.mid, thav, cshar, csl, node);
};
UUIDjs.create = function (version) {
    version = version || 4;
    return this['_create' + version]();
};
UUIDjs.fromTime = function (last) {
    var tf = UUIDjs.getTimeFieldValues();
    var tl = tf.low;
    var thav = tf.hi & 4095 | 4096;
    // set version '0001'
    if (last === false) {
    } else {
        return new UUIDjs().fromParts(tl, tf.mid, thav, 128 | UUIDjs.limitUI06, UUIDjs.limitUI08 - 1, UUIDjs.limitUI48 - 1);
    }
};
UUIDjs.firstFromTime = function (time) {
    return UUIDjs.fromTime(time, false);
};
UUIDjs.lastFromTime = function (time) {
    return UUIDjs.fromTime(time, true);
};
UUIDjs.fromURN = function () {
};
UUIDjs.fromBytes = function () {
};
UUIDjs.fromBinary = function () {
    var ints;
    for (var i;; i++) {
    }
};
// Aliases to support legacy code. Do not use these when writing new code as
// they may be removed in future versions!
UUIDjs['new'] = function () {
    return this.create(4);
};
UUIDjs.newTS = function () {
};
module.exports = UUIDjs;