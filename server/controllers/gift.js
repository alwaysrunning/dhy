/**
 * Created by 沐沐 on 2015-11-04.
 */

var api = require('api');


//查询商品列表
module.exports.search = function (req, res, next) {
    var areaId = req.query['area'];//地区id（测试时使用 430100000000）
    var categoryid = req.query['category'];//通过 module.exports.category接口获得的分类  默认0
    var page = req.query['page'];
    var pageSize = req.query['pagesize'];
    var order = req.query['order']; //order 排序方式 price 价格, sell 销量
    var orderType = req.query['ordertype']; //orderType  排序方式 asc 升序, desc 降序
    var storesid = req.query['storesid'];//
    var merchantid = req.query['merchantid'];//
    var activityType = req.query['activitytype'];//
    var isfilterNoBegin = req.query['isfilternobegin'];//
    var isfilterNoStore = req.query['isfilternostore'];//
    var beginTime = req.query['begintime'];//
    var giftName = req.query['giftname'];//
    var giftIds = req.query['ids'];//（暂无用）
    var promise = null;

    if (giftIds) {
        promise = api.gift.giftSearchByIds(giftIds);
    } else {
        promise = api.gift.giftSearch(areaId, categoryid, storesid, merchantid, page, pageSize, order, orderType, activityType, isfilterNoBegin, isfilterNoStore, beginTime, giftName);
    }

    promise.then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

//分组查找
module.exports.group = function (req, res, next) {
    var areaId = req.query['area'];//地区id（测试时使用 430100000000）
    var page = req.query['page'];
    var pageSize = req.query['pagesize'];

    api.gift.giftSearchByGroup(areaId, page, pageSize).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

//商品详情
module.exports.detail = function (req, res, next) {
    var giftid = req.query['giftid'];

    api.gift.giftDetail(giftid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

//商品分类
module.exports.category = function (req, res, next) {
    api.gift.giftCategory().then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

//库存
module.exports.inventory = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var storeid = req.query['storeid'];
    var giftid = req.query['giftid'];
    api.gift.invAndMember(unionid, storeid, giftid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

//创建订单
module.exports.create = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var giftid = req.body['giftid'];
    var storeid = req.body['storeid'];
    var receiver = req.body['receiver'];
    var tel = req.body['tel'];
    var address = req.body['address'];
    var distributtype = req.body['distributtype'];
    var num = req.body['num'];
    var pay = req.body['pay'];
    var password = req.body['password'];
    var cipherKey = undefined;

    api.gift.createOrder(unionid, giftid, storeid, receiver, tel, address, distributtype, num, pay, password, cipherKey).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

module.exports.prepay = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];
    var distributtype = req.body['distributtype'];
    var tel = req.body['tel'];
    var address = req.body['address'];
    var receiver = req.body['receiver'];
    var giftid = req.body['giftid'];
    var storeid = req.body['storeid'];
    var num = req.body['num'];

    api.gift.prepay(unionid, openid, distributtype, tel, address, receiver, giftid, storeid, num).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};