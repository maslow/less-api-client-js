import { Cloud, Config, Db, EnvironmentType, RequestInterface } from './cloud'
import { Request } from './request'

function init(config: Config): Cloud {
  return new Cloud(config)
}

export {
  init,
  Cloud,
  Db,
  EnvironmentType,
  RequestInterface,
  Request
}