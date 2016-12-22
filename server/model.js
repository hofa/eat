/**
String
Number
Date
Buffer
Boolean
Mixed
ObjectId
Array
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 品牌
var brandSchema = new Schema({
  name: String,
  display: {type: Boolean, default: true},
  created: {type: Number, default: Date.now()}
});
var Brand = mongoose.model('Brand', brandSchema);
module.exports.Brand = Brand;

// 菜谱
var carteSchema = new Schema({
  name: String,
  brandId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  type: {type: Number, default: 1},  // 1 饭  2 粉/面 3 汤 4 饮料 5 小菜
  price: {type: Number, default: 1},
  display: {type: Boolean, default: true},
  created: {type: Number, default: Date.now()}
});
var Carte = mongoose.model('Carte', carteSchema);
module.exports.Carte = Carte;

// 用户
var userSchema = new Schema({
  name: {type: String, default: ''},
  loginname: {type: String, unique: true},
  notification: {type: Boolean, default: true},  // 1 开启 2 不开启
  created: {type: Number, default: Date.now()}
});
var User = mongoose.model('User', userSchema);
module.exports.User = User;

// 订单
var orderSchema = new Schema({
  // userId: mongoose.Schema.Types.ObjectId,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand"
  },
  carteId:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carte"
  },
  productName: String,
  count: Number,
  price: Number,
  type: Number,
  created: {type: Number, default: Date.now()}
});
var Order = mongoose.model('Order', orderSchema);
module.exports.Order = Order;
