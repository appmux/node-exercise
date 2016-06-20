'use strict';

import * as events from 'events';
import http from 'http';
import url from 'url';
import fs from 'fs';
import { _extend as extend } from 'util';
import * as router from './router';
import * as serviceManager from './serviceManager';
import * as mimeTypes from './mimeTypes';

export function configure(config) {
    this.config = config;
    this.config.mimeTypes = mimeTypes.getTypes();

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

        let module = this.serviceManager.get(matchedRoute.module);
        let action = matchedRoute.action + 'Action';

        req.params = matchedRoute.params;

        if (typeof module[action] === 'function') {
            module[action](req, res);
        }
    } else if (!req.terminate) {
        let path = req.url.pathname;

        if (path.match(/\/$/)) {
            // TODO Handle directory listing
            // TODO Add support for default files, i.e. index.htm, etc.

            path += 'index.html';
        }

        let pathExists = this.config.staticDirs.some(dir => {
            let p = __dirname + '/' + dir + path;

            if (fs.existsSync(p)) {
                path = p;
                return true;
            }
        });

        let type = this.config.mimeTypes[path.substring(path.lastIndexOf('.') + 1)];

        try {
            res.body = fs.readFileSync(path);
        } catch (e) {
            res.statusCode = 404;

            // TODO Only if debug is on
            res.body = JSON.stringify(e);
            type = 'application/json'
        }

        headers = extend(headers, {
            'Content-Type': type || 'text/html'
        });
    }

    Object.keys(headers).map(name => res.setHeader(name, headers[name]));

    // TODO Check other mime types for text/binary stream
    let isBinary = ['image/png'].some(type => res.getHeader('Content-Type') == type);

    let send = [];

    if (isBinary) {
      send.push(res.body || '');
      send.push('binary');
    } else {
      send.push((res.body || '').toString());
    }

    res.end.apply(res, send);
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
