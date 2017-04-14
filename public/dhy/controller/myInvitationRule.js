/**
 * Created by 沐沐 on 2016-01-28.
 */
'use strict';
define(function (require, exports, module) {
    module.exports=function () {
        if(!App.pageAuth()){
            return false;
        }
        var _this = this;
        App.render({
            url: _this.RouterTmpUrl,
            data: {
                title: _this.RouterTitle
            },
            _this: _this
        });
    };
});