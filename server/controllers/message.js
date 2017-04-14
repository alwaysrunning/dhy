/**
 * Created by 沐沐 on 2015-10-27.
 * 消息控制器
 */

var api = require('api');

//消息总数
module.exports.count = function (req, res, next) {
    var unionid = req.cookies['unionid'];

    api.message.messageCount(unionid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//消息分类一览（最后一条消息汇总）
module.exports.omitMessages = function (req, res, next) {
    var unionid = req.cookies['unionid'];

    api.message.omitMessages(unionid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//消息列表
module.exports.message = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var page = req.query['page'] || 0;
    var pageSize = req.query['pagesize'] || 20;
    var type = req.query['type'];

    api.message.messageList(unionid, page, pageSize, type).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//设置已读标记（参数不传默认全部已读）
module.exports.read = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var type = req.query['type'];
    var id = req.query['id'];

    api.message.mark(unionid, type, id).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

//清除消息（参数不传默认全部清除）
module.exports.clean = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var type = req.query['type'];
    var id = req.query['id'];

    api.message.clean(unionid, type, id).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

