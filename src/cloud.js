
const Db = require('@cloudbase/database').Db
const Request = require('./request')

function Cloud(config) {
  this.config = config ? config : this.config
}

Cloud.prototype.init = function({ entryUrl, timeout, getAccessToken }) {
  this.config = {
    entryUrl,
    getAccessToken,
    timeout: timeout || 15000
  }

  return new Cloud(this.config)
}

Cloud.prototype.database = function(dbConfig) {
  Db.reqClass = Request
  Db.getAccessToken = this.config.getAccessToken

  return new Db({ ...this.config, ...dbConfig })
}

module.exports = Cloud
