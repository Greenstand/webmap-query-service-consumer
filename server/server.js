require('dotenv').config();
// set up log level
require('loglevel');

require('./setup');

const registerEventHandlers = require('./services/event-handlers.js');

registerEventHandlers();
