import request from 'axios'
import { Config, EnvironmentType } from './cloud'

interface GlobalObjectType {
  request: any
}
declare const wx: GlobalObjectType
declare const uni: GlobalObjectType

export class Request {
  private config: Config
  constructor(config: Config) {
    this.config = config
  }

  async send(action: string, data: object) {
    const params = Object.assign({}, data, {
      action
    })

    const slowQueryWarning = setTimeout(() => {
      console.warn(
        'Database operation is longer than 3s. Please check query performance and your network environment.'
      )
    }, 3000)

    try {
      const res = await this.request(params)
      return res
    } finally {
      clearTimeout(slowQueryWarning)
    }
  }

  async request(data: any) {
    switch (this.config.environment) {
      case EnvironmentType.WX_MP:
        return await this.request_wxmp(data)
      case EnvironmentType.UNI_APP:
        return await this.request_uniapp(data)
      default:
        return await this.request_h5(data)
    }
  }

  async request_h5(data: any) {
    const token = this.config.getAccessToken()
    const headers = this.getHeaders(token)

    const res = await request
      .post(this.config.entryUrl, data, {
        headers,
        timeout: this.config.timeout,
      })

    return res.data
  }

  async request_wxmp(data: any) {
    const token = this.config.getAccessToken()
    const header = this.getHeaders(token)

    const options = {
      url: this.config.entryUrl,
      header,
      method: 'POST',
      data,
      dataType: 'json'
    }

    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        success(res) {
          resolve(res.data)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  }

  async request_uniapp(data: any) {
    const token = this.config.getAccessToken()
    const header = this.getHeaders(token)
    const options = {
      url: this.config.entryUrl,
      header,
      method: 'POST',
      data,
      dataType: 'json'
    }

    const [err, res] = await uni.request(options)
    if (err) {
      return {
        code: 1,
        data: err
      }
    }
    return res.data
  }

  private getHeaders(token) {
    const header = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
    const optionHeader = this.config?.requestOptions?.headers || {}
    return Object.assign(header, optionHeader)
  }
}