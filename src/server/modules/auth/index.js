
import { _extend as extend } from 'util';
import getRoutes from './auth.route.js';

export { getRoutes };

let store;

export function factory(sm) {
    store = sm.get('store');
    
    let eventManager = sm.get('eventManager');
    eventManager.on('requestStart', onRequestStart);

    return this;
}

export function tokenAction(req, res) {
    store.set('tokens', ['SECURE_TOKEN']);
}

function onRequestStart(req, res, route) {
    let tokens = extend([], store.get('tokens') || []);
    let token = tokens.find(token => token === (req.headers.authorization || '').substr('BEARER '.length));
    
    if (!token) {
        req.terminate = true;
        res.statusCode = 401;
    }
}
