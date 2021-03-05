import { createPromiseCallback } from './lib/util'
import { OrderByDirection, QueryType } from './constant'
import { Db } from './index'
import { Validate } from './validate'
import { Util } from './util'
import { QuerySerializer } from './serializer/query'
import { UpdateSerializer } from './serializer/update'
import { ErrorCode } from './constant'

interface GetRes {
  data: any[]
  requestId: string
  total?: number
  limit?: number
  offset?: number,
  ok: boolean
}

interface QueryOrder {
  field?: string
  direction?: 'asc' | 'desc'
}

interface QueryOption {
  // 查询数量
  limit?: number
  // 偏移量
  offset?: number
  // 指定显示或者不显示哪些字段
  projection?: Object
}

// left, right, inner, full
enum JoinType {
  INNER = 'inner',
  LEFT = 'left',
  RIGHT = 'right',
  FULL = 'full'
}

interface JoinParam {
  collection: string,
  type: JoinType,
  leftKey: string,
  rightKey: string
}


/**
 * 查询模块
 *
 * @author haroldhu
 */
export class Query {
  /**
   * Db 的引用
   *
   * @internal
   */
  protected _db: Db

  /**
   * Collection name
   *
   * @internal
   */
  protected _coll: string

  /**
   * 过滤条件
   *
   * @internal
   */
  private _fieldFilters: Object

  /**
   * 排序条件
   *
   * @internal
   */
  private _fieldOrders: QueryOrder[]

  /**
   * 查询条件
   *
   * @internal
   */
  private _queryOptions: QueryOption

  /**
   * 联表条件(join)
   * 
   * @internal
   */
  private _joins: JoinParam[]

  /**
   * 原始过滤参数
   */
  // private _rawWhereParams: Object

  /**
   * 请求实例
   *
   * @internal
   */
  private _request: any

  /**
   * 初始化
   *
   * @internal
   *
   * @param db            - 数据库的引用
   * @param coll          - 集合名称
   * @param fieldFilters  - 过滤条件
   * @param fieldOrders   - 排序条件
   * @param queryOptions  - 查询条件
   */
  public constructor(
    db: Db,
    coll: string,
    fieldFilters?: Object,
    fieldOrders?: QueryOrder[],
    queryOptions?: QueryOption,
    joins?: JoinParam[]
    // rawWhereParams?: Object
  ) {
    this._db = db
    this._coll = coll
    this._fieldFilters = fieldFilters
    this._fieldOrders = fieldOrders || []
    this._queryOptions = queryOptions || {}
    this._joins = joins || []
    /* eslint-disable new-cap */
    this._request = new Db.reqClass(this._db.config)
  }

  /**
   * 查询条件
   *
   * @param query
   */
  public where(query: object) {
    // query校验 1. 必填对象类型  2. value 不可均为undefiend
    if (Object.prototype.toString.call(query).slice(8, -1) !== 'Object') {
      throw Error(ErrorCode.QueryParamTypeError)
    }

    const keys = Object.keys(query)

    const checkFlag = keys.some(item => {
      return query[item] !== undefined
    })

    if (keys.length && !checkFlag) {
      throw Error(ErrorCode.QueryParamValueError)
    }

    return new Query(
      this._db,
      this._coll,
      QuerySerializer.encode(query),
      this._fieldOrders,
      this._queryOptions,
      this._joins
    )
  }

  /**
   * 设置排序方式
   *
   * @param fieldPath     - 字段路径
   * @param directionStr  - 排序方式
   */
  public orderBy(fieldPath: string, directionStr: OrderByDirection): Query {
    Validate.isFieldPath(fieldPath)
    Validate.isFieldOrder(directionStr)

    const newOrder: QueryOrder = {
      field: fieldPath,
      direction: directionStr
    }
    const combinedOrders = this._fieldOrders.concat(newOrder)

    return new Query(this._db, this._coll, this._fieldFilters, combinedOrders, this._queryOptions, this._joins)
  }

  /**
   * 添加联表条件
   * @param type 联接类型, 以下值之一 "left", "inner", "right", "full"
   * @param collection 联接的子表名
   * @param rightKey 子表的联接键名
   * @param leftKey 主表的联接键名
   */
  public join(collection: string, rightKey: string, leftKey: string, type: JoinType = JoinType.INNER): Query {
    const newJoin: JoinParam = {
      type,
      collection,
      rightKey,
      leftKey
    }

    const combinedJoins = this._joins.concat(newJoin)
    return new Query(this._db, this._coll, this._fieldFilters, this._fieldOrders, this._queryOptions, combinedJoins)
  }

  /**
   * 添加 left join 联表条件
   * @param collection 联接的子表名
   * @param rightKey 子表的联接键名
   * @param leftKey 主表的联接键名
   */
  public leftJoin(collection: string, rightKey: string, leftKey: string) {
    return this.join(collection, rightKey, leftKey, JoinType.LEFT)
  }

  /**
   * 添加 right join 联表条件
   * @param collection 联接的子表名
   * @param rightKey 子表的联接键名
   * @param leftKey 主表的联接键名
   */
  public rightJoin(collection: string, rightKey: string, leftKey: string) {
    return this.join(collection, rightKey, leftKey, JoinType.RIGHT)
  }

  /**
   * 添加 full join 联表条件
   * @param collection 联接的子表名
   * @param rightKey 子表的联接键名
   * @param leftKey 主表的联接键名
   */
  public fullJoin(collection: string, rightKey: string, leftKey: string) {
    return this.join(collection, rightKey, leftKey, JoinType.FULL)
  }

  /**
   * 添加 inner join 联表条件
   * @param collection 联接的子表名
   * @param rightKey 子表的联接键名
   * @param leftKey 主表的联接键名
   */
  public innerJoin(collection: string, rightKey: string, leftKey: string) {
    return this.join(collection, rightKey, leftKey, JoinType.INNER)
  }

  /**
   * 指定要返回的字段
   *
   * @param projection string[] | {[fieldName]: true | false}
   */
  public field(projection: string[] | any): Query {
    if (projection instanceof Array) {
      let result = {}
      for (let k of projection) {
        result[k] = 1
      }
      projection = result
    } else {
      for (let k in projection) {
        if (projection[k]) {
          if (typeof projection[k] !== 'object') {
            projection[k] = 1
          }
        } else {
          projection[k] = 0
        }
      }
    }


    let option = { ...this._queryOptions }
    option.projection = projection

    return new Query(this._db, this._coll, this._fieldFilters, this._fieldOrders, option, this._joins)
  }

  /**
   * 设置查询条数
   *
   * @param limit - 限制条数
   */
  public limit(limit: number): Query {
    Validate.isInteger('limit', limit)

    let option = { ...this._queryOptions }
    option.limit = limit

    return new Query(this._db, this._coll, this._fieldFilters, this._fieldOrders, option, this._joins)
  }

  /**
   * 设置偏移量
   *
   * @param offset - 偏移量
   */
  public skip(offset: number): Query {
    Validate.isInteger('offset', offset)

    let option = { ...this._queryOptions }
    option.offset = offset

    return new Query(this._db, this._coll, this._fieldFilters, this._fieldOrders, option, this._joins)
  }

  /**
   * 发起请求获取文档列表
   *
   * - 默认获取集合下全部文档数据
   * - 可以把通过 `orderBy`、`where`、`skip`、`limit`设置的数据添加请求参数上
   */
  public get(callback?: any): Promise<GetRes | { code: string | number, error: string }> {
    /* eslint-disable no-param-reassign */
    callback = callback || createPromiseCallback()

    let newOder = []
    if (this._fieldOrders) {
      this._fieldOrders.forEach(order => {
        newOder.push(order)
      })
    }
    interface Param {
      collectionName: string
      query?: Object
      queryType: QueryType
      order?: string[]
      offset?: number
      limit?: number
      projection?: Object,
      joins?: JoinParam[]
    }
    let param: Param = {
      collectionName: this._coll,
      queryType: QueryType.WHERE
    }
    if (this._fieldFilters) {
      param.query = this._fieldFilters
    }
    if (newOder.length > 0) {
      param.order = newOder
    }
    if (this._queryOptions.offset) {
      param.offset = this._queryOptions.offset
    }
    if (this._queryOptions.limit) {
      param.limit = this._queryOptions.limit < 1000 ? this._queryOptions.limit : 1000
    } else {
      param.limit = 100
    }
    if (this._queryOptions.projection) {
      param.projection = this._queryOptions.projection
    }
    if (this._joins.length) {
      param.joins = this._joins
    }
    this._request
      .send('database.queryDocument', param)
      .then(res => {
        if (res.code) {
          callback(0, res)
        } else {
          const documents = Util.formatResDocumentData(res.data.list)
          const result: any = {
            data: documents,
            requestId: res.requestId,
            ok: true
          }
          if (res.TotalCount) result.total = res.TotalCount
          if (res.Limit) result.limit = res.Limit
          if (res.Offset) result.offset = res.Offset
          callback(0, result)
        }
      })
      .catch(err => {
        callback(err)
      })

    return callback.promise
  }

  /**
   * 获取总数
   */
  public count(callback?: any): Promise<{ total: number, requestId: string, ok: boolean } | { code: string | number, error: string }> {
    callback = callback || createPromiseCallback()

    interface Param {
      collectionName: string
      query?: Object
      queryType: QueryType
    }
    let param: Param = {
      collectionName: this._coll,
      queryType: QueryType.WHERE
    }
    if (this._fieldFilters) {
      param.query = this._fieldFilters
    }
    this._request.send('database.countDocument', param).then(res => {
      if (res.code) {
        callback(0, res)
      } else {
        callback(0, {
          requestId: res.requestId,
          total: res.data.total,
          ok: true
        })
      }
    })

    return callback.promise
  }

  /**
   * 发起请求批量更新文档
   *
   * @param data 数据
   */
  public update(data: Object, options?: { multi: boolean, merge: boolean, upsert: boolean }, callback?: any): Promise<{ updated: number, matched: number, upsertedId: number, requestId: string, ok: boolean } | { code: string, error: string }> {
    callback = callback || createPromiseCallback()
    if (!options) {
      options = {
        multi: false,
        merge: true,
        upsert: false
      }
    } else {
      options.multi = options.multi ?? false
      options.merge = options.merge ?? true
      options.upsert = options.upsert ?? false
    }

    if (!data || typeof data !== 'object') {
      return Promise.resolve({
        code: 'INVALID_PARAM',
        error: '参数必需是非空对象'
      })
    }

    if (data.hasOwnProperty('_id')) {
      return Promise.resolve({
        code: 'INVALID_PARAM',
        error: '不能更新_id的值'
      })
    }

    let param = {
      collectionName: this._coll,
      query: this._fieldFilters,
      queryType: QueryType.WHERE,
      // query: QuerySerializer.encode(this._fieldFilters),
      multi: options.multi,
      merge: options.merge,
      upsert: options.upsert,
      data: UpdateSerializer.encode(data)
      // data: Util.encodeDocumentDataForReq(data, true)
      // data: this.convertParams(data)
    }

    this._request.send('database.updateDocument', param).then(res => {
      if (res.code) {
        callback(0, res)
      } else {
        callback(0, {
          requestId: res.requestId,
          updated: res.data.updated,
          upsertId: res.data.upsert_id,
          ok: true
        })
      }
    })

    return callback.promise
  }

  /**
   * 条件删除文档
   */
  public remove(options?: { multi: boolean }, callback?: any): Promise<{ deleted: number, requestId: string, ok: boolean } | { code: string | number, error: string }> {
    callback = callback || createPromiseCallback()

    if (!options) {
      options = { multi: false }
    } else {
      options.multi = options.multi ?? false
    }

    if (Object.keys(this._queryOptions).length > 0) {
      console.warn('`offset`, `limit` and `projection` are not supported in remove() operation')
    }
    if (this._fieldOrders.length > 0) {
      console.warn('`orderBy` is not supported in remove() operation')
    }
    const param = {
      collectionName: this._coll,
      query: QuerySerializer.encode(this._fieldFilters),
      queryType: QueryType.WHERE,
      multi: options.multi
    }
    this._request.send('database.deleteDocument', param).then(res => {
      if (res.code) {
        callback(0, res)
      } else {
        callback(0, {
          requestId: res.requestId,
          deleted: res.data.deleted,
          ok: true
        })
      }
    })

    return callback.promise
  }
}
