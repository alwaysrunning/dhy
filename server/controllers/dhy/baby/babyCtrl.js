/**
 * Created by ricopter@qq.com on 2016/11/11.
 * 母婴控制器
 */
'use strict';
var api = require('api');

module.exports.improveMember = function (req, res, next) {
    res.render('dhy/baby/improveMember', {title: '母婴完善会员信息'});
};
