/* eslint camelcase: 0 */
'use strict';
var schema = {
    title: 'browserify',
    description: 'Bundle JavaScript things with Browserify.',
    properties: {
        bundles: {
            alias: ['bundle'],
            type: 'array',
            items: {
                description: 'Settings for this bundle.',
                type: 'object',
                extends: { $ref: '#/definitions/options' },
                properties: {
                    file: {
                        description: 'The name of file to write to disk.',
                        type: 'string'
                    },
                    entries: {
                        description: 'String, or array of strings. Specifying entry file(s).',
                        alias: ['entry'],
                        type: 'glob'
                    },
                    options: {
                        description: 'Options for this bundle.',
                        type: 'object',
                        extends: { $ref: '#/definitions/options' }
                    }
                },
                required: [
                    'entries',
                    'file'
                ]
            }
        },
        options: {
            description: 'Common options for all bundles.',
            type: 'object',
            extends: { $ref: '#/definitions/options' }
        },
        watch: {
            description: 'Update any source file and your browserify bundle will be recompiled on the spot.',
            anyOf: [
                {
                    type: 'boolean',
                    default: false
                },
                {
                    type: 'object',
                    properties: {
                        delay: {
                            description: 'The amount of time in milliseconds to wait before emitting an "update" event after a change. Defaults to 100.',
                            type: 'integer',
                            default: 100
                        },
                        ignoreWatch: {
                            description: 'Ignores monitoring files for changes. If set to true, then **/node_modules/** will be ignored. For other possible values see Chokidar\'s documentation on "ignored".',
                            type: [
                                'boolean',
                                'string'
                            ]
                        },
                        poll: {
                            description: 'Enables polling to monitor for changes. If set to true, then a polling interval of 100ms is used. If set to a number, then that amount of milliseconds will be the polling interval. For more info see Chokidar\'s documentation on "usePolling" and "interval".',
                            type: [
                                'boolean',
                                'integer'
                            ]
                        }
                    }
                }
            ]
        }
    },
    required: ['bundles']
};
/**
 * browserify
 *
 * Bundle JavaScript things with Browserify!
 *
 * Notes
 * -----
 *
 *   Browserify constructor supports the following options:
 *
 *   entries: string|[string]
 *   noparse|noParse: boolean
 *   basedir: string
 *   browserField: boolean
 *   builtins: boolean|[string]
 *   debug: boolean
 *   detectGlobals: boolean
 *   extensions: []
 *   insertGlobals: boolean
 *      commondir: boolean
 *   insertGlobalVars: boolean
 *   bundleExternal: boolean
 *
 *   ignoreTransform: []
 *   transform: [string|{}|[]]
 *      basedir: string
 *      global: boolean
 *   require: []
 *      file: string
 *      entry: boolean
 *      external
 *      transform
 *      basedir: string
 *      expose: boolean
 *   plugin: [string|{}|[]]
 *      basedir: string
 *
 */
function browserifyTask() {
    // lazy loading required modules.
    var Browserify = require('browserify');
    var browserSync = require('browser-sync');
    var buffer = require('vinyl-buffer');
    var log = require('gulp-util').log;
    var merge = require('merge-stream');
    var notify = require('gulp-notify');
    var sourcemaps = require('gulp-sourcemaps');
    var uglify = require('gulp-uglify');
    var vinylify = require('vinyl-source-stream');
    var watchify = require('watchify');
    var _ = require('lodash');
    // NOTE:
    //  1.Transform must be registered after plugin
    //  2.Some plugin (e.g. tsify) use transform internally, so make sure transforms are registered right after browserify initialized.
    var EXCERPTS = [
        'plugin',
        'transform',
        'require',
        'exclude',
        'external',
        'ignore'
    ];
    var gulp = this.gulp;
    var config = this.config;
    // Start bundling with Browserify for each bundle config specified
    return merge(_.map(config.bundles, browserifyThis));
    function browserifyThis(bundleConfig) {
        var options, excerpts, browserify;
        options = realizeOptions();
        excerpts = _.pick(options, EXCERPTS);
        options = _.omit(options, EXCERPTS);
        options = prewatch(options);
        browserify = new Browserify(options).on('log', log);
        watch();
        EXCERPTS.forEach(function (name) {
            var excerpt = excerpts[name];
            _apply(excerpt, function (target) {
                browserify[name](target);
            });
        });
        return bundle();
        // Add watchify args
        function prewatch(theOptions) {
            if (config.watch) {
                return _.defaults(theOptions, watchify.args);
            }
            return theOptions;
        }
        function watch() {
            if (config.watch) {
                // Wrap with watchify and rebundle on changes
                browserify = watchify(browserify, typeof config.watch === 'object' && config.watch);
                // Rebundle on update
                browserify.on('update', bundle);    // bundleLogger.watch(bundleConfig.file);
            }
        }
        function bundle() {
            var stream, dest;
            // Log when bundling starts
            // bundleLogger.start(bundleConfig.file);
            stream = browserify.bundle()    // Report compile errors
.on('error', handleErrors)    // Use vinyl-source-stream to make the stream gulp compatible.
                              // Specify the desired output filename here.
.pipe(vinylify(options.file))    // optional, remove if you don't need to buffer file contents
.pipe(buffer());
            if (options.sourcemaps) {
                // Loads map from browserify file
                stream = stream.pipe(sourcemaps.init({ loadMaps: true }));
            }
            if (options.uglify) {
                stream = stream.pipe(uglify());
            }
            // Prepares sourcemaps, either internal or external.
            if (options.sourcemaps === true) {
                stream = stream.pipe(sourcemaps.write());
            } else if (typeof options.sourcemaps === 'string') {
                stream = stream.pipe(sourcemaps.write(options.sourcemaps));
            }
            // Specify the output destination
            dest = options.dest || config.dest;
            return stream.pipe(gulp.dest(dest.path, dest.options)).pipe(browserSync.reload({ stream: true }));
        }
        function realizeOptions() {
            var result;
            result = _.defaults({}, _.omit(bundleConfig, ['options']), bundleConfig.options, config.options);
            result.entries = result.entries.globs;
            // add sourcemap option
            if (result.sourcemaps) {
                // browserify use 'debug' option for sourcemaps,
                // but sometimes we want sourcemaps even in production mode.
                result.debug = true;
            }
            return result;
        }
        function handleErrors() {
            var args = Array.prototype.slice.call(arguments);
            // Send error to notification center with gulp-notify
            notify.onError({
                title: 'Browserify Error',
                message: '<%= error %>'
            }).apply(this, args);
            this.emit('end');
        }
    }
    function _apply(values, fn) {
        if (Array.isArray(values)) {
            values.forEach(fn);
        } else if (values) {
            fn(values);
        }
    }
}
module.exports = browserifyTask;
module.exports.schema = schema;
module.exports.type = 'task';