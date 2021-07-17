

export interface RequestInterface {
  send(action: string, data: object): Promise<{ code: number, data: any, error: string }>
  request(url: string, data: any, options?: any): Promise<any>
  upload(option: UploadFileOption): Promise<any>
}


export enum EnvironmentType {
  H5 = 'h5',
  WX_MP = 'wxmp',
  UNI_APP = 'uniapp'
}

type GetAccessTokenFuncType = () => string


export interface CloudOptions {
  /**
   * less-framework 服务的地址，如： "http://localhost:8080"
   * @tip 后面不要以 `/` 结尾
   * 
   * 若后端不使用 less-framework 服务，而是自行集成使用 less-api，则无需设置此项，将 less-api 入口地址写入 `entryUrl` 即可
   */
  baseUrl?: string

  /**
   * less-api 数据操作请求的入口地址：
   * 1. 若不提供 `baseUrl` 则 `entryUrl` 应该为绝对地址，如：`http://localhost:8080/entry`
   * 2. 若提供 `baseUrl` 则 `entryUrl` 可为相对地址， 如： `/app-entry`，`/admin-entry`
   */
  entryUrl?: string,

  /**
   * 获取访问令牌的函数
   */
  getAccessToken?: GetAccessTokenFuncType,

  /**
   * 请求头
   */
  headers?: Object
  /**
   * 请求超时时间
   */
  timeout?: number
  /**
   * 执行环境，默认为浏览器和 Node.js 环境
   */
  environment?: EnvironmentType

  /**
   * 用户自定义请求类，默认此项为空，实际请求类由 `environment` 决定。
   * 如果使用了自定义请求类，则会忽略 `environment` 的值；
   * 自定义请求类需要 实现 `RequestInterface` 接口。
   * 
   * ```js
   * {
   *  requestClass: (options) => new MyRequest(options)
   * }
   * ```
   */
  requestClass?: any

  /**
   * Mongodb 主键为 '_id', 使用 MySQL 时可将此键设为 id
   */
  primaryKey?: string
}



export interface UploadFileOption {
  /**
   * 开发者服务器 url
   */
  url: string;
  /**
   * 文件类型，image/video/audio，仅支付宝小程序，且必填。
   * - image: 图像
   * - video: 视频
   * - audio: 音频
   */
  fileType?: 'image' | 'video' | 'audio';
  /**
   * 要上传的文件对象
   */
  file?: File;
  /**
   * 要上传文件资源的路径
   */
  filePath?: string;
  /**
   * 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
   */
  name?: string;
  /**
   * 需要上传的文件列表。
   */
  files?: UploadFile[];
  /**
   * HTTP 请求 Header, header 中不能设置 Referer
   */
  header?: any;
  /**
   * HTTP 请求中其他额外的 form data
   */
  formData?: any;
  /**
   * 超时时间，单位 ms
   */
  timeout?: number;
}

export interface UploadFile {
  /**
   * multipart 提交时，表单的项目名，默认为 file，如果 name 不填或填的值相同，可能导致服务端读取文件时只能读取到一个文件。
   */
  name?: string;
  /**
   * 要上传的文件对象
   */
  file?: File;
  /**
   * 要上传文件资源的路径
   */
  uri?: string;
}

