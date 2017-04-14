/**
 * Created by 沐沐 on 2015-11-23.
 */
var api = require('api');

//客服列表
module.exports.customerList = function (req, res, next) {
    var page = req.query['page'];
    var pageSize = req.query['pageSize'];
    api.customer.customerList(page, pageSize).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//门店信息
module.exports.customerShop = function (req, res, next) {
    var sellerId = req.query['sellerid'];
    var areaId = req.query['areaid'];
    var page = req.query['page'];
    var pageSize = req.query['pagesize'];

    api.customer.customerShop(sellerId, areaId, page, pageSize).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};
//门店所有信息
module.exports.customerAllShop = function (req, res, next) {
    var sellerId = req.query['sellerid'];
    var page = req.query['page'];
    var pageSize = req.query['pagesize'];

    api.customer.customerShop(sellerId, page, pageSize).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};
