import request from 'axios'
import { Config } from './cloud'

export class Request {
  private config: Config
  constructor (config: Config) {
    this.config = config
  }

  async send (action: string, data: object) {
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
        .post(this.config.entryUrl, params, {
          headers:{
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: this.config.timeout
        })

      return res.data
    } finally {
      clearTimeout(slowQueryWarning)
    }
  }
}