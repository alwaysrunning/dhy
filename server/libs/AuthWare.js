/**
 * Created by ricopter@qq.com on 2016/11/11.
 * 权限中间件
 */
'use strict';
var Q = require('q');
var api = require("api");
var url = require('url');
/**
 * 处理登录拦截
 */
module.exports.checkLogin = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];
    var channel = req.query["channel"];

    var currPathName=req._parsedOriginalUrl.path;//url.parse(req.originalUrl).pathname
    var localUrl = req.protocol+"://"+req.headers.host+ currPathName;

    if(unionid && unionid.length>0) {
        api.user.mobile(unionid).then(function () {
            next();
        }).fail(function () {
            //not login
            var loginUrl="";
            if(channel){
              loginUrl = req.protocol+"://"+ req.headers.host + "/#/login?channel="+channel+"&fromUrl=" + encodeURIComponent(localUrl);
            }else{
              loginUrl = req.protocol+"://"+ req.headers.host + "/#/login?fromUrl=" + encodeURIComponent(localUrl);
            }

            res.redirect(loginUrl);
        });
    }else{
        //throw new api.error.ApiError('9001', '缺少参数');//失败返回的错误信息  req.protocol+"://"+req.headers.host+req.originalUrl
        var _wxAuthUrl=api.weixin.getOpenUrl('/weixin', {
            url: encodeURIComponent(encodeURIComponent(localUrl))
        });
        res.redirect(_wxAuthUrl);
    }
};
/**
 * 判断是否登录 promise
 * @param req
 * @param res
 * @param next
 */
module.exports.authLoginWare = function (req, res, next) {
  var unionid = req.cookies['unionid'];
  var openid = req.cookies['openid'];
  if(unionid && unionid.length>0){
    api.user.mobile(unionid).then(function (data) {
      next();//成功返回的数据
    }).fail(function (err) {
      next(new api.error.ApiError('9999', '非法请求'));
    });
  }else{
    next(new api.error.ApiError('9001', '非法请求缺少参数'));//失败返回的错误信息
  }
};
/**
 * 判断是否登录 promise
 * @param req
 * @param res
 * @param next
 */
module.exports.authIsLogin = function (req, res, next) {
    var deferred = Q.defer();
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];
    if(unionid && unionid.length>0){
        api.user.mobile(unionid).then(function (data) {
            deferred.resolve(data);//成功返回的数据
        }).fail(function (err) {
            deferred.reject(err);//失败返回的错误信息
        });
    }else{
        deferred.reject(new api.error.ApiError('9001', '缺少参数'));//失败返回的错误信息
    }
    return deferred.promise;//必须返回这个
};