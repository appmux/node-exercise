'use strict';

import * as events from 'events';
import http from 'http';
import url from 'url';
import { _extend as extend } from 'util';
import * as router from './router';
import * as serviceManager from './serviceManager';

export function configure(config) {
    this.config = config;
    this.router = router.configure(config);

    this.run = run;
    this.loadModules = loadModules;

    return this;
}

function run() {
    this.eventManager = new events.EventEmitter();

    this.serviceManager = serviceManager;
    this.serviceManager.register('appConfig', this.config);
    this.serviceManager.register('eventManager', this.eventManager);

    this.loadModules();

    http
        .createServer((req, res) => {
            req.body = '';
            req
                .on('data', chunk => req.body += chunk)
                .on('end', () => handleRequest.call(this, req, res));
        })
        .listen(this.config.port, this.config.address);

    console.log('Server running at http://' + this.config.address + ':' + this.config.port + '/');
}

function handleRequest(req, res) {
    req.url = url.parse('http://' + req.headers.host + req.url, true);
    req.query = req.url.query;
    res.statusCode = this.config.defaults.response.statusCode;

    let matchedRoute = this.router.match(req);
    let headers = extend({
        'Content-Type': 'text/plain'
    }, this.config.defaults.response.headers);

    this.eventManager.emit('requestStart', req, res, matchedRoute);

    if (!req.terminate && typeof matchedRoute !== 'undefined') {

        headers = extend(headers, matchedRoute.headers || {});
        Object.keys(headers).map(name => res.setHeader(name, headers[name]));

        let module = this.serviceManager.get(matchedRoute.module);
        let action = matchedRoute.action + 'Action';

        req.params = matchedRoute.params;

        if (typeof module[action] === 'function') {
            module[action](req, res);
        }
    }

    res.end(res.body || '');
}

function loadModules() {
    let modules = Array.isArray(this.config.modules) ? this.config.modules : [];

    modules.map(name => {
        let module = require((this.config.modulesDir || '.') + '/' + name);

        if (typeof module.getRoutes === 'function') {
            this.router.addRoutes(module.getRoutes().map(route => {
                route.module = name;
                return route;
            }));
        }

        if (typeof module.factory === 'function') {
            module = module.factory(this.serviceManager);
        }

        this.serviceManager.register(name, module);
    });
}
