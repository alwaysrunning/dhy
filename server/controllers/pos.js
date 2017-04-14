/**
 * Created by 沐沐 on 2015-11-24.
 */
var api = require('api');

//小票列表
module.exports.posList = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var page = req.query['page'];
    var pageSize = req.query['pagesize'];
    var beginTime = req.query['begin'];
    var endTime = req.query['end'];

    api.pos.posNum(unionid, page, pageSize, beginTime, endTime).then(function (data) {
        res.json(data)
    }).fail(function (err) {
        next(err);
    });
};

//小票详情
module.exports.posDetail = function (req, res, next) {
    var txnId = req.query['txnId'];

    api.pos.posDetail(txnId).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};