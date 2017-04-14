/**
 * Created by 沐沐 on 2015-11-09.
 */

var api = require('api');

//优惠券列表
module.exports.coupons = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var page = req.query['page'];
    var pageSize = req.query['pagesize'];
    var status = req.query['status'];
    var type = req.query['type'];
    var promise = null;

    switch (type) {
        case 'siebel':
            promise = api.coupons.couponSiebel(unionid, status, page, pageSize);
            break;
        case 'member':
            promise = api.coupons.couponMember(unionid, status, page, pageSize);
            break;
        case 'mall':
            promise = api.coupons.couponMall(unionid, status, page, pageSize);
            break;
        case 'third':
            promise = api.coupons.couponThird(unionid, status, page, pageSize);
            break;
    }
    if (promise) {
        promise.then(function (data) {
            res.json(data);
        }).fail(function (err) {
            next(err);
        })
    } else {
        next(new api.error.ApiError('9999', '缺少优惠券类型参数'));
    }
};

//优惠券详情
module.exports.couponDetail = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var couponId = req.query['couponid'];
    var giftId = req.query['giftid'];
    var codeId = req.query['codeid'];
    var type = req.query['type'];
    var promise = null;

    switch (type) {
        case 'third':
            promise = api.coupons.couponThridDetail(unionid, giftId, codeId);
            break;
        case 'member':
            promise = api.coupons.couponMemberDetail(couponId);
            break
    }

    if (promise) {
        promise.then(function (data) {
            res.json(data);
        }).fail(function (err) {
            next(err);
        });
    } else {
        next(new api.error.ApiError('9999', '缺少优惠券类型参数'));
    }
};

//优惠券数量统计
module.exports.couponCount = function (req, res, next) {
    var unionid = req.cookies['unionid'];

    api.coupons.countAll(unionid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};