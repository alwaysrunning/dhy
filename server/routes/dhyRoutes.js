/**
 * Created by ricopter@qq.com on 2016/11/11.
 * 大会员路由表
 */
'use strict';
var express = require('express');
var q = require('q');
var router = express.Router();
var WxWareCtrl= require("../libs/WxWare");
var AuthWareCtrl=require("../libs/AuthWare");
var couponCtrl=require("../controllers/dhy/couponCtrl");
var BabyCtrl= require("../controllers/dhy/baby/babyCtrl");
var PointsRuleCtrl= require("../controllers/dhy/pointsRuleCtrl");
var YiLiCtrl =require("../controllers/dhy/yiLiCtrl");
var api = require('api');

//母婴完善会员信息
router.get('/baby/improveMember',AuthWareCtrl.checkLogin,BabyCtrl.improveMember);
//siebel 优惠券列表
router.get('/couponList',couponCtrl.list);
//优惠券详情
router.get('/couponDetail',couponCtrl.couponDetail);
//优惠券免费领取成功二维码
router.get('/couponFreeQR',AuthWareCtrl.checkLogin,couponCtrl.couponFreeQR);
//优惠券免费领取失败
router.get('/couponFreeReceiveFail',AuthWareCtrl.checkLogin,couponCtrl.couponFreeReceiveFail);

//优惠券领取支付
router.get('/couponPayment',AuthWareCtrl.checkLogin,couponCtrl.couponPayment);

//优惠券支付成功
router.get('/couponPaySuccess',AuthWareCtrl.checkLogin,couponCtrl.couponPaySuccess);


//优惠券支付失败
router.get('/couponPayFail',AuthWareCtrl.checkLogin,couponCtrl.couponPayFail);

//我的优惠券订单列表
router.get('/myCouponOderList',AuthWareCtrl.checkLogin,couponCtrl.myCouponOderList);
router.get('/myCouponOderDetails',AuthWareCtrl.checkLogin,couponCtrl.myCouponOderDetails);

//我的票券列表
router.get('/myCouponList',AuthWareCtrl.checkLogin,couponCtrl.myCouponList);
router.get('/myCouponDetail',AuthWareCtrl.checkLogin,couponCtrl.myCouponDetail);
//积分规则
router.get('/pointsRule',PointsRuleCtrl.rulePage);

//伊利授权跳转地址
router.get('/yiLiAuthUrl',AuthWareCtrl.checkLogin,YiLiCtrl.authUrl);

router.get('/testClear',function (req, res, next) {
    res.clearCookie('islogin');
    res.clearCookie('unionid');
    res.clearCookie('openid');
    res.render('test/clearWx', {title: '测试清除cookie必要参数', dev: process.env.dev});
});

module.exports = router;