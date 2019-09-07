const request = require('superagent')

class Request {
  constructor (config) {
    this.config = config
  }

  async send (action, data) {
    const params = Object.assign({}, data, {
      action
    })

    const slowQueryWarning = setTimeout(() => {
      console.warn(
        'Database operation is longer than 3s. Please check query performance and your network environment.'
      )
    }, 3000)

    const token = this.config.getAccessToken()
    try {
      const res = await request
        .post(this.config.entryUrl)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .timeout(this.config.timeout)
        .send(params)

      return res.body
    } finally {
      clearTimeout(slowQueryWarning)
    }
  }
}

module.exports = Request
