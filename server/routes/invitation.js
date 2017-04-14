/**
 * Created by 沐沐 on 2016-01-28.
 */
var express = require('express');
var q = require('q');
var router = express.Router();

var api = require('api');

router.get('/scan/:invitationCode', function (req, res, next) {
    var invitation = req.params['invitationCode'];

    var code = req.query['code'];

    if (code) {
        q.all([
            api.weixin.access_token(),
            api.weixin.open_id(code)
        ]).spread(function (access, openid) {
            return api.weixin.user_info(access.access_token, openid.openid);
        }).then(function (data) {
            var name = data.nickname || '小步之家';
            var headimgurl = data.headimgurl ? encodeURIComponent(data.headimgurl) : '';

            return api.user.mobile(data.unionid).then(function (mobile) {
                return api.invitation.invitationScan(data.openid, invitation, headimgurl, name, mobile.data.mobile).then(function () {
                    res.render('dhy/invitationStatus', {
                        success: true
                    });
                });
            }, function () {
                return api.invitation.invitationScan(data.openid, invitation, headimgurl, name).then(function () {
                    res.render('dhy/invitationStatus', {
                        success: false
                    });
                });
            });
        }).fail(function (err) {
            if (err.type === 'wechat' && err.code === 40029) {
                res.redirect(api.weixin.refresh(req));
            }
            res.render('dhy/invitationStatus', {
                success: false,
                msg: err.message || false
            });
        });
    } else {
        res.redirect(api.weixin.refresh(req));
    }
});

router.get('/share/:invitationCode', function (req, res, next) {
    var invitation = req.params['invitationCode'];
    api.invitation.shareList(invitation, 1, 5).then(function (data) {
        res.render('dhy/invitationShare', {
            data: data.data
        });
    }).fail(function (err) {
        next(err)
    });
});

module.exports = router;