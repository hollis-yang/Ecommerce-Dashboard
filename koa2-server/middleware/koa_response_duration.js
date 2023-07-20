// 计算服务器消耗时长中间件(第一中间件)
module.exports = async (ctx, next) => {
  // 记录开始时间
  const start = Date.now()
  // 执行内层中间件
  await next()
  // 记录结束时间
  const end = Date.now()
  const duration = end - start
  // 设置响应头
  ctx.set('X-Response-Time', duration + 'ms')
}