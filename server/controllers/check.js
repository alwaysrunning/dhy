/**
 * Created by 沐沐 on 2015-10-22.
 */

var api = require('api');
var q = require('q');

module.exports.check = function (req, res, next) {
    var openid = req.cookies['openid'];
    var unionid = req.cookies['unionid'];
    var localUrl = req.body['url'] || '';//req.protocol+"://"+req.get('host')+req.originalUrl+'codeUserInfo?goUrl='+goUrl;
    var tokenid = req.cookies['tokenid'] || '';
    var sup = req.body['sup'] || '';
    
    // 判断是否从超级app过来的
    if(tokenid && tokenid !== undefined && /superapp/ig.test(tokenid) && sup === 'super'){
        return q.fcall(function () {
            res.cookie('islogin', true, {
                httpOnly: true
            });

            res.cookie('tokenid', tokenid, {
                httpOnly: false
            });

            res.json({
                message: 'check ok',
                code: '0000',
                redirectUrl: ''
            });
        });
    }

    // 先登录超级app，然后再登录小步之家
    if(openid && unionid && tokenid && tokenid !== undefined && /superapp/ig.test(tokenid)){
        return q.fcall(function () {
            res.json({
                message: 'login',
                code: '2222'   //  请重新登录
            });
        });
    }

    if (openid && unionid && openid !== 'undefined' && unionid !== 'undefined') {
        //api.user.mobile(unionid),检查登录是否过期
      q.all([
        api.request.getTokens(unionid),
        api.user.mobile(unionid)
      ]).spread(function(tokens){

            res.cookie('islogin', true, {
                httpOnly: true
            });

            res.cookie('tokenid', tokens.tokenId , {
                httpOnly: false
            });

            res.json({
                message: 'check ok',
                code: '0000',
                redirectUrl: ''
            });
        }).fail(function(){

            res.cookie('islogin', false, {
                httpOnly: true
            });

            res.clearCookie('tokenid');

            res.json({
                message: 'not login',
                code: '200010002',
                redirectUrl: ''
            });
        });

    } else {
        //重新获取权限url
        res.json({
            message: 'openid miss',
            code: '9999',
            redirectUrl: api.weixin.getOpenUrl('/weixin', {
                url: encodeURIComponent(localUrl)
            })
        });

    }
};