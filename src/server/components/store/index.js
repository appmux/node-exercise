
import fs from 'fs';

export function factory(sm) {
    this.config = sm.get('config');

    this.storePath = this.config.storePath || './store.json';
    this.store = require(this.storePath);

    this.dirty = false;

    this.get = get;
    this.set = set;

    return this;
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
    fs.writeFileSync(this.storePath, JSON.stringify(this.store));
    this.dirty = false;

    return this;
}
