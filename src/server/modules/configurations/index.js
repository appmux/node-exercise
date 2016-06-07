
import getRoutes from './configurations.route.js';
import { _extend as extend } from 'util';

export { getRoutes };

export function factory(sm) {
    console.log('configs sm', sm);
    this.store = sm.get('store');
    this.configs = this.store.get('configurations');

    this.indexAction = indexAction;
    this.detailsAction = detailsAction;

    return this;
}

function indexAction(req, res) {
    let host = 'http://' + req.headers.host;

    let configs = this.configs.reduce((configs, config) => {
        let links = {
            self: host + req.url + '/' + config.name
        };
        configs.push(extend({links: links}, config));
        return configs;
    }, []);

    let self = host + req.url;

    let links = {
        self: self
    };

    return JSON.stringify(extend({configs: configs}, {links: links}));
}

function detailsAction(req) {
    let config = this.configs.find(config => {
        return config.name == req.params.host;
    });

    console.log('detailsAction', config);

    return JSON.stringify(config);
}
