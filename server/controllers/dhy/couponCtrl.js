/**
 * Created by ricopter@qq.com on 2016/11/11.
 * 优惠券列表控制器 V0101云猴  V0115  012838
 */
'use strict';
var api = require('api');
var q = require('q');

module.exports.list = function (req, res, next) {
   var unionid = req.cookies['unionid'];
   var openid = req.cookies['openid'];
   
   var channel= req.query["channel"]||"V0101";
   var type = req.query["type"];
   var sort = req.query["sort"]||"0";

   var tokenid = req.cookies['tokenid'];

   if(unionid || (tokenid && tokenid !== undefined && /superapp/ig.test(tokenid))){
      q.all([
         api.store.exchangeStoreId(channel),
         api.user.mobile(unionid, tokenid)
      ]).spread(function (eData,mDate) {
         return api.coupons.couponAuthList(unionid,eData.data,type,sort,1,20,tokenid).then(function (data) {
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
