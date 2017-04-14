/**
 * Created by 沐沐 on 2015-12-01.
 */

var api = require('api');

//
module.exports.sign = function (req, res, next) {
    var url = decodeURIComponent(req.query['url']);

    api.weixin.sign(url).then(function (data) {
        res.jsonp(data);
    }).fail(function (err) {
        next(err);
    });
};
//
module.exports.ticket = function (req, res, next) {
    api.weixin.getTicket().then(function (data) {
        res.jsonp(data);
    }).fail(function (err) {
        next(err);
    });
};
//
module.exports.accessToken = function (req, res, next) {
    api.weixin.getToken().then(function (data) {
        res.jsonp(data);
    }).fail(function (err) {
        next(err);
    });
};

