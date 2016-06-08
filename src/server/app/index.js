'use strict';

import http from 'http';
import url from 'url';
import { _extend as extend } from 'util';
import * as dispatcher from './dispatcher';
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
    serviceManager.register('appConfig', this.config);
    serviceManager.register('dispatcher', dispatcher);

    this.loadModules();

    http.createServer((req, res) => {
        req.url = url.parse('http://' + req.headers.host + req.url, true);
        req.query = req.url.query;

        let matchedRoute = this.router.match(req);
        let result = '';
        let status = this.config.defaults.response.status;
        let headers = extend({
            'Content-Type': 'text/plain'
        }, this.config.defaults.response.headers);

        if (typeof matchedRoute !== 'undefined') {
            dispatcher.dispatch('onRoute', req, res, matchedRoute);

            let module = serviceManager.get(matchedRoute.module);
            let action = matchedRoute.action + 'Action';

            req.params = matchedRoute.params;

            if (typeof module[action] === 'function') {
                module[action](req, res);
                result = module['result'] || '';
                status = module['status'] || 200;
            }

            headers = extend(headers, matchedRoute.headers || {});
        }

        res.writeHead(status, headers);
        res.end(result);

    }).listen(this.config.port, this.config.address);

    console.log('Server running at http://' + this.config.address + ':' + this.config.port + '/');
}

function loadModules() {
    let modules = Array.isArray(this.config.modules) ? this.config.modules : [];

    modules.map((name) => {
        let module = require((this.config.modulesDir || '.') + '/' + name);

        if (typeof module.getRoutes === 'function') {
            this.router.addRoutes(module.getRoutes().map(route => {
                route.module = name;
                return route;
            }));
        }

        if (typeof module.factory === 'function') {
            module = module.factory(serviceManager);
        }

        serviceManager.register(name, module);
    });
}
