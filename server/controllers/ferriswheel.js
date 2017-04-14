/**
 * Created by 沐沐 on 2015-07-31.
 */

var api = require('api');

module.exports.draw = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var activityid = req.query['activityid'];
    var cityid = req.query['cityid'];
    api.ferrisWheel.draw(unionid, activityid, cityid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        err.json = true;
        next(err);
    });
};

module.exports.info = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var lat = req.query['lat'];
    var lng = req.query['lng'];
    var code = req.query['code'];
    api.ferrisWheel.info(unionid, lat, lng, code).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        err.json = true;
        next(err);
    });
};

module.exports.share = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var activityid = req.query['activityid'];
    api.ferrisWheel.share(unionid, activityid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        err.json = true;
        next(err);
    });
};