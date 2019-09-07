const assert = require('assert')
const client = require('../../src/index')

function getAccessToken(){
    return 'test-token-xxx'
}

const config = {
    entryUrl: 'http://localhost:8080/entry',
    getAccessToken
}

describe('Database', function () {
    it('add one should be ok', async () => {
        const cloud = client.init(config)

        const result = await cloud.database()
            .collection('categories')
            .add({ title: 'title-add', content: 'content-add'})

        assert.ok(result.id)
    })
})