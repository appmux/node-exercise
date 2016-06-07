'use strict';

import { _extend as extend } from 'util';

let routes = [];

export function configure(config) {
    if (Array.isArray(config)) {
        config.map(route => {
            route._urlParams = route.url.match(/:[^\/]+/g) || [];
            route._urlRegex = new RegExp(route.url
                .replace(/:[^\/]+/g, '(.*?)')
                .replace(/\//g, '\\/'));
        });

        routes = routes.concat(config);
    }
}

export function match(req) {
    let params = {},
        matched = routes.find((route) => {
            if (req.url === route.url) {
                return true;
            }

            let reMatch = req.url.match(route._urlRegex);

            if (reMatch) {
                params = route._urlParams.reduce((params, param, i) => {
                    params[param.substring(1)] = reMatch[i + 1];
                    return params;
                }, {});

                return true;
            }
        });

    if (matched) {
        matched = extend({}, matched);
        matched.params = params;
    }

    return matched;
}
