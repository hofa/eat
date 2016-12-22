var express = require('express')
var router = express.Router()
var util = require('util')
var setting = require('../setting')
let{Carte} = require('../model')
let{getFilter, print, succ, fail, isLogin, table} =  require('../libs')
var mongoose = require('mongoose')

router.get('/', function(req, res) {
  var page = req.param("page", 1)
  page = page < 1 ? 1 : page
  var filters = {}
  filters = getFilter(req)
  var query = Carte.find(filters)
  query.skip(setting.pagesize * (page - 1)).limit(setting.pagesize)
  //query.in(["_id", "name", "created"])
  query.exec(function (err, docs) {
    // called when the `query.complete` or `query.error` are called
    // internally
    if (err) {
      fail(res, 99999)
    } else {
      Carte.count(filters, function (err, count) {
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
  req.assert('price', '11003').notEmpty()
  req.assert('brandId', '11003').notEmpty()
  // req.assert('userId', '11003').notEmpty()
  req.assert('type', '11003').notEmpty()
  var errors = req.validationErrors()
  if (errors) {
    fail(res, errors[0]['msg'])
    return
  }
  var query = new Carte({'name': req.body.name,
    'price': req.body.price,
    'type': req.body.type,
    'brandId': mongoose.Types.ObjectId(req.body.brandId),
    'userId': mongoose.Types.ObjectId(req.session._id)})
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
  var price = req.param("price", false)
  var brandId = req.param("brandId", false)
  var type = req.param("type", false)

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

  if (brandId) {
    data['brandId'] = mongoose.Types.ObjectId(req.body.brandId)
  }

  if (price) {
    data['price'] = req.body.price
  }

  if (type) {
    data['type'] = req.body.type
  }
  // var query = new Brand
  console.log('update', req.body.id, data)
  Carte.update({_id: mongoose.Types.ObjectId(req.body.id)}, data, function(err, data) {
      if (err) {
        fail(res, 'fail')
      } else {
        succ(res)
      }
  })
})

module.exports = router
