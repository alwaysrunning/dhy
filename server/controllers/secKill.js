/**
 * Created by 沐沐 on 2015-09-11.
 */

var apis = require('api');
var q = require('q');

module.exports.init = function (req, res, next) {
    var activeId = req.query['active'];//活动标识 1 2 3
    var cityId = req.query['cityId'];
    q.all([
        apis.store.advert("109"),//广告位置id
        apis.kill.points(activeId, cityId)
    ]).spread(function (adList, points) {
        res.render('secKill/secKill', {
            serverTime: Date.now(),
            timePoint: points,
            activeId: activeId,//['2015-09-30 00:00:00','2015-09-30 12:00:00','2015-09-30 16:00:00']
            adList:adList.data
        });
    }).fail(function (err) {
        next(err)
    });
};

module.exports.gift = function (req, res, next) {
    var activeId = req.params['active'];
    var time = req.query['time'];
    var page = req.query['page'];
    var pageSize = req.query['pageSize'];
    var cityId = req.query['cityId'];
    apis.kill.gift(activeId, time, page, pageSize, cityId).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        err.json = true;
        next(err);
    });
};

module.exports.mobile = function (req, res, next) {
    var mobile = req.body['mobile'];
    if (mobile && mobile !== '') {
        apis.kill.mobile(mobile).then(function (data) {
            if (data.code === '0000') {
                data.message = '号码提交成功';
            }
            res.json(data);
        }).fail(function (err) {
            err.json = true;
            next(err)
        })
    } else {
        var err = new apis.error.ApiError('9999', '请输入手机号码');
        err.json = true;
        next(err);
    }
};