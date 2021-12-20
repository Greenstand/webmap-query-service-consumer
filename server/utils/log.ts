import log from 'loglevel'

export function setupLoglevel() {
  if (process.env.NODE_LOG_LEVEL) {
    log.setDefaultLevel(process.env.NODE_LOG_LEVEL as log.LogLevelDesc)
  } else {
    log.setDefaultLevel('info')
  }
}
