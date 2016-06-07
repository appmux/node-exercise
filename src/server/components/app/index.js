'use strict';

import http from 'http';
import * as dispatcher from './dispatcher';
import * as router from './router';
import * as serviceManager from './serviceManager';

export function configure(config) {
    this.config = config;
    this.run = run;

    return this;
}

function run(file) {
    const config = this.config;

    serviceManager.register('config', config);
    serviceManager.register('dispatcher', dispatcher);

    loadComponents(config);
    let modules = loadModules(config);

    http.createServer((req, res) => {
        let matchedRoute = router.match(req);

        dispatcher.dispatch('onRoute', req, res, matchedRoute);

        if (typeof matchedRoute !== 'undefined') {
            let module = modules[matchedRoute.module];
            let action = matchedRoute.action + 'Action';

            req.params = matchedRoute.params;

            let result = module[action](req, res);

            res.writeHead(matchedRoute.status || 200, matchedRoute.headers);
            res.end(result);
        } else {
            res.writeHead(404);
            res.end();
        }

    }).listen(config.port, config.address);

    console.log('Server running at http://' + config.address + ':' + config.port + '/');
}

function loadComponents(config) {
    (config.components || []).map((name) => {
        let component = require((config.componentsDir || '.') + '/' + name);

        if (typeof component.factory === 'function') {
            component.factory(serviceManager);
        }

        serviceManager.register(name, component);
    });
}

function loadModules(config) {
    let modules = {};

    (config.modules || []).map((name) => {
        let module = require((config.modulesDir || '.') + '/' + name);

        if (typeof module.getRoutes === 'function') {
            router.configure(module.getRoutes());
        }

        if (typeof module.factory === 'function') {
            module = module.factory(serviceManager);
        }

        modules[name] = module;
    });

    return modules;
}
