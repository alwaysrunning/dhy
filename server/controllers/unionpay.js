/**
 * Created by 沐沐 on 2015-11-11.
 */
var api = require('api');

module.exports.verify = function (req, res, next) {
    var bankno = req.query['bankno'];
    var unionid = req.cookies['unionid'];

    api.unionpay.verify(unionid, bankno).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

module.exports.cardList = function (req, res, next) {
    var unionid = req.cookies['unionid'];

    api.unionpay.cardList(unionid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

module.exports.exchange = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var bankno = req.query['bankno'];
    var integal = req.query['integal'];
    var type = req.query['type'];
    var promise = null;
    switch (type) {
        case '1'://积分换积分
            promise = api.unionpay.exchangeIntegral(unionid, integal, bankno);
            break;
        case '2'://积分换红包
            promise = api.unionpay.exchangeHongbao(unionid, integal, bankno);
            break;
    }
    if(promise){
        promise.then(function (data) {
            res.json(data);
        }).fail(function (err) {
            next(err);
        });
    }else{
        next(new api.error.ApiError('9999', '缺少积分兑换类型参数'));
    }
};