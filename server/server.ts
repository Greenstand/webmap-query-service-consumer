import { config as dotEnvConfig } from 'dotenv'
dotEnvConfig()
// set up log level
import './setup'

import registerEventHandlers from './services/event-handlers'

registerEventHandlers()
