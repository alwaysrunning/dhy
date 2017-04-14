/**
 * Created by 沐沐 on 2015-12-18.
 */
var api = require('api');

var _cipherKey = undefined;

//生成付款码
module.exports.barcode = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var payamt = req.body['payamt'];
    var payPwd = req.body['payPwd'];

    api.paypass.barcode(unionid, payamt, payPwd).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//查询付款码状态
module.exports.barcodeStatus = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var barcode = req.query['barcode'];

    api.paypass.barcodeStatus(unionid, barcode).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//根据扫描商户码得到的order查询
module.exports.apporder = function (req, res, next) {
    var orderId = req.query['orderid'];

    api.paypass.apporder(orderId).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//使用红包付款
module.exports.apporderSave = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var storeId = req.body['storeId'];
    var orderNo = req.body['orderNo'];
    var txamt = req.body['txamt'];
    var bizType = req.body['bizType'];
    var payPwd = req.body['payPwd'];
    var cipherKey = _cipherKey;
    var payType = req.body['payType'];

    api.paypass.apporderSave(unionid, storeId, orderNo, txamt, bizType, payPwd, cipherKey, payType).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};