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
//母婴完善会员信息
router.get('/baby/improveMember',AuthWareCtrl.checkLogin,BabyCtrl.improveMember);
//siebel 优惠券列表
router.get('/couponList',couponCtrl.list);
//积分规则
router.get('/pointsRule',PointsRuleCtrl.rulePage);

//伊利授权跳转地址
router.get('/yiLiAuthUrl',AuthWareCtrl.checkLogin,YiLiCtrl.authUrl);
/**
 *测试
 */
router.get('/test',function (req, res, next) {

    res.render('test/checkWx', {title: '测试页面IOS 授权不跳转', dev: process.env.dev});
});

router.get('/testClear',function (req, res, next) {

    res.clearCookie('islogin');
    res.clearCookie('unionid');
    res.clearCookie('openid');

    res.render('test/clearWx', {title: '测试清除cookie必要参数', dev: process.env.dev});
});


module.exports = router;