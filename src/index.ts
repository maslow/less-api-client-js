import { Cloud, Config } from './cloud'

function init(config: Config): Cloud {
  return new Cloud(config)
}

export {
  init,
  Cloud
}