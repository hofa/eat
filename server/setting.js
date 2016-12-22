module.exports = {
    'title': '订餐',
    'mongodb': 'mongodb://192.168.64.2:27017/ubi_carte',
    'pagesize': 1000,
    'httpport': 3000,
    'udpport': 4000,
    'output': {
      0: '操作成功!',
      1: '未登录或登录过时!',
      10000: '账号或者密码不正确!',

      // 用户
      11001: '数据错误',
      11002: '账号已存在',
      11003: '数据不能为空',
      11004: '数据不能为空',
      11005: '密码长度不正确',
      11006: '用户账户格式不正确',
    }
}
