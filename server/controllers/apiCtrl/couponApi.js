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

    var tokenid = req.cookies['tokenid'];

    if(((tokenid && tokenid !== undefined && /superapp/ig.test(tokenid)) || unionid) && couponId){
        api.coupons.couponReceiveNew(unionid,storeid,couponId,carNo,tokenid).then(function (data) {
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
    var tokenid = req.cookies['tokenid'];

    var isLogin= req.query["isLogin"];
    var storeid= req.query["storeid"];
    var type = req.query["type"];
    var sort = req.query["sort"];
    var page= req.query["page"]||"1";
    var pageSize= req.query["pageSize"]||"20";

    if(unionid && storeid){
        api.user.mobile(unionid,tokenid).then(function () {
            return api.coupons.couponAuthList(unionid,storeid,type,sort,page,pageSize,tokenid);
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