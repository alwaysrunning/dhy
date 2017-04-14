/**
 * Created by 沐沐 on 2016-01-27.
 * 邀请模块控制器
 */

var api = require('api');

//我的邀请码信息
module.exports.invitationGet = function (req, res, next) {
    var unionid = req.cookies['unionid'];

    api.invitation.invitationGet(unionid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

module.exports.invitationList = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var page = req.query['page'];
    var pageSize = req.query['pagesize'];

    api.invitation.invitationList(unionid, page, pageSize).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

module.exports.invitationSubmit = function (req, res, next) {
    var invitationCode = req.body['invitationCode'];
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];

    api.weixin.access_token().then(function (data) {
        return api.weixin.user_info(data.access_token, openid);
    }).then(function (data) {
        var name = data.nickname || '小步之家';
        var headimgurl = data.headimgurl ? encodeURIComponent(data.headimgurl) : undefined;

        return api.invitation.invitationSubmit(unionid, invitationCode, headimgurl, name);
    }).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

module.exports.shareSubmit = function(req, res, next){
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];

    api.weixin.access_token().then(function (data) {
        return api.weixin.user_info(data.access_token, openid);
    }).then(function (data) {
        var name = data.nickname || '小步之家';
        var headimgurl = data.headimgurl ? encodeURIComponent(data.headimgurl) : undefined;

        return api.invitation.shareSubmit(unionid,headimgurl,name);
    }).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};