// 处理业务逻辑(读取json文件数据传给前端)(第三中间件)

const path = require('path')
const fileUtils = require('../utils/file_utils') // 读取文件的工具方法

module.exports = async (ctx, next) => {
  // 请求url
  const url = ctx.request.url // 端口之后的那一段路径 eg. /api/seller => 要找到 ../data/seller.json
  // 处理url
  let filePath = url.replace('/api', '') // eg. /seller
  filePath = '../data' + filePath + '.json' // eg. ../data/seller.json
  filePath = path.join(__dirname, filePath)

  // 读取数据
  try {
    const ret = await fileUtils.getFileJsonData(filePath) // 获取Promise中的数据\
    ctx.response.body = ret
  } catch (error) {
    const errMsg = {
      message: '读取文件内容失败, 文件资源不存在',
      status: 404,
    }
    ctx.response.body = JSON.stringify(errMsg)
  }

  // 执行内层中间件
  await next()
}
