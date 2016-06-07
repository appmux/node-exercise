
import getRoutes from './auth.route.js';

export { getRoutes };

export function factory(sm) {
    this.store = sm.get('store');
    
    return this;
}

export function tokenAction(req, res) {
    return '{"module": "auth - tokenAction"}';
}
