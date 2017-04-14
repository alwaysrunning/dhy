/**
 * Created by ricopter@qq.com on 2017/1/18.
 * 伊利相关控制器
 */
'use strict';
var api = require('api');
var q = require('q');

module.exports.authUrl=function (req, res, next) {
  var unionid = req.cookies['unionid'];
  var openid = req.cookies['openid'];

  api.thirdParty.authYiLiUrl(unionid).then(function (data) {
    //console.log("==authYiLiUrl==",data);
    res.redirect(data.data.redirectUrl)
  }).fail(function (err) {
    next(err);
  });
};