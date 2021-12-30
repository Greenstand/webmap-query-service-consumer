import log from 'loglevel'

export function setupLoglevel() {
  log.setDefaultLevel(
    (process.env.NODE_LOG_LEVEL as log.LogLevelDesc) || 'info',
  )
}
