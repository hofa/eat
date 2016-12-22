var express = require('express')
var router = express.Router()
var util = require('util')
var setting = require('../setting')
let{User, Carte, Order} = require('../model')
let{print, succ, fail, isLogin, table, todayStart, todayEnd, mouthStart} =  require('../libs')
var mongoose = require('mongoose')
var then = require('thenjs')
var Q = require('q'); // https://github.com/bellbind/using-promise-q
var ObjectId = mongoose.Types.ObjectId
var moment = require('moment')
router.get('/panel', function(req, res) {
  panelOrder.init({req: req, res: res})
})

router.get('/', function(req, res) {
  var page = req.param("page", 1)
  var type = req.param("type", 'all')
  var size = size
  var filter = {}
  page = page < 1 ? 1 : page
  if (type == 'all') {
    filter = {userId: ObjectId(req.param('t'))}
  } else if (type == 'mouth') {
    filter = {userId: ObjectId(req.param('t')), created: {$gt: mouthStart()}}
  } else if (type == 'today') {
    filter = {userId: ObjectId(req.param('t')), created: {$gt: todayStart()}}
  } else if (type == 'person') {
    var d = req.param("date", '')
    var dt = new Date(d).getTime()
    var lt = dt + 86400 * 1000 - 1
    filter = {created: {$gt: dt, $lte: lt}}
    console.log('filter:', filter)
    size = 9999
    page = 1
  }
  var query = Order.find(filter)
  query.populate('userId')
  query.populate('carteId')
  query.populate('brandId')
  query.sort({created: -1})
  query.skip(size * (page - 1)).limit(size)
  query.exec(function (err, docs) {
    if (err) {
      fail(res, 199999)
    } else {
      Order.count(filter, function (err, count) {
        if (err) {
          fail(res, 299999)
        } else {
          // console.log(55)
          table(res, 0, docs, count)
        }
      })
    }
  })
})

router.post('/', function(req, res) {
  createOrder.init({req: req, res: res})
})

router.put('/', function(req, res) {
  var name = req.param("name", false)
  var notification = req.param("notification", false)
  req.assert('notification', '11003').notEmpty()
  req.assert('name', '11003').notEmpty()
  var errors = req.validationErrors()
  if (errors) {
    fail(res, errors[0]['msg'])
    return
  }
  var data = {}
  if (name) {
    data['name'] = req.body.name
  }

  if (notification) {
    data['notification'] = req.body.notification
  }

  User.update({_id: ObjectId(req.session._id)}, data, function(err, data) {
      if (err) {
        fail(res, 'fail')
      } else {
        succ(res)
      }
  })
})

router.get('/remove', function(req, res) {
  Order.remove({'userId': ObjectId(req.param('t')), 'created': {"$gt": todayStart(), "$lte": todayEnd()}}, function(err, data) {
      if (err) {
        fail(res, 99981,'删除失败')
      } else {
        succ(res, {'userId': ObjectId(req.param('t'))})
      }
  })
})

var createOrder = {

  init: function (arg) {
    var self = this
    Q.resolve(arg).
    then(self.check, function (err) {
      throw new Error("thrown error")
    }).
    then(self.checkName, function (err) {
      console.log('#checkName', err)
      throw new Error("thrown error")
    }).
    then(self.findCarte, function (err) {
      console.log('#findCarte', err)
      throw new Error("thrown error")
    }).
    then(self.findOrder, function (err) {
      throw new Error("thrown error")
    }).
    then(self.judgeMoney, function (err) {
      throw new Error("thrown error")
    }).
    then(self.save, function (err) {
      throw new Error("thrown error")
    }).
    fail(function (error) {
      // console.log(error)
      return error
    })
  },

  check: function (arg) {
    console.log('check')
    var deferred = Q.defer()
    var res = arg.res
    var req = arg.req
    req.assert('carteId', '11003').notEmpty()
    req.assert('count', '11003').notEmpty()
    var errors = req.validationErrors()
    if (errors) {
      fail(res, errors[0]['msg'])
      deferred.reject()
    }

    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var ct = hour * 3600 + minute * 60
    var st = 14 * 3600 + 0 * 60
    // var st = 0 * 3600 + 0 * 60
    var et = 17 * 3600 + 30 * 60
    var et = 20 * 3600 + 30 * 60
    if (ct > et || ct < st) {
      fail(res, 22222, '点餐: 16:00 ~ 17:30')
      deferred.reject()
    }
    deferred.resolve(arg)
    return deferred.promise
  },

  checkName: function (arg) {
    console.log('checkName')
    var deferred = Q.defer()
    var res = arg.res
    var req = arg.req

    var query = User.findOne({'_id': ObjectId(req.param('t'))})
    query.exec(function (err, docs) {
      // console.log('order-carte:', docs)
      if (err) {
        fail(res, 99990)
        deferred.reject()
      } else {

        // console.log('checkName', docs)
        if (docs instanceof Object && typeof docs['_id'] != 'undefined') {
          if ('name' in docs && docs.name.length > 0) {
            arg['user'] = docs
            deferred.resolve(arg)
          } else {
            // console.log('checkNameFalse')
            fail(res, 55555, '请填写你的真实名字再下单喔！')
            deferred.reject()
          }
        } else {
          fail(res, 99991)
          deferred.reject()
        }
      }
    })
    return deferred.promise
  },

  findCarte: function (arg) {
    console.log('findCarte')
    var deferred = Q.defer()
    var res = arg.res
    var req = arg.req

    var query = Carte.findOne({'_id': ObjectId(req.body.carteId)})
    query.exec(function (err, docs) {
      // console.log('order-carte:', docs)
      if (err) {
        fail(res, 99990)
        deferred.reject()
      } else {
        console.log('findCarte', docs, req.body.carteId)
        if (docs instanceof Object && typeof docs['_id'] != 'undefined') {
          arg['carte'] = docs
          deferred.resolve(arg)
        } else {
          fail(res, 99991)
          deferred.reject()
        }
      }
    })
    return deferred.promise
  },

  deleteOrder: function (arg) {
    console.log('deleteOrder')
    var deferred = Q.defer()
    var res = arg.res
    var req = arg.req
    var query = Order.remove({'userId': ObjectId(req.param('t')), 'created': {"$gt": todayStart(), "$lte": todayEnd()}})
    query.exec(function (err, docs) {
      if (err) {
        fail(res, 99992)
        deferred.reject()
      } else {
        // arg['orderData'] = docs
        deferred.resolve(arg)
      }
    })
    return deferred.promise
  },

  findOrder: function (arg) {
    console.log('findOrder')
    var deferred = Q.defer()
    var res = arg.res
    var req = arg.req
    var query = Order.find({'userId': ObjectId(req.param('t')), 'created': {"$gt": todayStart(), "$lte": todayEnd()}})
    query.exec(function (err, docs) {
      if (err) {
        fail(res, 99993, '查询失败')
        deferred.reject()
      } else {
        console.log('findOrder', {'userId': ObjectId(req.param('t')), 'created': {"$gt": todayStart(), "$lte": todayEnd()}})
        arg['orderData'] = docs
        deferred.resolve(arg)
      }
    })
    return deferred.promise
  },

  judgeMoney: function (arg) {
    console.log('judgeMoney')
    var deferred = Q.defer()
    var res = arg.res
    var req = arg.req
    var orderData = arg.orderData
    var money = 0
    var max = 20
    var k = []
    for (var i in orderData) {
      if (k.indexOf(orderData[i].brandId.toString()) == -1) {
        k.push(orderData[i].brandId.toString())
      }
      money += orderData[i].price * orderData[i].count
    }
    // console.log('judgeMoney#1', money)
    // if (arg.hasOwnProperty('carte') && arg['carte'].hasOwnProperty('price')) {
      money += arg['carte'].price * parseInt(req.body.count)
    // }
    // console.log('judgeMoney#2', money, arg['carte'].price)
    if (k.indexOf(arg['carte']['brandId'].toString()) == -1) {
      // console.log('judgeMoney# push')
      k.push(arg['carte']['brandId'].toString())
    }

    if (k.length > 1) {
      // console.log('judgeMoney#k', k, k.indexOf(arg['carte']['brandId']))
      fail(res, 99994, '只能选择一个品牌')
      deferred.reject()
    }

    if (money > max) {
      fail(res, 99994, '今日金额已满')
      deferred.reject()
    } else {
      deferred.resolve(arg)
    }
    return deferred.promise
  },

  save: function (arg) {
    console.log('save')
    var deferred = Q.defer()
    var res = arg.res
    var req = arg.req
    var carte = arg.carte
    var query = new Order({
      'price': req.body.price,
      'count': req.body.count,
      'price': carte['price'],
      'type' : carte['type'],
      'productName': carte['name'],
      'brandId': ObjectId(carte['brandId']),
      'carteId': ObjectId(carte['_id']),
      'userId': ObjectId(req.param('t'))
    })
    query.save(function(err, data) {
        if (err) {
          fail(res, 99995)
          deferred.reject()
        } else {
          succ(res)
          deferred.resolve(arg)
        }
    })
    return deferred.promise
  }
}

var panelOrder = {
  init: function (arg) {
    var self = this
    Q.resolve(arg).
    then(self.findDetail, function (err) {
      console.log('#findDetail', err)
      throw new Error("thrown error")
    }).
    then(self.findMouth, function (err) {
      console.log('#findMouth', err)
      throw new Error("thrown error")
    }).
    then(self.findTotal, function (err) {
      console.log('#findTotal', err)
      throw new Error("thrown error")
    }).
    fail(function (error) {
      // console.log(error)
      return error
    })
  },
  findDetail: function (arg) {
    console.log('findDetail')
    var deferred = Q.defer()
    var res = arg.res
    var req = arg.req

    var query = Order.find({'userId': ObjectId(req.param('t')), 'created': {"$gt": todayStart(), "$lte": todayEnd()}})
    query.exec(function (err, docs) {
      if (err) {
        fail(res, 199999, '找不到订单')
        deferred.reject()
      } else {
        // succ(
        // res, 0, {
        // today: "鸡肉狗肉", mouth: 0, total: 0, detail: docs,
        // 'filter': {
        // 'userId': ObjectId(req.param('t')),
        // 'created': {"$gt": todayStart(), "$lte": todayEnd()}}}
        // )
        arg['detail'] = docs
        deferred.resolve(arg)
      }
    })
    return deferred.promise
  },
  findMouth: function (arg) {
    console.log('findMouth')
    var deferred = Q.defer()
    var res = arg.res
    var req = arg.req
    // {'userId': ObjectId(req.param('t')), 'created': {"$gt": todayStart(), "$lte": todayEnd()}}
    var query = Order.aggregate(
      {$match:{userId: ObjectId(req.param('t')), created: {$gt: mouthStart()}}},
      {$group:{_id: "$userId", sum_value: {$sum: "$price"}}}
    )
    query.exec(function (err, docs) {
      console.log('aggregate:', docs)
      if (err) {
        fail(res, 299999, '找不到统计数据')
        deferred.reject()
      } else {
        arg['mouth'] = docs.length > 0 ? docs[0].sum_value : 0
        deferred.resolve(arg)
      }
    })
    return deferred.promise
  },
  findTotal: function (arg) {
    console.log('findTotal')
    var deferred = Q.defer()
    var res = arg.res
    var req = arg.req
    // {'userId': ObjectId(req.param('t')), 'created': {"$gt": todayStart(), "$lte": todayEnd()}}
    var query = Order.aggregate(
      {$match:{userId: ObjectId(req.param('t'))}},
      {$group:{_id: "$userId", sum_value: {$sum: "$price"}}}
    )
    query.exec(function (err, docs) {
      console.log('aggregate:', docs)
      if (err) {
        fail(res, 399999, '找不到统计数据')
        deferred.reject()
      } else {
        arg['total'] = docs.length > 0 ? docs[0].sum_value : 0
        succ(
        res, 0, {
        today: "", mouth: arg['mouth'], total: arg['total'], detail: arg['detail'],
        'filter': {
        'userId': ObjectId(req.param('t')),
        'created': {"$gt": todayStart(), "$lte": todayEnd()}}}
        )
        deferred.resolve(arg)
      }
    })
    return deferred.promise
  },
}

router.get('/export/day.csv', function(req, res) {
  var filter = {}
  var size = size
  var filter = {}
  var page = 1
  var d = req.param("date", '2016-12-22')
  var dt = new Date(d).getTime()
  var lt = dt + 86400 * 1000 - 1
  filter = {created: {$gt: dt, $lte: lt}}
  console.log('filter:', filter)
  size = 9999
  page = 1

  var query = Order.find(filter)
  query.populate('userId')
  query.populate('carteId')
  query.populate('brandId')
  query.sort({created: 1})
  query.skip(size * (page - 1)).limit(size)
  query.exec(function (err, docs) {
    if (err) {
      fail(res, 199999)
    } else {
      var temp = []
      var brands = []
      var count = 0
      for (var i in docs) {
        if (brands.indexOf(docs[i]['brandId']['name']) == -1) {
          brands.push(docs[i]['brandId']['name'])
        }
      }

      for (var b in brands) {
        var price = 0
        temp.push({name: d, productName: brands[b], price: ''})
        for (var i in docs) {
          if (brands[b] == docs[i]['brandId']['name']) {
            // console.log('carteId:', docs[i]['carteId']['price'])
            temp.push({name: docs[i]['userId']['name'], productName: docs[i]['carteId']['name'], price: docs[i]['carteId']['price'] * docs[i]['count'] +'元'})
            price += docs[i]['carteId']['price'] * docs[i]['count']
          }
        }
        temp.push({name: '', productName: '总计:', price: price + '元'})
      }

      // table(res, 0, temp, count)
      res.csv(temp)
    }
  })
  // res.csv([ { name: "中文", id: 1 }])
})

router.get('/export/month.csv', function(req, res) {
  var filter = {}
  var size = size
  var filter = {}
  var page = 1
  var d = req.param("date", '2016-12-01')
  var d = moment(d, 'YYYY-MM-DD'); //按照指定的年月字符串和格式解析出一个moment的日期对象
  var firstDate = d.startOf("month").format('X'); //通过startOf函数指定取月份的开始即第一天
  var lastDate = d.endOf("month").format('X'); //通过startOf函数指定取月份的末尾即最后一天

  // return table(res, 0, {'firstDate': firstDate * 1000, 'lastDate': lastDate * 1000}, 0)
  // var ds = new Date(d)
  var dt = firstDate * 1000
  var lt = lastDate * 1000
  filter = {created: {$gt: dt, $lte: lt}}
  console.log('filter:', filter)
  size = 99999
  page = 1

  var query = Order.find(filter)
  query.populate('userId')
  query.populate('carteId')
  query.populate('brandId')
  query.sort({created: 1})
  query.skip(size * (page - 1)).limit(size)
  query.exec(function (err, docs) {
    if (err) {
      fail(res, 199999)
    } else {
      var temp = []
      var brands = []
      var count = 0
      for (var i in docs) {
        if (brands.indexOf(docs[i]['brandId']['name']) == -1) {
          brands.push(docs[i]['brandId']['name'])
        }
      }

      for (var b in brands) {
        var price = 0
        temp.push({date: d.startOf("month").format('YYYY-MM'), name: '', productName: brands[b], price: ''})
        for (var i in docs) {
          if (brands[b] == docs[i]['brandId']['name']) {
            // console.log('carteId:', docs[i]['carteId']['price'])
            temp.push({date: moment(new Date(docs[i].created)).format('YYYY-MM-DD'), name: docs[i]['userId']['name'], productName: docs[i]['carteId']['name'], price: docs[i]['carteId']['price'] * docs[i]['count'] +'元'})
            price += docs[i]['carteId']['price'] * docs[i]['count']
          }
        }
        temp.push({date: '', name: '', productName: '总计:', price: price + '元'})
      }

      // table(res, 0, temp, count)
      res.csv(temp)
    }
  })
})
module.exports = router
