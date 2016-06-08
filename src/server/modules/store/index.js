
import fs from 'fs';
import { _extend as extend } from 'util';
import getRoutes from './store.route.js';
import configuraiton from './store.config.json';

export { getRoutes };

export function factory(sm) {
    this.configuraiton = configuraiton;
    this.storePath = this.configuraiton.storePath || __dirname + '/store.json';
    this.dirty = true;

    this.get = get;
    this.set = set;
    this.save = save;
    this.resetAction = resetAction;
    this.resetStore = resetStore;

    if (fs.existsSync(this.storePath)) {
        this.store = require(this.storePath);
        this.dirty = false;
    } else {
        this.resetStore();
    }

    setTimeout(() => {
        if (this.dirty) this.save();
    }, 5000);

    return this;
}

function resetAction(req) {
    this.resetStore();
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

function resetStore() {
    let configs = [];

    while (configs.length < this.configuraiton.numberOfConfigs) {
        let host = (
            this.configuraiton.names[Math.floor(Math.random() * this.configuraiton.names.length)] + '-' +
            this.configuraiton.colors[Math.floor(Math.random() * this.configuraiton.colors.length)] + '.' +
            this.configuraiton.domains[Math.floor(Math.random() * this.configuraiton.domains.length)]
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

    this.store = extend({}, this.configuraiton.store);
    this.store.configurations = configs;
}

function save() {
    fs.writeFileSync(this.storePath, JSON.stringify(this.store, null, 2));
    this.dirty = false;

    return this;
}
