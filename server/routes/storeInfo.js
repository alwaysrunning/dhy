/**
 * Created by rico on 2016/8/22.
 * 门店信息
 */
var express = require('express');
var router = express.Router();
var q = require('q');
var storeInfoCtrl=require('../controllers/storeInfoCtrl');

router.get('/storeTypeList',storeInfoCtrl.storeTypeList);

router.get('/storeList', storeInfoCtrl.storeList);

router.get('/storeDetails', storeInfoCtrl.storeDetails);

module.exports = router;