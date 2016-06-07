
import getRoutes from './configurations.route.js';

export { getRoutes };

export function factory(sm) {
    this.store = sm.get('store');

    this.indexAction = indexAction;

    return this;
}

function indexAction(req, res) {
    let configs = this.store.get('configurations');

    return JSON.stringify(configs);
}
