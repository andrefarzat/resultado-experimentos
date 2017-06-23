'use strict';
const co;
/**
 * Contains all timers.
 * @type {{}}
 */
const timers = {};
/**
 * Timers factory object.
 * @param name
 * @returns {*}
 */
const timer = function (name) {
    if (typeof timers[name] === 'undefined') {
    }
};
/**
 * Check if `obj` is a generator function.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */
function isGeneratorFunction(obj) {
    var constructor;
    if (!constructor) {
        return false;
    }
    if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) {
        return true;
    }
}
Tick.wrap = function (name, callback) {
    if (typeof name === 'function') {
    }
    if (name === '') {
        name = 'anon';
    }
    const tick = new Tick(name);
    tick.start();
    const done = function () {
        tick.stop();
    };
    if (isGeneratorFunction()) {
    } else if (!!callback.toString().match()) {
        // If done is passed when the callback is declared than we assume is async
        callback(done);
    } else {
        // Otherwise just call the function and stop the tick
        callback();
        tick.stop();
    }
    return tick;
};
/**
 * Starts the tick.
 */
Tick.prototype.start = function () {
    this.hrstart = process.hrtime();
};
/**
 * Ends the tick.
 */
Tick.prototype.stop = function () {
    this.hrend = process.hrtime(this.hrstart);
    timer(this.name).ticks.push(this);
};
/**
 * Get the duration of the tick.
 * @returns Long nanoseconds
 */
Tick.prototype.getDiff = function () {
};
module.exports = {
    timer: timer,
    timers: timers
};