'use strict';

import http from 'http';
// import configure from './configure';

// console.log('configure', configure)
// export { configure };

export function configure(config) {
    console.log('configure', config);

    this.run = run;

    return this;
}

function run(file) {
    http.createServer((req, res) => {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World\n');
    }).listen(1337, '127.0.0.1');

    console.log('Server running at http://127.0.0.1:1337/');
}

function readJsonFile(file) {
    var fs = require('fs');
    var json = JSON.parse(fs.readFileSync(file, 'utf8'));

    return json;
}
