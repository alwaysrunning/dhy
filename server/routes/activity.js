/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2016/1/30
 * Time: 16:10
 * 活动专题路由
 * */
var express = require('express');
var router = express.Router();
var api=require('api');
var memberData=require('../controllers/memberData');
router.get('/memberData2016', memberData.init);

module.exports = router;