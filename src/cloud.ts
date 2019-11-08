
import { Db } from '@cloudbase/database'
import { Request } from './request'

interface Config {
    entryUrl: string,
    getAccessToken: Function,
    timeout?: number
}

class Cloud {
    private config: Config
    constructor(config: Config) {
      this.config = {
        entryUrl: config.entryUrl,
        getAccessToken: config.getAccessToken,
        timeout: config.timeout || 15000
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
  Config
}
