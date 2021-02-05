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

// 此行是为了运行测试用例时， 报 window undefined 使用；
// 如果浏览器环境因此报错， 需要注释掉本行；
var window: any

if (window) {
  window['LessApiClient'] = {
    init,
    Cloud,
    Db,
    EnvironmentType
  }
}