var express = require('express')
var router = express.Router()
var util = require('util')
var setting = require('../setting')
let{User} = require('../model')
let{print, succ, fail, isLogin, table, trim} =  require('../libs')
var mongoose = require('mongoose')

router.get('/', function(req, res) {
  console.log(mongoose.Types.ObjectId(req.param('t')))
  var query = User.findOne({'_id': mongoose.Types.ObjectId(req.param('t'))})
  query.exec(function (err, docs) {
    if (err) {
      fail(res, 99999)
    } else {
      succ(res, 0, docs)
    }
  })
})

router.post('/login', function(req, res) {
  req.assert('loginname', '11003').notEmpty()
  // req.assert('accessToken', '11003').notEmpty()
  req.assert('password', '11004').notEmpty()
  var errors = req.validationErrors()
  if (errors) {
    fail(res, errors[0]['msg'])
    return
  }

  if (req.body.password != '5326#') {
    fail(res, 11111,'密码错误')
    return
  }

  var query = User.findOne({'loginname': req.body.loginname})
  query.exec(function (err, docs) {
    if (err) {
      fail(res, 99999)
    } else {
      if (docs instanceof Object && typeof docs['_id'] != 'undefined') {
        succ(res, 0, {token: docs['_id']})
      } else {
        var query2 = new User({'loginname': req.body.loginname})
        query2.save(function(err, data) {
            if (err) {
              fail(res, 11111, 'fail')
            } else {
              succ(res, 0, {token: data['_id']})
            }
        })
      }
    }
  })

})

router.put('/', function(req, res) {
  // var name = req.param("name", false)
  // var notification = req.param("notification", false)
  // req.assert('notification', '11003').notEmpty()
  // req.assert('name', '11003').notEmpty()
  // var errors = req.validationErrors()
  // if (errors) {
  //   fail(res, errors[0]['msg'])
  //   return
  // }
  var data = {}
  // if (name) {
  data['name'] = trim(req.body.name)
  // }

  // if (req.body.notification) {
  data['notification'] = req.body.notification
  // }
  console.log('put:', data)
  // var query = new Brand
  // console.log('update', req.body.id, data)
  User.update({_id: mongoose.Types.ObjectId(req.param('t'))}, {$set: data}, function(err, data) {
      if (err) {
        fail(res, 212312, "保存失败")
      } else {
        succ(res)
      }
  })
})

module.exports = router
