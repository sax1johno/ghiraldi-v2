Ghiraldi framework
=============
Ghiraldi (pronounced "gear-ahl-dee') is a component-based MVC framework for node.js apps based on Express.js.

1. [What is Ghiraldi](#what-is-ghiraldi)
2. [Anatomy of a Ghiraldi App](#anatomy-of-a-ghiraldi-app)
3. [Quick Start](#quick-start)
4. [Configuring your application](#configuring-your-application)
5. [URL Routes](#url-routes)
6. [Some Conventions](#some-conventions)
7. [Copyright and license](#copyright-and-license)

# NOTE: This documentation is out of date
I'm working on the latest version of Ghiraldi which introduces some exciting new features that
haven't quite made it to this documentation yet.  I promise this will be updated before long.

John
11/8/2013

# I'm on CLOUD9
If you're interested in working on the Ghiraldi framework, join my public development workspace on Cloud9 (https://c9.io/sax1johno/ghiraldi-framework).

# What is Ghiraldi?
Perhaps I should start with what Ghiraldi ISN'T.
* Ghiraldi is NOT a rails clone.  It is a combination of the best parts of Django, RAILS, javascript, grails, and others.
* Ghrialdi is NOT a rapid application development platform, although apps can be developed very quickly using Ghiraldi.  The focus of Ghiraldi is writing modular, component-based, large web applications using Node.js.
* Ghiraldi is NOT just another MVC framework.  While applications are build using an MVC architecture, Ghrialdi is more interested in development using modular components and re-usable apps (called plugins).

__So, what IS Ghiraldi?__
Ghiraldi is a modular framework for developing big web apps in node.js.  With that goal in mind, Ghiraldi was designed to encourage creating small, testable modules and connecting
them together in infinitely complex ways.  Modules, and even entire apps, are easy to re-use and re-purpose.

Ghrialdi attempts to strike a balance between convention and configuration - it provides just enough magic to make development substantially faster and easier, but not 
so much that you have to find workarounds to solve basic problems outside the confines of the original framework design.

Some of its features are the following:
* MVC application architecture with plugins for extending functionality.
* Dependency Injection (DI) and Inversion of Control (IOC) make testing easy and robust
* Built on Express.js and you can use any express, connect, or node.js middleware / modules with ease.
* Controller-defined routes for extending application functionality without cluttering up your routes file.
* Like a little extra caffeine? Write apps in coffeescript or javascript.
* Views can be written in any view technology supported by express.

# Anatomy of a Ghiraldi app
A ghiraldi app consists of three different layers:

1. The framework layer consists of the main application bootstrap code, package definition information, and a locales extension.
2. The application layer contains your application which is built on the Ghiraldi framework.
3. Within the application layer is the plugin layer.  Plugins are other applications that are bootstrapped along with your application and extend its functionality.

Structurally, all framework files are contained within the base directory.
```
app.js                - The core file to be run by node (ie: node app.js).  This bootstraps the framework and creates the express.js app.
locales.js            - An extension that allows ghiraldi to understand languages and locales.
mvc.js                - The core of the framework.  Bootstraps the entire application and handles app-wide middleware.
package.json          - The node.js package description for this application.
README.md             - The README markdown file for Ghiraldi (you're probably reading README now).
app                   - This directory contains all of the components of your application.  Default is the Rosetta app.
    controllers        - The controllers for your application. This contains all of the logic for your application components.
    models             - The data models for your application.  Modules that represent data to be stored in a database go here.
    plugins            - The plugins that your application uses.  Each app can also become a plugin by placing it in a directory under "plugins" with "plugin_name-1.0.0", with the name of the plugin before the dash and the version number after the dash.
    public             - The public files served by your application.  They are automatically routed to their directory names (ie: /js maps to the js directory, /img maps to the img directory, etc).
    tests              - Tests for your components go here.  NodeUnit is recommended, but any other testing framework should work fine.
    services           - Services are injected allowing for robust testing and mocking. This is a good place for utilities that address cross-cutting concerns.
    views              - The views for your application.  Ghiraldi uses Jade by default, but you can configure it to use another.
    config.json          - Your application configuration - all app configuration (and default overrides) goes here.
```

# QUICK START
Ghiraldi provides a basic starting project (called "rosetta") that provides a good starting point for your apps.  It has some of the more common and useful patterns 
for writing Ghiraldi apps, including a template you can use for controllers, models, and configuration.  Rosetta is licensed under the liberal MIT license so you can use it
as the foundation for any application you'd like to create.

#Configuring your application
All application configuration should take place in the config.json file in your /app directory.  Many
parts of ghiraldi can be configured, and you can place whatever configuration items you need in config.json
as well.

config.json is separated into multiple environments and you can create settings that are unique to each environment.
Ghiraldi will choose which environment settings to use by first looking for an "environment" key in the config.json file.
If there is no environment set in config.json, it will then attempt to use NODE_ENV.  If no NODE_ENV setting is present,
it will default to "development".

Below is a rosetta code version of config.json that shows the possible default configuration overrides.
(NOTE: All items are optional)

```javascript
{
    "environment": "development",           // You can set the environment here. Otherwise, ghiraldi will look the NODE_ENV environment variable 
    "development": {                        // The settings for the development environment.
        "data": {                           // data storage settings for configuring persistent storage.
            "provider": "mongodb",          // the data storage provider (right now only mongodb is supported).
            "host": "127.0.0.1:27017",      // Other configuration and settings for the data storage provider go below.
            "database": "test",         
            "username": "user",         
            "password": "password"      
        },
        "appSettings": {                        // Application settings overrides (changes from the defaults).  NOTE: must be named appSettings.
            "uploadDir": "/public/files",       // When using the bodyparser / files middleware from express, specifies the upload directory
            "publicDir": "/public",             // Specifies which directory should be used for public files (js, img, css, etc).
            "sessionSecretSalt": "Blu3sM@N",    // A custom session secret - override this if you plan on using session 
            "viewsDir": "/views",               // Changes the directory in which your views are stored.
            "viewEngine": "jade"                // Changes the view engine.  Other options are "html", "ejb", or anything else supported by express.
        },
        "myCustomSettings": {   // Add any number of arbitrary settings that you want.  You can use them throughout your application by adding require('path/to/config.json')
        },
        ...
    },
    "production": {     // You can have any number of arbitrary environment names with custom settings for each environment.
    },
    "staging": {    
    },
    ...
}
```
#URL Routes
All controllers have a special export called "routes" that can add URL routes to your application.  Since controllers generally
represent a single piece of system functionality, it made sense to us to define the routes for those functions in the 
same place that you develop those functions.

The following is an example of the module.exports for a controller that defines routes:
```javascript
var index = function(req, res, next) {
    res.send({"test": "this is a test"});
}

module.exports = {         // The normal module.exports for a node.js module.
        ..                  // Your other exports can go anywhere as they normally would. 
        routes: [          // Ghiraldi will look for this special export for route definitions IF this file is a controller (in the controllers directory)
        {                   // Routes are defined as an array of route objects.
            verb: 'get',                    // required: Verb is the HTTP verb. Options are 'get', 'post', 'put', 'del'
            route: '/',                     // required: The route, starting with / as the root.
            method: index                   // required: The method that executes when the route is resolved. 
            middleware: [                   // optional: An array of middleware that will be executed when this route is called (also called a "filter").
                util.restrictToAdmin,       // an example middleware that restricts this URL to a specific set of roles.
                function(req, res, next) {  // You can also define middleware inline, although this is discouraged.
                    next();
                }

            ]
        },
        ...     // Define all routes specific to this controller here.
    ],
    ...     // Continue with other exports if necessary.
}
```

#SOME CONVENTIONS
Ghiraldi apps provide some time-saving conventions while ensuring that you never get lost in trying to overcome those conventions.

## Application structure
Ghiraldi apps have the following structural conventions.  Conventions that are enforced by the framework are marked "required".
Those that can be overridden using configuration are marked with a "configurable".
Those that are not enforced but recommended are marked "optional".
```
models
    REQUIRED: all application models must be stored in a directory named "models".
controllers
    REQUIRED: all application controllers must be stored in the directory named "controllers"
views
    CONFIGURABLE: The default is the "views" directory, but this can be changed in the appSettings object in config.json.
public
    CONFIGURABLE: The default is the "public" directory in your app, but this can be changed in config.json.
resources
    REQUIRED: If you decide to use the locales.js plugin, you must put your language resources in the "resources" directory in your app.
plugins
    REQUIRED: If you have any plugins you'd like to use in your app, they must go in the plugins directory.
tests
    OPTIONAL: Tests are encouraged, but you can place them in any folder you'd like.  Ghiraldi does not include a testing framework by default (yet)
utils
    OPTIONAL: This is a good place to store any classes that represent cross-cutting concerns (such as reusable middleware), but that are not necessarily controllers on their own.
helpers.js
    REQUIRED: If you have any helper functions you'd like to register, they must go in helpers.js.  This is a holdover from express 2.x and may go away.
config.json
    REQUIRED: Contains the configuration settings for your application.
```
#COPYRIGHT AND LICENSE
Copyright (C) 2013, John O'Connor

Ghiraldi is licensed under the Mozilla Public License (MPL) Version 2.0, found in the LICENSE file or at http://mozilla.org/MPL/2.0/. My intention in releasing Ghiraldi under MPL is to give you, the end developer, as much freedom as possible in
developing your applications while still ensuring that modifications to the Ghiraldi framework core are contributed back to the project (a "reciprocol license").