// // module define
// var Q = require('q');

// var f1 = function (req, res) {
//   var deferred = Q.defer();

//   setTimeout(function () {
//     console.log('f1');
//     deferred.resolve(['f1 return 1', 'f1 return 2']);
//   }, 1000);

//   return deferred.promise;
// };

// var f2 = function (r1) {
//   var deferred = Q.defer();
//   console.log(r1);
//   // deferred.resolve('f2 result');
//   deferred.reject('f2 error');
//   return deferred.promise;
// };

// var f3 = function (req, res) {
//   var deferred = Q.defer();
//   console.log('f3');
//   deferred.resolve('f3 result');
//   return deferred.promise;
// };

// var req = '';
// var res = '';
// f1(req, res).then(function (r1) {
//   f2(r1).then(function (result) {
//     f3(req, res).then(function (result) {
//       console.log('f3 ok ' + result);
//     })

//   })

// });



var Q = require('q');
var createOrder = {

  init: function () {
    var arg = {req: "a", res: "b"}
    var self = this
    // self.findOrder(arg).then(function (res) {
    //   self.judgeMoney(res).then(function (res) {
    //     self.save(res).then(function (res) {
    //       // console.log('f3 ok ' + result);
    //     })

    //   }, function(err){
    //     console.log('judgeMoney reject ' + err)
    //   })

    // });
    // this.Q.all([self.findOrder, self.judgeMoney, self.save]).spread(function(r1, r2, r3){
    //   console.log(r1, r2, r3);
    // })
    // this.Q.resolve('OKXX').delay(1000).then(console.log)
    //
    // function test1() {
    //   var deferred = self.Q.defer();
    //   // console.log('findOrder');
    //   // deferred.resolve('f3 result');
    //   deferred.reject('fff');
    //   return deferred.promise;
    // }
    // this.Q.when(test1(), console.log, console.log)
    // console.log('judgeMoney reject ')
    //


      self.findOrder(arg).
      then(self.judgeMoney, function (err) {
        throw new Error("thrown error");
      }).
      then(self.save).fail(function (error) {
          // console.log(error)
          return error;
      })
  },

  findOrder: function (arg) {
    var deferred = Q.defer();
    console.log('findOrder');
    deferred.reject('fff');
    deferred.resolve('f1 result');
    return deferred.promise;
  },

  judgeMoney: function (arg) {
    console.log('judgeMoney');
    var deferred = Q.defer();
    // console.log('findOrder');
    deferred.resolve('f3 result');
    // deferred.reject('fff');
    return deferred.promise;
  },

  save: function (arg) {
    var deferred = Q.defer();
    console.log('save');
    return deferred.promise;
  }
}
createOrder.init()
