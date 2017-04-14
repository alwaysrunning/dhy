/**
 * Created by rico on 2016/8/25.
 * 门店信息
 */
'use strict';
var api = require('api');
var Q = require('q');
/**
 * 业态列表
 * @param req
 * @param res
 * @param next
 */
module.exports.storeTypeList=function (req, res, next) {

    api.customer.customerList(1, 10).then(function (data) {
        res.render('dhy/storeInfo/storeTypeList', {
            title: '业态列表·门店信息',
            dev:process.env.dev,
            data:data
        });
    }).fail(function (err) {
        next(err);
    });
};
/**
 * 门店列表
 * @param req
 * @param res
 * @param next
 */
module.exports.storeList=function (req, res, next) {
    var sellerId = req.query['sellerid'];
    var sellerName= req.query['categoryName']||"";
    var page = 1;
    var pageSize = 10;
    var logoImg=decodeURIComponent(req.query['logoImg']);

    Q.all([
        api.store.advert("110"),//广告位置id
        api.customer.customerAllShop(sellerId,page, pageSize)
    ]).spread(function (adList,customerShopData) {
        res.render('dhy/storeInfo/storeInfoList', {
            title: sellerName +'门店列表·门店信息',
            dev: process.env.dev,
            data:customerShopData,
            adList:adList.data,
            logoImg:logoImg,
            sellerName:sellerName
        });
    }).fail(function (err) {
        next(err);
    });
    //res.redirect("/#/locationList?fromUrl="+encodeURIComponent("/storeInfo/storeList?categoryId=0&sellerid=1"));

};
/**
 * 门店详情
 * @param req
 * @param res
 * @param next
 */
module.exports.storeDetails=function (req, res, next) {
    var storeId = req.query['storeId'];
    var page=1,pageSize=10;
    Q.all([
        api.store.storeDetail(storeId),
        api.store.activity(page,pageSize,storeId)
    ]).spread(function (detail,activity) {
        var _title= detail.data["name"]||"";
        res.render('dhy/storeInfo/storeDetails', {
            title: _title+'门店详情·门店信息',
            dev:process.env.dev,
            detail:detail.data,
            activity:activity.data
        });
    }).fail(function (err) {
        next(err)
    });
};