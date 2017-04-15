/**
 * Created by ricopter@qq.com on 2016/11/11.
 * 优惠券api控制器
 */
'use strict';
var api = require('api');

/**
 * siebel 优惠卷领取
 * @param req
 * @param res
 * @param next
 */
module.exports.getCouponReceive = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];
    
    var couponId=req.body["couponId"];
    var storeid= req.body["storeid"];
    var carNo = req.body["carNo"];

    if(unionid && couponId){
        api.coupons.couponReceiveNew(unionid,storeid,couponId,carNo).then(function (data) {
            res.json(data);
        }).fail(function (err) {
            next(err);
        });
    }else{
        res.json(new api.error.ApiError('9999', '缺少参数'));
    }
};
/**
 * 优惠券列表
 * @param req
 * @param res
 * @param next
 */
module.exports.getCouponList = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];

    var isLogin= req.query["isLogin"];
    var storeid= req.query["storeid"];
    var type = req.query["type"];
    var sort = req.query["sort"];
    var page= req.query["page"]||"1";
    var pageSize= req.query["pageSize"]||"20";

    if(unionid && storeid){
        api.user.mobile(unionid).then(function () {
            return api.coupons.couponAuthList(unionid,storeid,type,sort,page,pageSize);
        }).then(function (data) {
            res.json(data);
        }).fail(function (err) {
            //next(err);
            api.coupons.couponList(storeid,type,sort,page,pageSize).then(function (data) {
                res.json(data);
            }).fail(function (err) {
                next(err);
            });
        });
    }else{
        api.coupons.couponList(storeid,type,sort,page,pageSize).then(function (data) {
            res.json(data);
        }).fail(function (err) {
            next(err);
        });
    }
};

/**
 * 优惠券积分支付订单创建
 * @param req
 * @param res
 * @param next
 */
module.exports.couponOrderCreate = function (req, res, next){
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];

    var storeId= req.body["storeId"];
    var couponId = req.body["couponId"];
    var payType = req.body["payType"];
    var num= req.body["num"];
    var carNo= req.body["carNo"]||undefined;

    if(unionid && openid){
        api.coupons.couponOrderCreate(unionid,storeId,couponId,payType,num,carNo).then(function (data) {
            res.json(data);
        }).fail(function (err) {
            next(err);
        });
    }else{
        res.json(new api.error.ApiError('999', '缺少必要参数'));
    }
};

/**
 * 优惠券微信支付订单创建
 * @param req
 * @param res
 * @param next
 */
module.exports.couponOrderPrepay = function (req, res, next){
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];

    var storeId= req.body["storeId"];
    var couponId = req.body["couponId"];
    var payType = req.body["payType"];
    var num= req.body["num"];
    var carNo= req.body["carNo"]||undefined;

    if(unionid && openid){
        api.coupons.couponOrderPrepay(unionid,storeId,couponId,payType,num,openid,carNo).then(function (data) {
            res.json(data);
        }).fail(function (err) {
            next(err);
        });
    }else{
        res.json(new api.error.ApiError('999', '缺少必要参数'));
    }
};

/**
 * 优惠券订单列表
 * @param req
 * @param res
 * @param next
 */
module.exports.couponOderList = function (req, res, next){
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];

    var status= req.body["status"]||undefined;
    var page = req.body["page"];
    var pageSize = req.body["pageSize"];

    if(unionid && openid){
        api.coupons.couponOrderPage(unionid,status,page,pageSize).then(function (data) {
            res.json(data);
        }).fail(function (err) {
            next(err);
        });
    }else{
        res.json(new api.error.ApiError('999', '缺少必要参数'));
    }
};

/**
 * 优惠券订单列表
 * @param req
 * @param res
 * @param next
 */
module.exports.couponOrderDel = function (req, res, next){
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];
    var code= req.body["code"];

    if(unionid && openid){
        api.coupons.couponOrderDel(unionid,code).then(function (data) {
            res.json(data);
        }).fail(function (err) {
            next(err);
        });
    }else{
        res.json(new api.error.ApiError('999', '缺少必要参数'));
    }
};

/**
 * 优惠券支付订单号获得优惠券编号
 * @param req
 * @param res
 * @param next
 */
module.exports.couponOrderByOrderCode = function (req, res, next){
  var unionid = req.cookies['unionid'];
  var openid = req.cookies['openid'];
  var orderCode= req.query["orderCode"];

  if(unionid && openid){
    api.coupons.couponOrderByOrderCode(unionid,orderCode).then(function (data) {
      res.json(data);
    }).fail(function (err) {
      next(err);
    });
  }else{
    res.json(new api.error.ApiError('999', '缺少必要参数'));
  }
};
