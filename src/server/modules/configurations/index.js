
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
    // TODO This definitely can be extracted into a generic pagination plugin.
    let configs = extend([], this.store.get('configurations') || []);
    let linksUrl = extend({}, req.url);

    let sortBy = ['hostname', 'port', 'username'].find(sortBy => sortBy === req.url.query.sortBy) || 'name';
    let order = ['desc'].find(order => order === req.url.query.order) || 'asc';

    let pages = Math.ceil(configs.length / this.configuration.itemsPerPage);
    let page = Math.min(pages, req.url.query.page || 1) - 1;
    let pageIndexStart = page * this.configuration.itemsPerPage;

    let pager = {
        items: configs.length,
        pages: pages,
        current: page,
        next: page + 2 <= pages ? page + 2: undefined,
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

    res.body = JSON.stringify(extend(
        {
            links: links,
            pager: pager
        },
        {configs: configs}
    ));
}

function detailsAction(req, res) {
    let configs = extend([], this.store.get('configurations') || []);
    let config = configs.find(config => config.name == req.params.name);

    if (config) {
        res.body = JSON.stringify(config);
    } else {
        res.statusCode = 404;
    }
}

function createAction(req, res) {
    let source = sanitizePayload(req.body);
    let errors = [];

    if (source) {
        let configs = extend([], this.store.get('configurations') || []);

        if (!configs.find(config => config.name === source.name)) {
            configs.push(source);
            this.store.set('configurations', configs);

            res.statusCode = 201;
            res.setHeader('Location', req.url.href + '/' + source.name);
        } else {
            errors.push('Configuration with name \'' + source.name + '\' already exists.');
            res.statusCode = 409;
        }
    } else {
        errors.push('Configuration is malformed.');
        res.statusCode = 400;
    }

    if (errors.length > 0) {
        res.body = formatErrors(errors);
    }
}

function updateAction(req, res) {
    let source = sanitizePayload(req.body);
    let errors = [];

    if (source) {
        let configs = extend([], this.store.get('configurations') || []);

        if (configs.find(config => config.name === req.params.name)) {
            if (source.name === req.params.name) {
                configs.push(source);
                this.store.set('configurations', configs);
            } else {
                errors.push('Must be a configuration with name ' + req.params.name + '.');
                res.statusCode = 400;
            }
        } else {
            errors.push('Configuration with name ' + req.params.name + ' not found.');
            res.statusCode = 404;
        }
    } else {
        errors.push('Configuration is malformed. Not all required fields are provided or contain bad data.');
        res.statusCode = 400;
    }

    if (errors.length > 0) {
        res.body = formatErrors(errors);
    }
}

function deleteAction(req, res) {
    let configs = extend([], this.store.get('configurations') || []);
    let deleteIndex;

    configs.find((config, i) => {
        if (config.name == req.params.name) {
            deleteIndex = i;
        }

        return deleteIndex >= 0;
    });

    if (deleteIndex >= 0) {
        configs.splice(deleteIndex, 1);
        this.store.set('configurations', configs);
    } else {
        res.statusCode = 404;
    }
}

function sortConfigsBy(key, order) {
    order = order === 'asc' ? 1 : -1;

    return (a, b) => {
        if (a[key] < b[key]) return -1 * order;
        else if (a[key] > b[key]) return 1 * order;
        else return 0;
    };
}

function sanitizePayload(source) {
    try {
        source = JSON.parse(source);
    } catch (e) {
        source = {};
    }

    if (
        typeof source.name === 'string' && source.name.length > 0 &&
        typeof source.hostname === 'string' &&
        !isNaN(Number(source.port)) &&
        typeof source.username === 'string'
    ) {
        return ['name', 'hostname', 'port', 'username']
            .reduce((sanitized, prop) => {
                sanitized[prop] = source[prop];
                return sanitized;
            }, {});
    }
}

function formatErrors(errors) {
    return JSON.stringify(errors.reduce(
        (error, message) => {
            error.push({
                error: {
                    message: message
                }
            });
            return error;
        },
        []
    ));
}
