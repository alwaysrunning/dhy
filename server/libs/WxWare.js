/**
 * Created by ricopter@qq.com on 2016/10/23.
 * 微信openid token检测
 */
'use strict';
var Q = require('q');
var api = require("api");
var CurrConfig =api.config();
/**
 * 微信openid unionid 检查写入cookie中间件
 * @param req
 * @param res
 * @param next
 */
module.exports.checkWare = function (req, res, next) {

    var openid = req.cookies['openid'];
    var unionid = req.cookies['unionid'];
    var hashUrl =req.cookies['currhash']||'#/login?reLogin=1&channel=V0101';//针对SPA应用回调地址
    var redirectUri = "";
    var isHome=/^\/{1}$/ig.test(req.originalUrl);

    if(req.originalUrl.search(/\?+/ig) == -1 && isHome){
        redirectUri = req.protocol + "://" + req.get('host') + req.originalUrl + hashUrl;//  #/memberCenter
    }else{
        redirectUri = req.protocol + "://" + req.get('host') + req.originalUrl;  //
    }
    //todo 读取返回当前用户所在地址 回调页面
    console.log(isHome,req.originalUrl,"====checkWare redirectUri=====", redirectUri);
    //忽略微信环境
    if(CurrConfig.weixin.ignore && !openid && !unionid){
        openid=CurrConfig.weixin.testCode.openid;
        unionid=CurrConfig.weixin.testCode.unionid;
    }

    if (openid && unionid && openid !== 'undefined' && unionid !== 'undefined') {
        //openid 存在则判断是否登录
        Q.all([
            api.request.getTokens(unionid)
        ]).spread(function ( tokens) {
            console.log("====spread=====",tokens);
            //api tokens
            res.cookie('tokenid', tokens.tokenId, {
                httpOnly: false
            });

            res.cookie('unionid', unionid || openid, {
                httpOnly: false
            });

            res.cookie('openid', openid, {
                httpOnly: false
            });

            res.cookie('islogin', true, {
                httpOnly: false
            });

            next();

        }).fail(function () {

            res.cookie('islogin', false, {
                httpOnly: false
            });


            next();
        })

    } else {
        res.clearCookie('islogin');
        res.clearCookie('tokenid');

        //创建网页授权url获取code
        var _redirectUrl = api.weixin.getOpenUrl('/wxCode', {
            goUrl: encodeURIComponent(redirectUri)
        });
        console.log("====web auth redirectUri=====", redirectUri);

        res.redirect(_redirectUrl);
    }
};

module.exports.getAuthWx = function (req, res, next){

};


