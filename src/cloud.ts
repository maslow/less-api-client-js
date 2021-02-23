
import { Db } from './database'
import { Request } from './request'

export enum EnvironmentType {
  H5 = 'h5',
  WX_MP = 'wxmp',
  UNI_APP = 'uniapp'
}

interface RequestOptions {
  headers?: Object,
  timeout?: number
}

interface Config {
  entryUrl: string,
  getAccessToken?: Function,
  timeout?: number,
  environment?: EnvironmentType,
  requestOptions?: RequestOptions
}

class Cloud {
  private config: Config
  constructor(config: Config) {
    const warningFunc = () => {
      console.warn('WARNING: no getAccessToken set for less-api request')
      return ""
    }

    const timeout = config?.timeout || config?.requestOptions?.timeout || 15000

    this.config = {
      entryUrl: config.entryUrl,
      getAccessToken: config?.getAccessToken || warningFunc,
      timeout,
      environment: config?.environment || EnvironmentType.H5,
      requestOptions: config?.requestOptions || {}
    }
  }

  database() {
    Db.reqClass = Request
    Db.getAccessToken = this.config.getAccessToken

    return new Db({ ...this.config })
  }
}

export {
  Cloud,
  Config,
  Db
}
