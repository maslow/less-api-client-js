import { Cloud, Config, Db, EnvironmentType } from './cloud'

function init(config: Config): Cloud {
  return new Cloud(config)
}

export {
  init,
  Cloud,
  Db,
  EnvironmentType
}