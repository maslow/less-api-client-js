const assert = require('assert')
const client = require('../../dist/commonjs/index')

function getAccessToken(){
  return 'test-token-xxx'
}

const config = {
  entryUrl: 'http://localhost:8080/entry',
  getAccessToken
}

describe('Database', function () {
  const cloud = client.init(config)

  let result = null
  before(async () => {
    result = await cloud.database()
      .collection('categories')
      .add({
        title: 'title-update-666',
        content: 'content-update-666',
        age: 0
      })

    assert.ok(result.id)
  })

  it('update one should be ok', async () => {
        
    const updated = await cloud.database()
      .collection('categories')
      .doc(result.id)
      .update({
        title: 'updated-title'
      })
       
    const { data } = await cloud.database()
      .collection('categories')
      .doc(result.id)
      .get()

    assert.equal(data[0]._id, result.id)
    assert.equal(data[0].title, 'updated-title')
  })

  it('update with $operator should be ok', async () => {
    const db = cloud.database()
    const _ = db.command
    
    const updated = await db.collection('categories')
      .doc(result.id)
      .update({
        title: 'updated-title',
        age: _.inc(1),
        content: _.remove()
      })
       
    const { data } = await cloud.database()
      .collection('categories')
      .doc(result.id)
      .get()


    assert.equal(data[0]._id, result.id)
    assert.equal(data[0].title, 'updated-title')
    assert.equal(data[0].age, 1)
    assert.equal(data[0].content, undefined)
  })
})