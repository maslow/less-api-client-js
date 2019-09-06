
### 介绍

Javascript client sdk of [`less-api`](https://github.com/Maslow/less-api).

### 安装

```sh
    npm install less-api-client
```

### 客户端使用示例

```js
const cloud = require('less-api-client').init({
    url: 'http://localhost:8080/entry',
    getAccessToken: () => localStorage.getItem('access_token')
})

const db = cloud.database()

// query documents
const cates = await db.collection('categories').get()

// query a document
const cate = await db.collection('categories').doc('the-doc-id').get()

// query with options
const articles = await db.collection('articles')
    .where({})
    .orderBy({createdAt: 'asc'})
    .offset(0)
    .limit(20)
    .get()

// count documents
const total = await db.collection('articles').where({createdBy: 'the-user-id'}).count()

// update document
const updated = await db.collection('articles').doc('the-doc-id').update({
    data: {
        title: 'new-title'
    }
})

// add a document
const created = await db.collection('articles').add({
  data: {
    title: "less api database",
    content: 'less api more life',
    createdAt: new Date("2019-09-01")
  }
})

// delete a document
const removed = await db.collection('articles').doc('the-doc-id').remove()
```

客户端数据操作采取了「微信云开发」的接口设计。

@see 微信云开发接口文档： https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-client-api/database/
