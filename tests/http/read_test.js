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
    it('read empty should be ok', async () => {
        const cloud = client.init(config)

        const res = await cloud.database().collection('categories').get()
        console.log(res.data.length)
        assert.ok(res.data instanceof Array)
    })
})