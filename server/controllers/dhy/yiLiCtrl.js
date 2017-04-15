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
  var jumpUrl= decodeURIComponent(req.query["jumpUrl"]);
  var redirectUrl="";
  //encodeURIComponent decodeURIComponent

  api.thirdParty.authYiLiUrl(unionid).then(function (data) {
    //console.log("==authYiLiUrl==",data);
    if(jumpUrl.indexOf("?")!==-1){
      redirectUrl=jumpUrl+"?Authkey="+data.data.authkey;
    }else{
      redirectUrl=jumpUrl+"&Authkey="+data.data.authkey;
    }
    res.redirect(redirectUrl);
  }).fail(function (err) {
    next(err);
  });
};