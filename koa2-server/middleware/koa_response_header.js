// 设置响应头中间件(第二中间件)
module.exports = async (ctx, next) => {
  const contentType = 'application/json; chartset=utf-8'
  // 设置响应头
  ctx.set('Content-Type', contentType)
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE')

  // 执行内层中间件
  await next()
}
