
import fs from 'fs';
import getRoutes from './store.route.js';
import config from './store.config.json';
import { _extend as extend } from 'util';

export { getRoutes };

export function factory(sm) {
    this.config = config;

    this.storePath = this.config.storePath || __dirname + '/store.json';
    this.store = require(this.storePath);

    this.dirty = false;

    this.get = get;
    this.set = set;
    this.save = save;
    this.resetAction = resetAction;

    return this;
}

function resetAction(req) {
    let configs = [];

    while (configs.length < this.config.numberOfConfigs) {
        let host = (
            this.config.names[Math.floor(Math.random() * this.config.names.length)] + '-' +
            this.config.colors[Math.floor(Math.random() * this.config.colors.length)] + '.' +
            this.config.domains[Math.floor(Math.random() * this.config.domains.length)]
        ).toLowerCase();

        if (!configs[host]) {
            configs.push(host);
        }
    }

    configs = configs.map((config, i) => {
        return {
            name: 'host' + (1000 + i),
            hostname: config,
            port: Math.floor(Math.random() * 1000) + 1000,
            username: config.replace(/\W/g, '')
        }
    });

    this.store = extend({}, this.config.store);
    this.store.configurations = configs;
    
    this.save();
}

function get(key) {
    return this.store[key];
}

function set(key, value) {
    this.store[key] = value;
    this.dirty = true;
    
    return this;
}

function save() {
    fs.writeFileSync(this.storePath, JSON.stringify(this.store, null, 2));
    this.dirty = false;

    return this;
}
