
import { Db } from './database'
import { Request } from './request'

export enum EnvironmentType{
  H5 = 'h5',
  WX_MP = 'wxmp',
  UNI_APP = 'uniapp'
}
interface Config {
    entryUrl: string,
    getAccessToken: Function,
    timeout?: number,
    environment?: EnvironmentType
}

class Cloud {
    private config: Config
    constructor(config: Config) {
      this.config = {
        entryUrl: config.entryUrl,
        getAccessToken: config.getAccessToken,
        timeout: config.timeout || 15000,
        environment: config.environment || EnvironmentType.H5
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
