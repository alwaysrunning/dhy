/**
 * Created by 沐沐 on 2015-10-22.
 */
var api = require('api');

module.exports.login = function (req, res, next) {
    //console.log("====weixin======",process.env.dev,req.cookies['unionid'],req.cookies['openid']);
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];
    var mobile = req.body['mobile'];
    var captcha = req.body['captcha'];
    var channel = req.body['channel'];

    if (mobile && captcha && unionid && openid) {

        api.login.login(unionid, openid, mobile, captcha, channel).then(function (data) {
           // res.json(data);
            return api.request.getTokens(unionid || openid).then(function (tokens) {
                console.log("==login getTokens==",tokens);
                return {
                    userData:data,
                    tokens:tokens
                }
            });

        }).then(function (data) {

            res.cookie('tokenid', data.tokens.tokenId, {
                httpOnly: true
            });

            res.json(data.userData);

        }).fail(function (err) {
            next(err);
        });

        // api.login.login(unionid, openid, mobile, captcha, channel).then(function (data) {
        //     res.json(data);
        // }).fail(function (err) {
        //     next(err);
        // });
    } else {
        next(new api.error.ApiError('9001', '缺少参数'));
    }
};

module.exports.loginV2 = function (req, res, next) {
    //console.log("====weixin======",process.env.dev,req.cookies['unionid'],req.cookies['openid']);
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];
    var loginKey= req.body['loginKey']||req.cookies['_o2ouk'];

    var mobile = req.body['mobile'];
    var captcha = req.body['captcha'];
    var channel = req.body['channel'];
    var tokenSession =req.body['tokenSession']||req.cookies['tokenid'];

    if (mobile && captcha && unionid && openid) {

        api.login.loginV2(unionid, openid, mobile, captcha, channel,loginKey,tokenSession).then(function (data) {

            return api.request.getTokens(unionid || openid).then(function (tokens) {
                console.log(tokens,"==login getTokens==",data);
                return {
                    userData:data,
                    tokens:tokens
                }
            });

        }).then(function (data) {

            res.cookie('tokenid', data.tokens.tokenId, {
                httpOnly: false
            });

            res.cookie('islogin', true, {
                httpOnly: true
            });

            res.json(data.userData);

        }).fail(function (err) {

            res.cookie('islogin', true, {
                httpOnly: false
            });

            next(err);
        });

    } else if( (!mobile || !captcha ) && (unionid && openid)) {
        next(new api.error.ApiError('9001', '缺少手机或者验证码'));
    }else if(!unionid || !openid){
        next(new api.error.ApiError('9001', '缺少微信Id参数,请重新进入'));
    }
};

module.exports.sms = function (req, res, next) {
    var mobile = req.query['mobile'];
    if (mobile) {
        api.account.sms(mobile, 'login').then(function (data) {
            res.json(data);
        }).fail(function (err) {
            next(err);
        });
    } else {
        next(new api.error.ApiError('9001', '缺少参数'));
    }
};

//注册协议
module.exports.licenses = function (req, res, next) {
    api.login.licenses().then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//更新渠道id
module.exports.updateChannel=function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];

    var channel= req.body["channel"]||"V0101";

    if (unionid && openid  && channel) {
        api.login.updateChannel(unionid,channel).then(function (data) {
            res.json(data);
        }).fail(function (err) {
            next(err);
        });
    } else {
        next(new api.error.ApiError('9001', '缺少参数'));
    }
};
