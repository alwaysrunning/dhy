/**
 * Created by ricopter@qq.com on 2016/11/24.
 * 积分使用规则
 */
'use strict';
var api = require('api');

module.exports.rulePage = function (req, res, next) {

    api.login.licenses("JFGZ").then(function (data) {

        res.render('dhy/module/pointsRule', {
            title: '积分使用规则',
            data:data.data||""
        });

    }).fail(function (err) {
        next(err);
    });
};