var setting = require('./setting');

print = function (res, code, msg, data) {
  msg = typeof msg == 'undefined' ? setting.output[code] : msg
  data = typeof data == 'undefined' ? [] : data
  msg = typeof msg == 'undefined' ? '异常操作' : msg
  res.json({'code': code, 'msg': msg, 'data' : data, 'ts': Date.now()});
  // res.end();
}

module.exports.print = print

module.exports.succ = function (res, msg, data) {
  code = 0
  print(res, code, msg, data)
}

module.exports.fail = print;

module.exports.table = function (res, code, data, total) {
  msg = typeof msg == 'undefined' ? setting.output[code] : msg
  data = typeof data == 'undefined' ? [] : data
  res.json({'code': code, 'data' : data, 'total': total,'ts': Date.now()});
  // res.end();
};

module.exports.isLogin = function (req) {
  if (typeof req.session._id == 'undefined') {
    return false
  }
  return true
}


module.exports.getFilter = function (req) {
  var rs = req.query
  delete rs['t']
  return rs
}


module.exports.todayStart = function () {
  var a = new Date()
  return (new Date(a.getFullYear(),a.getMonth(),a.getDate(),0,0,0)).getTime()
}


module.exports.todayEnd = function () {
  var a = new Date()
  return (new Date(a.getFullYear(),a.getMonth(),a.getDate(),0,0,0)).getTime() + 86400 * 1000 -1
}

module.exports.mouthStart = function () {
  var a = new Date()
  return (new Date(a.getFullYear(),a.getMonth(),1,0,0,0)).getTime()
}


module.exports.trim = function(str){
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
