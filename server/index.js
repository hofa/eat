
// module define
var request = require('request')
var express = require('express')
var mongodb = require('mongodb')
var session = require('express-session')
var bodyParser = require('body-parser')
var expressValidator = require('express-validator');
var setting = require('./setting')
var app = express();
var mongoose = require('mongoose')
let{print, succ, fail, isLogin, table, todayStart} =  require('./libs')
let{User, Order} = require('./model')
var csv = require('express-csv')
var ObjectId = mongoose.Types.ObjectId
// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// express
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('static'));
app.use(session({
  secret: '!##$1234578',
  name: 'carte',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: {maxAge: 3600 * 1000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
  resave: false,
  saveUninitialized: true,
}));

mongoose.connect(setting.mongodb);

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function (callback) {
  // yay!
  console.log("数据库已连接!")
  app.listen(setting.httpport)
  console.log("webserver Listening on port ",setting.httpport)
});


// 没有挂载路径的中间件，应用的每个请求都会执行该中间件
app.use(function (req, res, next) {
  // req.headers['Access-Control-Allow-Origin'] =  '*'
  // req.headers['Access-Control-Allow-Methods'] =  'POST, GET, PUT, DELETE'
  // req.headers['Access-Control-Max-Age'] =  3600
  // req.headers['Access-Control-Allow-Headers'] =  'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, If-Modified-Since'
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With")
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8")
  console.log('%s %s %s', req.method, req.url, req.path)


  if (req.path != '/user/login'){
    // fail(res, 1)
    var t = req.param('t')
    User.findOne({_id: mongoose.Types.ObjectId(req.param('t'))}, function (err, docs) {
      if (err) {
        fail(res, 1)
      }
      console.log('logn', typeof docs, docs)
      if (docs && typeof docs['_id'] != 'undefined') {
        next()
      } else {
        fail(res, 1)
      }
    })
  } else {
    next()
  }
})

app.use('/brand', require('./app/brand'))
app.use('/carte', require('./app/carte'))
app.use('/user', require('./app/user'))
app.use('/order', require('./app/order'))

// 定时任务
var schedule = require('node-schedule');
var rule     = new schedule.RecurrenceRule()
var times    = []
for(var i = 0; i < 60; i++) {
  times.push(i)
}
rule.minute  = times
var j = schedule.scheduleJob(rule, function(){
    var myDate = new Date();
    console.log('定时任务:', myDate.getHours(), myDate.getMinutes());
    if (myDate.getDay() == 0 || myDate.getDay() == 6) {
      return
    }

    if (myDate.getHours() != 17 || myDate.getMinutes() != 20) {
      return
    }
    console.log('开始执行定时任务', myDate.getHours(), myDate.getMinutes())
    var query = User.find({notification:true})
    query.exec(function (err, docs) {
      if (err) {
      } else {
        for(let i in docs) {
          Order.count({userId: ObjectId(docs[i]._id), created: {$gt: todayStart()}}, function (err, count) {
            // console.log('定时COUNT:', count)
            if (count == 0) {
              console.log('消息通知:', docs[i].loginname, docs[i].name)
              var url = 'http://m.ubi001.com/carte/noti?key=de121ec291f84738a'
              var requestData = {
               "touser": docs[i].loginname,
               "template_id": "--V2Fp369cvcvpRpPs9Ek5sf0AorjE1MQQ0AY1ruDUQ",
               "url":"http://m.ubi001.com/carte",
               "data":{
                 "first": {
                     "value":"又到吃饭时间了喔！！！！",
                     "color":"#173177"
                 },
                 "keyword1": {
                     "value":"快来点餐吧",
                     "color":"#173177"
                 },
                 "keyword2": {
                     "value":myDate.getFullYear() + "-" + (myDate.getMonth() + 1)+ "-" + + myDate.getDate() + " 17:30分前",
                     "color":"#173177"
                 },
                 "remark":{
                     "value":"",
                     "color":"#173177"
                 }
              }}
              request({
                url: url,
                method: "POST",
                json: true,
                headers: {
                    "content-type": "application/json",
                },
                body: requestData
              }, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                }
              })
            }
          })

          // console.log('定时任务 docs:', docs[i])

        }
      }
    })
})

// j.cancel()

// function Ticker() {}

// var util = require('util');
// var et = require('events').EventEmitter;
// util.inherits(Ticker, et);
// var ticker = new Ticker();
// ticker.on("tick",function(msg, address, port) {
//   console.log("Event:", msg.toString(), address.toString(), port.toString());
// });



