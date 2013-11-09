/**
 * The main bootstrapping and loading file for the ghiraldi framework.  Access
 * to all of the features of ghiraldi will go through here.
 * 
 **/
 
// External Dependencies
var EventEmitter = require('events').EventEmitter,
    Q = require('Q'),
    _ = require('underscore'),
    express = require('express');

    
// Module globals
var provider = require('./defaultServiceProvider'),   // The service injector and provider for the application.
    bootEvents = new EventEmitter(), // Provides an interface for listening to boot events.
    app = express(); // Ghiraldi uses express under the hood.  This is the base express app.
    
/**
 * Boots the application framework.  Current options are:
 * @param options - possible options include the following:
 *  - provider (optional): A service provider.  If none is specified, the default is used.
 * @return a promise that resolves when the boot process is complete and rejects on error.
 **/
var boot = function(options) {
    if (_.isUndefined(options)) {
        options = {};
    };
    var bootDefer = Q.defer();
    if (!_.isUndefined(options.provider)) {
        provider = require(options.provider);
    }
    
    provider.boot(app, bootEvents).then(function() {
        bootDefer.resolve();
    }, function() {
        bootDefer.reject();
    });
    return bootDefer.promise;
}

module.exports.boot = function(options) {
    // Only allow the boot method to be called once.
    _.once(boot(options))
}

module.exports = {
    boot: boot,
    provider: provider,
    bootEvents: bootEvents
}