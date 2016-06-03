'use strict';

import { config } from './config';
import * as app from './components/app';

app.configure(config).run();
