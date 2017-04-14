/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2016/3/31
 * Time: 10:28
 * */
'use strict';
define(function (require, exports, module) {
    module.exports = function () {
        var _this = this;
        App.render({
            url: _this.RouterTmpUrl,
            data: {title: _this.RouterTitle},
            _this: _this
        });
    }
});