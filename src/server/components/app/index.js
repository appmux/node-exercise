'use strict';

import http from 'http';
import * as router from '../router';

export function configure(config) {
    console.log('configure', config);

    this.getConfig = () => config;
    this.run = run;

    return this;
}

function run(file) {
    const config = this.getConfig();
    let modules = loadModules(config);
    console.log('modules', modules);

    http.createServer((req, res) => {
        let matchedRoute = router.match(req);

        if (typeof matchedRoute !== 'undefined') {
            let module = modules[matchedRoute.module];
            let action = matchedRoute.action + 'Action';

            res.writeHead(matchedRoute.status || 200, matchedRoute.headers);
            res.end(module[action]());
        } else {
            res.writeHead(404);
            res.end();
        }

    }).listen(config.port, config.address);

    console.log('Server running at http://' + config.address + ':' + config.port + '/');
}

function loadModules(config) {
    let modules = {};

    (config.modules || []).map((module) => {
        modules[module] = require(config.modulesDir + '/' + module);
    });

    return modules;
}
