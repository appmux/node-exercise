'use strict';

import http from 'http';

export function configure(config) {
    console.log('configure', config);

    this.getConfig = () => config;
    this.run = run;

    return this;
}

function run(file) {
    const config = this.getConfig();
    
    http.createServer((req, res) => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end('{"message": "API"}');
    }).listen(config.port, config.address);

    console.log('Server running at http://' + config.address + ':' + config.port + '/');
}

function readJsonFile(file) {
    var fs = require('fs');
    var json = JSON.parse(fs.readFileSync(file, 'utf8'));

    return json;
}
