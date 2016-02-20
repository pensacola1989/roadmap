'use strict';

import _ from 'underscore';
import util from 'util';
import System from 'systemjs';

System.transpiler = 'babel';

function loadServices(config) {
	var globalOptions,
		services = {},
		service,
		options,
		serviceConfig,
		ServiceClz,
		serviceInstance;

		globalOptions = config.options;



		for (var service in config.services) {
			if (config.services.hasOwnProperty(service)) {
				serviceConfig = config.services[service];
				options = serviceConfig.options;

				if (typeof(options) === 'string') {
					if (!globalOptions[options]) {
						throw new Error('No global options "' + options + '" defined for service "' + service + '"');

					}
					options = globalOptions[options];
				}
				console.log('init service' + serviceConfig.clz);

				// ---------------es 6----------------------------------
				// (async () => {
				// 	try	{
				// 		ServiceClz = await System.import('./dist/server.js');
	            //         console.log(ServiceClz)
				// 		serviceInstance = new ServiceClz(options);
				//
				// 		services[service] = serviceInstance;
				// 	}
				// 	catch(e) {
				// 		console.log(e);
				// 	}
				// }) ();

				// ----------------------------------------------------
				ServiceClz = require(serviceConfig.clz)[service];

				serviceInstance = new ServiceClz(options);

				services[service] = serviceInstance;
			}
		}

		// init dependency services
		for (service in config.services) {
			if (config.services.hasOwnProperty(service)) {
				serviceConfig = config.services[service];
				options = serviceConfig.options;
				console.log("init dependency services: " + serviceConfig.clz);
				if (serviceConfig.services) {
					for (var serviceName in serviceConfig.services) {
						if (serviceConfig.services.hasOwnProperty(serviceName)) {
							if (typeof serviceConfig.services[serviceName] === 'string') {
								serviceInstance = services[serviceConfig.services[serviceName]];
								serviceInstance = services[serviceConfig.services[serviceName]];
								if (!serviceInstance) {
									throw new Error('No service "' +
                                    serviceName + '" defined for service "' +
                                    service + '"');
									services[service]['_' + serviceName] = serviceInstance;
								}
							}
							else if (serviceConfig.services[serviceName] instanceof Array) {
								// array of services
								var serviceInstances = [];
								for (var i = 0; i < serviceConfig.services[serviceName].length; i++) {
									var dependentServiceName = serviceConfig.services[serviceName][i];
									serviceInstance = services[dependentServiceName];
									if (!serviceInstance) {
										throw new Error('No service "' +
                                      dependentServiceName + '" defined for service "' +
                                        service + '"');
									}
									serviceInstances.push(serviceInstance);
								}
								services[service]['_' + serviceName] = serviceInstances;
							}
						}
					}
				}
			}
		}
		return services;
}

function loadControllers(app, config, services, io) {
	var globalOptions, controllers = {}, controller, controllerConfig, options, dependendServices = {}, serviceName,
		serviceInstance, controllerBunch;
	// load and initialize the controllers
	globalOptions = config.options;
	for (controller in config.controllers) {
		if (config.controllers.hasOwnProperty(controller)) {
			controllerConfig = config.controllers[controller];

			options = controllerConfig.options;
			if (typeof (options) === 'string') {
				if (!globalOptions[options]) {
					throw new Error('No global options "' + options + '" defined for controller "' + controller + '"');
				}
				options = globalOptions[options];
			}
			if (controllerConfig.services) {
				for (serviceName in controllerConfig.services) {
					if (controllerConfig.services.hasOwnProperty(serviceName)) {
						serviceInstance = services[serviceName];
						if (!serviceInstance) {
							throw new Error('No service "' +
                                serviceName + '" defined for controller "' + controller + '"');
						}
						dependendServices[serviceName] = serviceInstance;
					}
				}
			}

			var controllerPath = './controllers/' + controller;
			var controllerBunch = require(controllerPath)[controller];

			// controllers[controller] = new controllerBunch(options, dependendServices, app, io);
			controllers[controller] = Reflect.construct(controllerBunch, [options, dependendServices, app, io]);
		}
	}

	return controllers;
}

function loadRoutes(app, config, controllers) {
	var globalOptions, routingMethods, route, routeValues, routeKeys, verb,
		path, controllerName, actionName, actionMethod;

	globalOptions = config.options;

	// load and initialize the routes
	routingMethods = {
		GET: 'get',
		POST: 'post',
		PUT: 'put',
		DELETE: 'delete',
		HEAD: 'head',
		OPTIONS: 'options'
	};

	_.each(config.routes, function (routeKeys, route) {
		routeKeys = route.split(' ');
		if (routeKeys.length !== 2) {
			throw new Error('ERROR Route key "' + route +
            '" Route key must be "<HTTP-verb> <path-pattern>", like "GET /foo/:id"');
		}
		verb = routeKeys[0];
		path = routeKeys[1];
		var middlewares = config.routes[route];
		var transformed = [];
		if (!_.isArray(middlewares)) {
			middlewares = [middlewares];
		}
		// add middlewares for REST API routes
		// if (path.indexOf('/api/') === 0) {

		// }
		_.each(middlewares, function (middleware) {
			routeValues = middleware.split('#');
			if (routeValues.length !== 2) {
				throw new Error('ERROR Route value "' + config.routes[route] +
                '" Route value must be "<controller-name>#<action-method-name>",' +
                ' like "foo#index"');
			}
			controllerName = routeValues[0];
			actionName = routeValues[1];

			if (!routingMethods[verb]) {
                throw new Error('HTTP verb "' + verb + '" for route "' + route + '" is not supported!');
            }
            if (!controllers[controllerName]) {
                throw new Error('Controller "' + controllerName + '" is not available for route "' + route + '"!');
            }
            actionMethod = controllers[controllerName][actionName];
            if (!actionMethod) {
                throw new Error('Action method "' + controllerName + '#' +
                actionName + '" is not available for route "' + route + '"!');
            }
            // transformed.push(controllers[controllerName][actionName].bind(controllers[controllerName]));
						transformed.push(::controllers[controllerName][actionName]);

		});
		if (path.indexOf("/api/") === 0) {
            //error handler
            transformed.push(function (error, req, res, next) {
                var objToLog;
                if (error instanceof Error) {
                    //stack contains error message
                    objToLog = {error: JSON.stringify(error), stack: error.stack};
                } else {
                    objToLog = JSON.stringify(error);
                }
                util.error(req.signature, util.inspect(objToLog));
                res.status(error.httpStatus || 500).json({
                    error: error.message,
                    fullError: error
                });
            })
        }
				// controllers[controllerName][actionName]();
        app[routingMethods[verb]](path, transformed);
	});
}

function loadSockets (config, io, services) {
	var socketConfig, sockets = {}, options, globalOptions, dependencyservices, serviceName, serviceInstance, socketBunch, socket;
	globalOptions = config.options;

	for (socket in config.sockets) {
		if (config.sockets.hasOwnProperty(socket)) {
			socketConfig = config.sockets[socket];
			options = socketConfig.options;
            if (typeof (options) === 'string') {
                if (!globalOptions[options]) {
                    throw new Error('No global options "' + options + '" defined for socket "' + socket + '"');
                }
                options = globalOptions[options];
            }

			dependencyservices = {};
			if (socketConfig.services) {
				for (serviceName in socketConfig.services) {
					if (socketConfig.services.hasOwnProperty(serviceName)) {
						serviceInstance = services[serviceName];
						if (!serviceInstance) {
                            throw new Error('No service "' +
                                serviceName + '" defined for socket "' + socket + '"');
                        }
                        dependencyservices[serviceName] = serviceInstance;
					}
				}
			}

			socketBunch = require('./sockets/' + socket);
			socketBunch.init(options, dependencyservices, io);
			sockets[socket] = socketBunch;
		}
	}
	return sockets;
}

function loadConfig(app, io) {
	var env = app.get('env');

	var configuration = require('../config/' + env),
		services = loadServices(configuration),
		controllers = loadControllers(app, configuration, services, io);
	loadRoutes(app, configuration, controllers);

	// var configuration = require('../config/' + env),
	// 	services = loadServices(configuration),
	// 	controllers = loadControllers(app, configuration, services, io);
	// loadRoutes(app, configuration, controllers);
	app.controllers = controllers;

	return services;
}



export var loadConfig = loadConfig;
export var loadServices = loadServices;
