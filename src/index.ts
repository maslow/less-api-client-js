import { Cloud, Config, Db, EnvironmentType, RequestInterface } from './cloud'

function init(config: Config): Cloud {
  return new Cloud(config)
}

export {
  init,
  Cloud,
  Db,
  EnvironmentType,
  RequestInterface
}