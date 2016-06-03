'use strict';

// import './components/app';
// import app from './components/app';
import * as app from './components/app';

const config = {config: 'someConf'};

console.log('app', app);
app.configure(config).run();
