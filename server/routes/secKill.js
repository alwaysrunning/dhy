/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2016/1/25
 * Time: 10:10
 * 爆款抢购
 * */
var express = require('express');
var router = express.Router();
var secKill = require('../controllers/secKill');

router.get('/', secKill.init);
router.get('/gift/:active', secKill.gift);
router.post('/mobile', secKill.mobile);

module.exports = router;