// 服务器入口文件

const Koa = require('koa')
const app = new Koa()

// koa_response_duration.js
const respDurationMiddleware = require('./middleware/koa_response_duration.js')
app.use(respDurationMiddleware)

// koa_response_data.js
const respHeaderMiddleware = require('./middleware/koa_response_header.js')
app.use(respHeaderMiddleware)

// koa_response_header.js
const respDataMiddleware = require('./middleware/koa_response_data.js')
app.use(respDataMiddleware)

app.listen(8888)