
import url from 'url';
import { _extend as extend } from 'util';
import getRoutes from './configurations.route.js';
import configuraton from './configurations.config.json';

export { getRoutes };

export function factory(sm) {
    this.configuration = configuraton;
    this.store = sm.get('store');
    this.index = undefined;

    this.indexAction = indexAction;
    this.detailsAction = detailsAction;
    this.createAction = createAction;
    this.updateAction = updateAction;
    this.deleteAction = deleteAction;

    return this;
}

function indexAction(req, res) {
    let configs = extend([], this.store.get('configurations') || []);
    let host = req.url.protocol + '//' + req.url.host;
    let linksUrl = extend({}, req.url);

    let sortBy = ['hostname', 'port', 'username'].find(sortBy => sortBy === req.url.query.sortBy) || 'name';
    let order = ['desc'].find(order => order === req.url.query.order) || 'asc';

    let pages = Math.ceil(configs.length / this.configuration.itemsPerPage);
    let page = Math.min(pages, req.url.query.page || 1) - 1;
    let pageIndexStart = page * this.configuration.itemsPerPage;

    let pager = {
        total: pages,
        current: page,
        next: page + 2 < pages ? page + 2: undefined,
        previous: page > 0 ? page : undefined
    };

    configs = configs
        .sort(sortConfigsBy(sortBy, order))
        .slice(pageIndexStart, pageIndexStart + this.configuration.itemsPerPage)
        .reduce((configs, config) => {
            let self = extend({}, linksUrl);
            self.pathname += ('/' + config.name);
            self.query = {};
            self.search = undefined;

            let links = {
                self: url.format(self)
            };
            configs.push(extend({links: links}, config));
            return configs;
        }, []);

    let links = {
        self: url.format(linksUrl)
    };

    if (pager.next) {
        linksUrl.query.page = pager.next;
        linksUrl.search = undefined;
        links.nextPage = url.format(linksUrl);
    }

    if (pager.previous) {
        linksUrl.query.page = pager.previous;
        linksUrl.search = undefined;
        links.prevPage = url.format(linksUrl);
    }

    this.result = JSON.stringify(extend(
        {
            links: links,
            pager: pager
        },
        {configs: configs}
    ));
}

function detailsAction(req) {
    let configs = extend([], this.store.get('configurations') || []);
    let config = configs.find(config => {
        return config.name == req.params.host;
    });

    if (!config) {
        this.result = undefined;
        this.status = 404;
    } else {
        this.result = JSON.stringify(config);
    }
}

function createAction(req) {
    console.log('createAction');
}

function updateAction(req) {
    console.log('updateAction');
}

function deleteAction(req) {
    console.log('deleteAction');
}

function sortConfigsBy(key, order) {
    order = order === 'asc' ? 1 : -1;

    return (a, b) => {
        if (a[key] < b[key]) return -1 * order;
        else if (a[key] > b[key]) return 1 * order;
        else return 0;
    };
}
