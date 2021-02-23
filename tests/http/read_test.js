const assert = require('assert')
const client = require('../../dist/commonjs/index')

function getAccessToken(){
  return 'test-token-xxx'
}

const config = {
  entryUrl: 'http://localhost:8080/entry',
  getAccessToken,
}

describe('Database', function () {
  it('read empty should be ok', async () => {
    const cloud = client.init(config)

    const res = await cloud.database().collection('categories').get()

    assert.ok(res.data instanceof Array)
  })


  // only for sql
  // it('read with $like should be ok', async () => {
  //   const cloud = client.init(config)
  //   const db = cloud.database()
  //   const _ = db.command
  //   const res = await db.collection('categories')
  //     .where({ f1: _.like('ok%')}).get()

  //   assert.ok(res.data instanceof Array)
  // })
})

