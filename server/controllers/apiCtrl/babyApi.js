/**
 * Created by ricopter@qq.com on 2016/11/11.
 * 母婴api相关
 */
'use strict';
var api = require('api');

/**
 * 母婴完善会员信息 post
 * @param req
 * @param res
 * @param next
 */
module.exports.saveMemberInfo = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];

    var sex=req.body["sex"];
    var birthday=req.body["birthday"];

    if (unionid && sex) {
        api.user.updateBabyMember(unionid, sex, birthday).then(function (data) {
            res.json(data);
        }).fail(function (err) {
            next(err);
        });
    }else{
        next(new api.error.ApiError('9001', '缺少参数'));
    }
};