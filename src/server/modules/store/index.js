
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
    this.generateConfigs = generateConfigs;
    this.generateContacts = generateContacts;

    if (fs.existsSync(this.storePath)) {
        this.store = require(this.storePath);
        this.dirty = false;
    } else {
        this.resetStore();
    }

    setInterval(() => {
        if (this.dirty) this.save();
    }, 5000);

    return this;
}

function resetAction(req, res) {
    this.resetStore().save();
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
    this.store = extend({}, this.configuraiton.store);
    this.store.configurations = this.generateConfigs();
    this.store.contacts = this.generateContacts();

    return this;
}

function generateConfigs() {
  let conf = this.configuraiton,
    items = [];

  while (items.length < this.configuraiton.numberOfConfigs) {
    let host = (
      this.configuraiton.names[Math.floor(Math.random() * this.configuraiton.names.length)] + '-' +
      this.configuraiton.colors[Math.floor(Math.random() * this.configuraiton.colors.length)] + '.' +
      this.configuraiton.domains[Math.floor(Math.random() * this.configuraiton.domains.length)]
    ).toLowerCase();

    if (!items[host]) {
      items.push(host);
    }
  }

  items = items.map((config, i) => {
    return {
      name: 'host' + (1000 + i),
      hostname: config,
      port: Math.floor(Math.random() * 1000) + 1000,
      username: config.replace(/\W/g, '')
    }
  });

  return items;
}

function generateContacts() {
  let conf = this.configuraiton,
    items = [];

  while (items.length < conf.numberOfContacts) {
    let item = {};

    item.id = items.length + 1001;

    item.type = conf.types[Math.floor(Math.random() * conf.types.length)];

    item.name = (
      conf.names[Math.floor(Math.random() * conf.names.length)] + ' ' +
      conf.colors[Math.floor(Math.random() * conf.colors.length)]
    );

    item.title = conf.titles[Math.floor(Math.random() * conf.titles.length)];

    item.phone = Math.floor(Math.random() * 10000000000) + 10000000000;

    item.ext = Math.floor(Math.random() * 1000);
    item.ext = item.ext < 300 ? item.ext.toString() : '';

    item.fax = item.phone + 1;

    item.email = item.name.replace(' ', '.').toLowerCase() + '@example.com';

    items.push(item);
  }

  return items;
}

function save() {
    fs.writeFileSync(this.storePath, JSON.stringify(this.store, null, 2));
    this.dirty = false;

    return this;
}
