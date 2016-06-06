'use strict';

export function match(req) {

    let routes = [
        {
            url: '/auth',
            module: 'auth',
            action: 'token',
            headers: {'Content-Type': 'application/json'},
            data: {
                test: 'some data'
            }
        }
    ];

    console.log('route match', req.url);

    let matched;

    if (req.url === '/') {
        matched = routes[0];
    }

    return matched;
}
