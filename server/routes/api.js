/**
 * Created by 沐沐 on 2015-10-22.
 * 接口路由表
 */
var express = require('express');
var router = express.Router();
var multer = require('multer')();

var checkController = require('../controllers/check');
var loginController = require('../controllers/login');
var accountController = require('../controllers/account');
var messageController = require('../controllers/message');
var couponController = require('../controllers/coupons');
var storeController = require('../controllers/store');
var orderController = require('../controllers/order');
var giftController = require('../controllers/gift');
var areaController = require('../controllers/area');
var unicomController = require('../controllers/unicom');
var unionpayController = require('../controllers/unionpay');
var customerController = require('../controllers/customer');
var posController = require('../controllers/pos');
var ferrisController = require('../controllers/ferriswheel');
var weixinController = require('../controllers/weixin');
var paypassController = require('../controllers/paypass');
var etcController = require('../controllers/etc');
var invitationController = require('../controllers/invitation');
var babyApiController = require("../controllers/apiCtrl/babyApi");
var couponApiController= require("../controllers/apiCtrl/couponApi");

router.post('/check', checkController.check);//检查openid状态及登录状态

router.post('/login', loginController.login);//登录操作
router.post('/loginV2', loginController.loginV2);//登录操作

router.post('/updateChannel', loginController.updateChannel);//更新渠道
router.get('/licenses', loginController.licenses);//注册协议

router.get('/account/center', accountController.center);//个人中心数据
router.get('/account/info', accountController.accountInfo);//账户数据

router.get('/account/mycard', accountController.cards);//会员卡信息加邀请码信息
router.get('/account/card', accountController.card);//会员卡信息
router.get('/account/myBabyCards', accountController.myBabyCards);//母婴会员卡信息

router.get('/coupon/list', couponController.coupons);//优惠券列表
router.get('/coupon/detail', couponController.couponDetail);//优惠券详情（联盟）
router.get('/coupon/count', couponController.couponCount);//优惠券数量统计

router.get('/account/paySignParam', accountController.paySignParam);
router.get('/account/address', accountController.address);//收货地址
router.get('/account/user', accountController.user_account);//积分和红包查询合并接口
router.get('/account/integration', accountController.integration);//查询积分
router.get('/account/integration/list', accountController.integrationList);//积分列表
router.get('/account/integration/trans', accountController.transferIntegration);//积分赚红包
router.get('/pointlicenses', accountController.integrationLicenses);//积分规则
//router.get('/account/balance', accountController.reward);//查询红包
//router.get('/account/balance/list', accountController.rewardList);//红包列表
//router.get('/account/balance/list/type', accountController.rewardListByType);//红包列表

router.get('/account/sms', accountController.sms);//发送短信
router.get('/account/verify', accountController.verifySms);//短信验证码验证

router.post('/account/sync', accountController.sync);//完善个人信息

//router.get('/account/honebao', accountController.hongbao);//券码转红包

router.get('/account/updatemobile', accountController.updateMobile);//重置手机号码

//router.post('/account/setpaypass', accountController.setPayPass);//设置支付密码
//router.post('/account/updatepaypass', accountController.updatePayPass);//重置支付密码

router.post('/account/userappealphone', multer.any(), accountController.userAppealPhone);//手机号码申述
//router.post('/account/userappealpaypass', multer.any(), accountController.userAppealPayPass);//支付密码申述

router.get('/account/pointIncrease', accountController.pointIncrease);//扫码增加积分


router.get('/account/userappealpaypassstatus', accountController.userAppealPayPassStatus);//查询是否支付申述中

router.get('/message/count', messageController.count);//消息总数
router.get('/message/omit', messageController.omitMessages);//消息汇总表
router.get('/message/list', messageController.message);//消息列表
router.get('/message/read', messageController.read);//标记已读
router.get('/message/clean', messageController.clean);//清除消息

router.get('/order/count', orderController.count);//订单总数
router.get('/order/search', orderController.orderSearch);//订单查询合并
router.get('/order/detail', orderController.orderDetail);//订单详情合并
router.get('/order/cancelDetail', orderController.orderCancelDetail);//订单退款详情
router.post('/order/cancel', multer.any(), orderController.orderCancel);//礼品订单退款

router.get('/pos/list', posController.posList);//电子小票列表
router.get('/pos/detail', posController.posDetail);//电子小票详情

router.get('/gift/search', giftController.search);//查询礼品商品
router.get('/gift/group', giftController.group);//按组查询礼品商品（暂无用）
router.get('/gift/detail', giftController.detail);//礼品详情
router.get('/gift/category', giftController.category);//礼品分类
router.get('/gift/inventory', giftController.inventory);//礼品库存
router.post('/gift/create', giftController.create);//创建礼品订单
router.post('/gift/prepay', giftController.prepay);//创建微信支付预付订单

router.get('/store/advert', storeController.advert);//广告
router.get('/store/area', storeController.storeArea);//查询区域门店
router.get('/store/distance', storeController.storeDistance);//查询范围内门店
router.get('/store/detail', storeController.storeDetail);//门店详情
router.get('/store/activity', storeController.storeActivity);//门店精彩活动
router.get('/store/category', storeController.storeCategory);//门店分类
router.get('/store/hotLine', storeController.storeHotLine);//门店联系方式
router.get('/store/exchangeStoreId', storeController.exchangeStoreId);//渠道换取门店id

router.get('/area', areaController.areas);//已开放城市列表
router.get('/area/location', areaController.location);//定位
router.get('/area/getRegionByCode', areaController.getRegionByCode);//区域树形
router.get('/area/getRegionAll', areaController.getRegionAll);//区域树形所有

router.get('/unicom/validate', unicomController.validate);//联通账户验证
router.get('/unicom/integral', unicomController.integration);//联通积分查询
router.get('/unicom/exchange', unicomController.exchange);//联通积分兑换

router.get('/unionpay/verify', unionpayController.verify);//验证银联卡顺便绑定到账户上
router.get('/unionpay/cards', unionpayController.cardList);//账户绑定银联卡列表
router.get('/unionpay/exchange', unionpayController.exchange);//银联积分兑换积分

router.get('/customer/list', customerController.customerList);//客服列表
router.get('/customer/shop', customerController.customerShop);//门店列表

router.post('/paypass/barcode', paypassController.barcode);//生成付款码
router.get('/paypass/barcodestatus', paypassController.barcodeStatus);//付款码状态查询
router.get('/paypass/apporder', paypassController.apporder);//查询扫码订单
router.post('/paypass/apporderpay', paypassController.apporderSave);//支付订单

router.get('/ferris/draw', ferrisController.draw);
router.get('/ferris/info', ferrisController.info);
router.get('/ferris/share', ferrisController.share);

router.get('/invitation/get', invitationController.invitationGet);//获得邀请码信息
router.get('/invitation/list', invitationController.invitationList);//获得邀请的人
router.post('/invitation/submit', invitationController.invitationSubmit);//提交邀请码
router.post('/invitation/share', invitationController.shareSubmit);//分享后记录头像

router.get('/etc/query', etcController.carQuery);
router.get('/etc/queryCar', etcController.carQueryByCar);
router.get('/etc/cars', etcController.cars);
router.get('/etc/info', etcController.info);
router.get('/etc/bindPos', etcController.bindPos);
router.get('/etc/pos', etcController.pos);
router.get('/etc/history', etcController.history);
router.get('/etc/clear', etcController.clear);
router.get('/etc/del', etcController.del);
router.get('/etc/bind', etcController.bind);
router.post('/etc/orderComfirm', etcController.orderComfirm);
router.get('/etc/positionList', etcController.positionList);
router.get('/etc/savePosition', etcController.savePosition);
router.get('/etc/delPosition', etcController.delPosition);
router.get('/etc/carStatus', etcController.carStatus);
router.get('/etc/positionScan',etcController.scanToRememberPosition);

router.get('/weixin/sign', weixinController.sign);
router.get('/weixin/ticket', weixinController.ticket);
router.get('/weixin/token', weixinController.accessToken);
//母婴优惠券以及会员信息保存
router.post('/dhy/baby/saveMember',babyApiController.saveMemberInfo);
router.post('/dhy/coupon/getCouponReceive',couponApiController.getCouponReceive);
router.get('/dhy/coupon/getCouponList',couponApiController.getCouponList);

module.exports = router;
