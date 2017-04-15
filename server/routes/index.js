var express = require('express');
var q = require('q');
var router = express.Router();

var api = require('api');
var logs = require('logs').logs;
var WxWareCtrl= require("../libs/WxWare");
var logsErr = logs.recordCate("err");//记录错误

router.get('/easy/jump', function (req, res, next) {
    var url = req.query['url'];
    var unionid = req.cookies['unionid'];

    if (!url) {
        next(new api.error.ApiError('9999', '回调地址是必须的'));
    }

    if (!!unionid && unionid !== 'undefined') {
        api.easy.easy_token(unionid).then(function (data) {
            if (data.data && data.data.token) {
                res.redirect(url + (url.indexOf('?') > 0 ? '&' : '?') + 'token=' + data.data.token);
            } else {
                throw new api.error.ApiError('9999', '返回值异常');
            }
        }).fail(function (err) {
            next(url);
        });
    } else {
        var jumpUrl = encodeURIComponent('http://' + api.config().api.useHost + '/easy/jump?url=' + encodeURIComponent(url));
        res.redirect(api.weixin.getOpenUrl('/weixin', {
            url: jumpUrl
        }));
    }
});

router.get('/tuju/jump', function (req, res, next) {
    var url = req.query['url'];
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];
    var parkid = req.query['parkid'];

    if (!url) {
        next(new api.error.ApiError('9999', '回调地址是必须的'));
    }

    if (!!unionid && unionid !== 'undefined' && !!openid && openid !== 'undefined') {
        api.tuju.tuju_token(unionid, openid, parkid).then(function (data) {
            if (data.data) {
                res.redirect(url + (url.indexOf('?') > 0 ? '&' : '?') + 'key=' + data.data);
            } else {
                throw new api.error.ApiError('9999', '返回值异常');
            }
        }).fail(function (err) {
            next(err);
        });
    } else {
        var jumpUrl = encodeURIComponent('http://' + api.config().api.useHost + '/tuju/jump?url=' + encodeURIComponent(url));
        res.redirect(api.weixin.getOpenUrl('/weixin', {
            url: jumpUrl
        }));
    }
});

router.get('/weixin',function (req, res, next) {
    var code = req.query['code'];
    var url = req.query['url'] || '';
    //console.warn("==wx==",req,url);
     //code换取网页授权access_token 拉取用户信息
    q.all([api.weixin.access_token(), api.weixin.open_id(code)]).spread(function (access, openid) {
        return api.weixin.user_info(access.access_token, openid.openid, true);
    }).then(function (data) {
        console.log("==cookie set==",data,process.env.dev);

       if(process.env.devStyle && process.env.devStyle=="out"){

            //外包开发环境
            res.cookie('unionid', data.unionid || data.openid, {
                domain:".dhy.com",
                httpOnly: false
            });
            res.cookie('openid', data.openid, {
                domain:".dhy.com",
                httpOnly: false
            });

        }else{

            res.cookie('unionid', data.unionid || data.openid, {
                httpOnly: true
            });
            res.cookie('openid', data.openid, {
                httpOnly: true
            });
        }

    }).fail(function (err) {
        res.clearCookie('unionid');
        res.clearCookie('openid');
    }).finally(function () {
        console.log("==weiXin finally url==",url);
        if(url){
            res.redirect(url);
        }else{
            res.json({
                code:"999",
                msg:"url in not here"
            });
        }
    });
});

/**
 * 微信code回调页面写入cookie
 */
router.get('/wxCode',function (req, res, next) {
    var code = req.query['code'];
    var goUrl = req.query['goUrl'] || '';

    if(code){
        //code换取网页授权access_token 拉取用户信息
        q.all([api.weixin.access_token(), api.weixin.open_id(code)]).spread(function (access, openid) {
            return api.weixin.user_info(access.access_token, openid.openid, true);
        }).then(function (data) {
            console.log("==cookie set==",data,process.env.dev);

            res.cookie('unionid', data.unionid || data.openid, {
                httpOnly: true
            });
            res.cookie('openid', data.openid, {
                httpOnly: true
            });

        }).fail(function (err) {
            res.clearCookie('islogin');
            res.clearCookie('unionid');
            res.clearCookie('openid');
        }).finally(function () {
            console.log("==weiXin finally url==",goUrl);
            if(goUrl){
                res.redirect(goUrl);
            }else{
                res.json({
                    code:"999",
                    msg:"goUrl in not here"
                });
            }
        });
    }else{
        next(new Error('师傅！微信获取code失败'));
    }
});

// router.get('/wxOauth',function (req, res, next){
//     var goUrl = req.query['goUrl']||"";
//
// });

//大会员入口 WxWareCtrl.checkWare
router.get('/',function (req, res, next) {
    res.render('dhy/index', {title: '步步高', dev: process.env.dev});
});

module.exports = router;
