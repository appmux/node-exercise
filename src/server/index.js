'use strict';

import { config } from './config';
import * as app from './app';

app.configure(config).run();
