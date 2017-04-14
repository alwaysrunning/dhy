/**
 * Created by 沐沐 on 2015-11-05.
 */

var api = require('api');

//查询地区门店列表
module.exports.storeArea = function (req, res, next) {
    var areaid = req.query['areaid'];
    var gaobi = req.query['gaobi'];
    var categoryId = req.query['categoryid'];
    var giftId = req.query['giftid'];

    api.store.storeArea(areaid, gaobi, categoryId, giftId).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

//查询特定范围内门店
module.exports.storeDistance = function (req, res, next) {
    var distance = req.query['distance'];
    var longitude = req.query['longitude'];
    var latitude = req.query['latitude'];
    var gaobo = req.query['gaobo'];
    var categoryId = req.query['categoryid'];

    api.store.storeDistance(distance, longitude, latitude, gaobo, categoryId).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

//门店详情
module.exports.storeDetail = function (req, res, next) {
    var storeId = req.query['storeid'];

    api.store.storeDetail(storeId).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

//门店分类
module.exports.storeCategory = function (req, res, next) {
    api.store.storeCategory().then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

//门店联系方式
module.exports.storeHotLine = function (req, res, next) {
    var areaId = req.query['areaid'];
    var online = req.query['online'];
    var categoryId = req.query['categoryid'];

    api.store.storeHotLine(areaId, online, categoryId).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

module.exports.advert = function (req, res, next) {
    var zoneid = req.query['zomeid'];

    api.store.advert(zoneid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};
/**
 * 门店精彩活动
 * @param req
 * @param res
 * @param next
 */
module.exports.storeActivity=function (req, res, next) {
    var storeId = req.query['storeId'];
    var page= req.query['page'];
    var pageSize=req.query['pageSize'];
    api.store.activity(page,pageSize,storeId).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

module.exports.exchangeStoreId=function (req, res, next) {
    var channel = req.query['channel'];

    api.store.exchangeStoreId(channel).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};
