/**
 * Created by 沐沐 on 2015-12-01.
 */
var express = require('express');
var api = require('api');
var app = express();
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
    //console.log(app.get('env'),api.config());
    if(app.get('env')=="production"){
        //简单安全加密认证
        var code=req.query["code"];
        var safeCode = api.config().weixin.accessTokenSecret;
        if(code==safeCode){
            api.weixin.getToken().then(function (data) {
                res.jsonp(data);
            }).fail(function (err) {
                next(err);
            });
        }else{
            res.jsonp({
                code:999,
                message:"非法请求"
            });
        }
    }else{
        api.weixin.getToken().then(function (data) {
            res.jsonp(data);
        }).fail(function (err) {
            next(err);
        });
    }
};

