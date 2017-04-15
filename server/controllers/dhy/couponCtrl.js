/**
 * Created by ricopter@qq.com on 2016/11/11.
 * 优惠券列表控制器 V0101云猴  V0115  012838
 */
'use strict';
var api = require('api');
var q = require('q');

/**
 * 优惠券领取列表
 * @param req
 * @param res
 * @param next
 */
module.exports.list = function (req, res, next) {
   var unionid = req.cookies['unionid'];
   var openid = req.cookies['openid'];
   
   var channel= req.query["channel"]||"V0101";
   var type = req.query["type"];
   var sort = req.query["sort"]||"0";

   if(unionid){
      q.all([
         api.store.exchangeStoreId(channel),
         api.user.mobile(unionid)
      ]).spread(function (eData,mDate) {
         return api.coupons.couponAuthList(unionid,eData.data,type,sort,1,20).then(function (data) {
             return {
               couponsData:data,
               storeId:eData.data
            };
         });
      }).then(function (data) {
         res.render('dhy/module/couponList', {
            title: '优惠券',
            data:data.couponsData.data,
            total:data.couponsData.total,
            isLogin:true,
            channel:channel,
            storeId:data.storeId,
            couponType:type,
            couponSort:sort
         });
      }).fail(function (err) {
         //next(err);
         api.store.exchangeStoreId(channel).then(function (eData,mDate) {
            return api.coupons.couponList(eData.data,type,sort,1,20).then(function (data) {
               return {
                  couponsData:data,
                  storeId:eData.data
               };
            })
         }).then(function (data) {

            res.render('dhy/module/couponList', {
               title: '优惠券',
               data:data.couponsData.data,
               total:data.couponsData.total,
               isLogin:false,
               channel:channel,
               storeId:data.storeId,
               couponType:type,
               couponSort:sort
            });

         }).fail(function (err) {
            next(err);
         });
      });
   }else{
      //未登录
      api.store.exchangeStoreId(channel).then(function (eData,mDate) {
         return api.coupons.couponList(eData.data,type,sort,1,20).then(function (data) {
            return {
               couponsData:data,
               storeId:eData.data
            };
         })
      }).then(function (data) {

         res.render('dhy/module/couponList', {
            title: '优惠券',
            data:data.couponsData.data,
            total:data.couponsData.total,
            isLogin:false,
            channel:channel,
            storeId:data.storeId,
            couponType:type,
            couponSort:sort
         });

      }).fail(function (err) {
         next(err);
      });
   }
};

/**
 * 优惠券详情
 * @param req
 * @param res
 * @param next
 */
module.exports.couponDetail = function (req, res, next) {
   var unionid = req.cookies['unionid'];
   var openid = req.cookies['openid'];
   var channel = req.query["channel"]||req.cookies['channel']||"V0101";
   var couponId = req.query["id"];
   var status = req.query["status"];
   var percentage= req.query["percentage"];
   var isSign = req.query["isSign"];
   var couponType = req.query["type"];
   var localUrl = req.protocol+"://"+req.headers.host+ req._parsedOriginalUrl.path;

   if(unionid && openid){
      q.all([
         api.store.exchangeStoreId(channel),
         api.user.mobile(unionid)
      ]).spread(function (eData,mDate) {
         //登录
         api.coupons.couponDetail(couponId).then(function (data) {
            res.render('dhy/module/couponDetail', {
               title: '优惠券详情',
               data:data,
               status:status,
               percentage:percentage,
               isLogin:true,
               channel:channel,
               couponType:couponType,
               localUrl:localUrl
            });
         }).fail(function (err) {
            next(err);
         });

      }).fail(function (err) {
         //未登录
         api.coupons.couponDetail(couponId).then(function (data) {
            res.render('dhy/module/couponDetail', {
               title: '优惠券详情',
               data:data,
               isLogin:false,
               channel:channel,
               status:status,
               percentage:percentage,
               couponType:couponType,
               localUrl:localUrl
            });
         }).fail(function (err) {
            next(err);
         });

      });
   }else{
      //未登录
      api.coupons.couponDetail(couponId).then(function (data) {
         res.render('dhy/module/couponDetail', {
            title: '优惠券详情',
            data:data,
            isLogin:false,
            status:status,
            percentage:percentage,
            channel:channel,
            couponType:couponType,
            localUrl:localUrl
         });
      }).fail(function (err) {
         next(err);
      });
   }
};

/**
 * 优惠券免费领取成功二维码
 * @param req
 * @param res
 * @param next
 */
module.exports.couponFreeQR = function (req, res, next) {
   var name = req.query["name"];
   var code = req.query["code"];
   var channel = req.query["channel"]||req.cookies['channel']||"V0101";
   var couponType = req.query["couponType"];

   res.render('dhy/module/couponFreeQR', {
      title: '优惠券免费领取成功',
      name:name,
      code:code,
      channel:channel,
      couponType:couponType
   });
};

/**
 * 优惠券免费领取失败
 * @param req
 * @param res
 * @param next
 */
module.exports.couponFreeReceiveFail = function (req, res, next) {
   var channel = req.query["channel"]||req.cookies['channel']||"V0101";
   
   res.render('dhy/module/couponFreeReceiveFail', {
      title: '优惠券免费领取失败',
      channel:channel
   });
};

/**
 * 优惠券领取支付
 * @param req
 * @param res
 * @param next
 */
module.exports.couponPayment = function (req, res, next) {
   var channel = req.query["channel"]||req.cookies['channel']||"V0101";
   var name = req.query["name"];
   var id = req.query["id"];
   var beginTime = req.query["beginTime"];
   var endTime = req.query["endTime"];
   var price = req.query["price"];
   var payment = req.query["payment"];
   var payWay= req.query["payWay"];
   var storeId = req.query["storeId"];
   var couponType = req.query["couponType"];

   res.render('dhy/module/couponPayment', {
      title: '优惠券领取支付',
      channel:channel,
      couponId:id,
      beginTime:beginTime,
      endTime:endTime,
      price:price,
      couponName:name,
      payment:parseFloat(payment).toFixed(2),
      payWay:payWay,
      couponType:couponType,
      storeId:storeId
   });
};

/**
 * 优惠券支付成功
 * @param req
 * @param res
 * @param next
 */
module.exports.couponPaySuccess = function (req, res, next) {
   var channel = req.query["channel"]||req.cookies['channel']||"V0101";
   var couponName= req.query["couponName"];
   var code= req.query["code"];
   var payment = req.query["payment"];
   var payType = req.query["payType"];//1积分 2微信
   var couponType = req.query["couponType"];
   var codeArr=[];
   var titleStr= "";
   if(payType=="1"){
      titleStr="优惠券积分支付成功";
   }else if(payType=="2"){
      titleStr="优惠券微信支付成功";
   }else{
      titleStr="优惠券支付成功";
   }

   if(code && code.indexOf(",")!==-1){
      codeArr=code.split(",");
   }else{
     code?codeArr[0]=code:codeArr=[];
   }
   res.render('dhy/module/couponPaySuccess', {
      title: titleStr,
      channel:channel,
      couponName:couponName,
      code:codeArr,
      payment:payment,
      payType:payType,
      couponType:couponType
   });
};
/**
 * 优惠券支付失败
 * @param req
 * @param res
 * @param next
 */
module.exports.couponPayFail = function (req, res, next) {
   var channel = req.query["channel"]||req.cookies['channel']||"V0101";
   res.render('dhy/module/couponPayFail', {
      title: '优惠券支付失败',
      channel:channel
   });
};

/**
 * 我的优惠券订单列表
 * @param req
 * @param res
 * @param next
 */
module.exports.myCouponOderList = function (req, res, next) {
   var channel = req.query["channel"]||req.cookies['channel']||"V0101";
   var unionid = req.cookies['unionid'];
   var openid = req.cookies['openid'];

   var status=req.query["status"]||undefined; //4 支付中 6 退款中 2已退款

   api.coupons.couponOrderPage(unionid, status,1,10).then(function (data) {
      res.render('dhy/module/myCouponOderList', {
         title: '优惠券订单',
         channel:channel,
         status:status,
         data:data
      });
   }).fail(function (err) {
      next(err);
   });
};

/**
 * 我的优惠券订单详情
 * @param req
 * @param res
 * @param next
 */
module.exports.myCouponOderDetails = function (req, res, next) {
   var channel = req.query["channel"]||req.cookies['channel']||"V0101";
   var unionid = req.cookies['unionid'];
   var openid = req.cookies['openid'];

   var orderId=req.query["orderId"];
   var code=req.query["code"];
   var couponId= req.query["couponId"];

   api.coupons.couponOrderDetail(unionid, code).then(function (data) {
      res.render('dhy/module/myCouponOrderDetail', {
         title: '优惠券订单详情',
         channel:channel,
         data:data
      });
   }).fail(function (err) {
      next(err);
   });
};

/**
 * 我的票券列表
 * @param req
 * @param res
 * @param next
 */
module.exports.myCouponList=function (req, res, next) {
   var unionid = req.cookies['unionid'];
   var openid = req.cookies['openid'];
   var channel = req.query["channel"]||req.cookies['channel']||"V0101";

   var page = req.query['page']||1;
   var pageSize = req.query['pagesize']||10;
   var type = req.query["type"];
   var status = req.query['status'];
   var promise = null;
   var paramStatus=null;

   switch (type) {

      case 'siebel':

         promise = api.coupons.couponSiebel(unionid, status, page, pageSize);//status: 已取消 ;可用;已应用;过期的
         promise.then(function (data) {
            res.render('dhy/module/myCouponList', {
               title: '票券·步步高门店',
               data:data,
               typeStr:type||"siebel",
               status:status,
               channel:channel
            });
         }).fail(function (err) {
            next(err);
         });

         break;
      case 'member':

         promise = api.coupons.couponMember(unionid, status, page, pageSize); //status 1：未使用 ， 2：已使用 ，3：已失效，4：未生效"
         promise.then(function (data) {
            res.render('dhy/module/myCouponList_member', {
               title: '票券·联盟商户',
               data:data,
               typeStr:type||'member',
               status:status,
               channel:channel
            });
         }).fail(function (err) {
            next(err);
         });
         break;
      case 'third':
         promise = api.coupons.couponThird(unionid, status, page, pageSize); //status  status =0 已过期，status =1 可使用
         break;
      default:

         promise = api.coupons.couponSiebel(unionid, status, page, pageSize);
         promise.then(function (data) {
            res.render('dhy/module/myCouponList', {
               title: '票券·步步高门店',
               data:data,
               typeStr:type||"siebel",
               status:status,
               channel:channel
            });
         }).fail(function (err) {
            next(err);
         });
   }


};

/**
 * 我的票券详情
 * @param req
 * @param res
 * @param next
 */
module.exports.myCouponDetail=function (req, res, next){
   var unionid = req.cookies['unionid'];
   var openid = req.cookies['openid'];
   var channel = req.query["channel"]||req.cookies['channel']||"V0101";
   var code = req.query["code"];

   api.coupons.couponSellerDetails(code).then(function (data) {
      res.render('dhy/module/myCouponDetail', {
         title: '我的优惠券(票券)详情',
         data:data,
         code:code,
         channel:channel
      });
   }).fail(function (err) {
      next(err);
   });

};



