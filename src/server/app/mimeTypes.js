'use strict';

import fs from 'fs';

let types;

export function getTypes() {
    if (!types) {
        let path = __dirname + '/conf/mime.types',
            data = fs.readFileSync(path, 'utf8'),
            lines = data.split('\n');

        types = lines
            .filter(v => v.indexOf('#') < 0 && v.length > 0)
            .reduce((types, v) => {
                let p = v.indexOf('\t');
                let type = v.substring(0, p).trim();

                v.substring(p).trim().split(' ').map(ext => types[ext] = type);

                return types;
            }, {});
    }

    return types;
}
