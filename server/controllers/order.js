/**
 * Created by 沐沐 on 2015-10-27.
 * 订单控制器
 */

var api = require('api');
var q = require('q');

//订单数量汇总
module.exports.count = function (req, res, next) {
    var unionid = req.cookies['unionid'];

    api.request.getTokens(unionid).then(function (tokens) {
        q.all([
            api.order.giftOrderCount(tokens),
            api.order.commodityOrderCount(tokens)
        ]).spread(function (gift, commodity) {
            res.json({
                giftCount: gift.data,
                commodityCount: commodity.data
            });
        });
    }).fail(function (err) {
        next(err)
    });
};

/**
 * 订单查询合并接口
 * @param req
 * @param res
 * @param next
 * @param page 第几页
 * @param pageSize 每页显示的记录条数
 * @param status 订单状态（see api.order）
 * @param type = [gift 礼品|mall 商城|commodity 小店] 订单类型
 */
module.exports.orderSearch = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var page = req.query['page'];
    var pageSize = req.query['pagesize'];
    var status = req.query['status'];
    var type = req.query['type'];
    var promise = null;

    switch (type) {
        case 'gift':
            promise = api.order.giftOrderSearch(unionid, page, pageSize, status);
            break;
        case 'mall':
            promise = api.order.mallOrderSearch(unionid, page, pageSize, status);
            break;
        case 'commodity' :
            promise = api.order.commodityOrderSearch(unionid, page, pageSize, status);
            break;
    }

    if (promise) {
        promise.then(function (data) {
            res.json(data)
        }).fail(function (err) {
            next(err);
        });
    } else {
        next(new api.error.ApiError('9001', '请提供要查询的订单种类'));
    }
};

//订单详情
module.exports.orderDetail = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var orderId = req.query['orderid'];
    var type = req.query['type'];
    var promise = null;

    switch (type) {
        case 'gift':
            promise = api.order.giftOrderInfo(unionid, orderId);
            break;
        case 'mall':
            promise = api.order.mallOrderInfo(unionid, orderId);
            break;
        case 'commodity' :
            promise = null;
            break;
    }

    if (promise) {
        promise.then(function (data) {
            res.json(data)
        }).fail(function (err) {
            next(err);
        });
    } else {
        next(new api.error.ApiError('9001', '请提供要查询的订单种类'));
    }
};

var base64toBuffer = function (base64) {
    var base64Buffer = null;
    if (base64) {
        base64 = base64.split(",")[1];
        if (base64) {
            base64Buffer = new Buffer(base64, 'base64');
        }
    }
    return base64Buffer;
};

/**
 * 礼品订单退款申请
 * @param req
 * @param res
 * @param next
 * @param orderId 订单号
 * @param type 订单类型
 * @param reason 退货原因
 * @param remark 备注
 * @param image1 图片1
 * @param content1 图片1 mime type
 * @param image2 图片2
 * @param content2 图片2 mime type
 * @param image3 图片3
 * @param content3 图片3 mime type
 */
module.exports.orderCancel = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var orderId = req.body['orderId'];
    var type = req.body['type'];
    var reason = req.body['reason'];
    var remark = req.body['remark'];

    var image1 = {
        buffer: base64toBuffer(req.body['image1']),
        filename: 'image1',
        content_type: req.body['content1']
    };
    var image2 = {
        buffer: base64toBuffer(req.body['image2']),
        filename: 'image2',
        content_type: req.body['content2']
    };
    var image3 = {
        buffer: base64toBuffer(req.body['image3']),
        filename: 'image3',
        content_type: req.body['content3']
    };

    api.order.orderCancel(unionid, type, orderId, reason, remark, image1, image2, image3).then(function (data) {
        res.json(data)
    }).fail(function (err) {
        next(err);
    });
};

/**
 * 退款详情
 * @param req
 * @param res
 * @param next
 */
module.exports.orderCancelDetail = function (req, res, next) {
    var orderId = req.query['orderid'];

    api.order.orderCancelDetail(orderId).then(function (data) {
        res.json(data)
    }).fail(function (err) {
        next(err);
    });
};