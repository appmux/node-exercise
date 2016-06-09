
import querystring from 'querystring';
import crypto from 'crypto';
import { _extend as extend } from 'util';
import getRoutes from './auth.route.js';

export { getRoutes };

let tokens = [];
let users;

export function factory(sm) {
    users = sm.get('store').get('users') || [];

    let eventManager = sm.get('eventManager');
    eventManager.on('requestStart', onRequestStart);

    this.tokenAction = tokenAction;
    this.refreshTokenAction = refreshTokenAction;
    this.logOut = logOut;

    return this;
}

function tokenAction(req, res) {
    let params = querystring.parse(req.body);

    if (
        params &&
        params.grant_type === 'password' &&
        typeof params.username === 'string' &&
        typeof params.password === 'string'
    ) {
        let user = users.find(user =>
            user.clientId === params.username &&
            user.secret === crypto.createHash('sha1').update(params.password).digest('hex')
        );

        if (user) {
            let time = Date.now();
            let data = generateTokens(user.clientId);
            tokens.push({
                expires: time + data.expires_in * 1000,
                refreshExpires: time + 3600 * 1000,
                data: data
            });

            res.body = JSON.stringify(data);
        } else {
            res.statusCode = 404;
        }
    } else {
        res.statusCode = 404;
    }
}

function refreshTokenAction(req, res) {
    let params = querystring.parse(req.body);

    if (
        params &&
        params.grant_type === 'refresh_token' &&
        typeof params.refresh_token === 'string'
    ) {
        let time = Date.now();
        let tokenIndex;
        let token = tokens.find((token, i) => {
            if (
                token.data.refresh_token === params.refresh_token &&
                token.refreshExpires > time
            ) {
                tokenIndex = i;
                return true;
            }
        });

        if (token) {
            let data = generateTokens(token.data.access_token);
            tokens.splice(tokenIndex, 1);
            tokens.push({
                expires: time + data.expires_in * 1000,
                refreshSxpires: time + 3600 * 1000,
                data: data
            });

            res.body = JSON.stringify(data);
        } else {
            res.statusCode = 404;
        }
    }
}

function logOut(req, res) {
    console.log('logOut');

    let tokenIndex;
    let token = tokens.find((token, i) => {
        if (token.data.access_token === (req.headers.authorization || '').substr('BEARER '.length)) {
            tokenIndex = i;
            return true;
        }
    });

    if (token) {
        tokens.splice(tokenIndex, 1);
    }
}

function generateTokens(salt) {
    let time = Date.now();
    let expires = 300;

    return {
        'access_token': crypto.createHash('sha1').update(salt + time).digest('hex'),
        'token_type': 'bearer',
        'expires_in': expires,
        'refresh_token': crypto.createHash('sha1').update(salt + time + expires).digest('hex')
    };

}

function onRequestStart(req, res, route) {
    if (route && route.data && route.data.authenticate) {
        let token = tokens.find(token => token.data.access_token === (req.headers.authorization || '').substr('BEARER '.length));

        if (!token) {
            req.terminate = true;
            res.statusCode = 401;
        }
    }
}
