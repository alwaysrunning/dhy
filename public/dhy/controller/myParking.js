/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2016/4/6
 * Time: 10:42
 * 我的停车
 * */
'use strict';
define(function (require, exports, module) {
    module.exports = function () {
        if (!App.pageAuth()) {
            return false;
        }
        var _this = this;
        var shop = App.component.storageGet('channel');
        if(shop=="V0115" || shop=="V0101"){
            shop="";
        }
        App.render({
            url: _this.RouterTmpUrl,
            data: {
                title: _this.RouterTitle,
                shop: shop ? '?channel=' + shop : '',
                channel:shop
            },
            _this: _this
        });
    };
});
