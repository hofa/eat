var express = require('express')
var router = express.Router()
var util = require('util')
var setting = require('../setting')
let{Brand} = require('../model')
let{getFilter, print, succ, fail, isLogin, table} =  require('../libs')
var mongoose = require('mongoose')

// 定义网站主页的路由
router.get('/', function(req, res) {
  var page = req.param("page", 1)
  page = page < 1 ? 1 : page
  var filters = {}
  // if () {
  filters = getFilter(req)
  // }
  // console.log(filters)
  // console.log(req.query)
  var query = Brand.find(filters)
  query.skip(setting.pagesize * (page - 1)).limit(setting.pagesize)
  //query.in(["_id", "name", "created"])
  query.exec(function (err, docs) {
    // called when the `query.complete` or `query.error` are called
    // internally
    if (err) {
      fail(res, 99999)
    } else {
      Brand.count(filters, function (err, count) {
        if (err) {
          fail(res, 99999)
        } else {
          console.log(55)
          table(res, 0, docs, count)
        }
      })
    }
  })

})

router.post('/', function(req, res) {
  req.assert('name', '11003').notEmpty()
  var errors = req.validationErrors()
  if (errors) {
    fail(res, errors[0]['msg'])
    return
  }
  var query = new Brand({'name': req.body.name})
  console.log(req.body.name)
  query.save(function(err, data) {
      if (err) {
        fail(res, 'fail')
      } else {
        succ(res)
      }
  })
})

router.put('/', function(req, res) {
  var name = req.param("name", false)
  var display = req.param("display", false)
  req.assert('id', '11003').notEmpty()
  var errors = req.validationErrors()
  if (errors) {
    fail(res, errors[0]['msg'])
    return
  }
  var data = {}
  if (name) {
    data['name'] = req.body.name
  }

  if (display) {
    data['display'] = req.body.display
  }
  // var query = new Brand
  console.log('update', req.body.id, data)
  Brand.update({_id: mongoose.Types.ObjectId(req.body.id)}, data, function(err, data) {
      if (err) {
        fail(res, 'fail')
      } else {
        succ(res)
      }
  })
})

module.exports = router
