/**
 * Created by 沐沐 on 2015-11-09.
 */
var api = require('api');


//联通用户效验
module.exports.validate = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var phone = req.query['phone'];

    api.unicom.validate(unionid, phone).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    })
};

//查询联通积分
module.exports.integration = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var phone = req.query['phone'];

    api.unicom.integration(unionid, phone).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    })
};

//联通积分兑换
module.exports.exchange = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var phone = req.query['phone'];
    var integral = req.query['integral'];
    var type = req.query['type'];
    var promise = null;
    switch (type) {
        case '1'://积分换积分
            promise = api.unicom.exchangeIntegral(unionid, phone, integral);
            break;
        case '2'://积分换红包
            promise = api.unicom.exchangeHongbao(unionid, phone, integral);
            break;
    }
    if (promise) {
        promise.then(function (data) {
            res.json(data);
        }).fail(function (err) {
            next(err);
        });
    } else {
        next(new api.error.ApiError('9999', '缺少积分兑换类型参数'));
    }
};