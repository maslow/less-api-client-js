import { Cloud, Config, Db } from './cloud'

function init(config: Config): Cloud {
  return new Cloud(config)
}

export {
  init,
  Cloud,
  Db
}