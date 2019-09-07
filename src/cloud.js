
const Db = require('@cloudbase/database').Db
const Request = require('./request')

class Cloud {
    constructor(config) {
        this.config = {
            entryUrl: config.entryUrl,
            getAccessToken: config.getAccessToken,
            timeout: config.timeout || 15000
        }
    }
  
    database(dbConfig) {
        Db.reqClass = Request
        Db.getAccessToken = this.config.getAccessToken
    
        return new Db({ ...this.config, ...dbConfig })
    }
}

module.exports = Cloud
