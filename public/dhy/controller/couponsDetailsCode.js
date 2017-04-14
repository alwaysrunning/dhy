/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/4
 * Time: 16:12
 * 优惠券详情 二维码
 * */
'use strict';
define(function (require, exports, module) {
    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        var _code=App.getParam("code");
        App.render({
            url:_this.RouterTmpUrl,
            data:{title:_this.RouterTitle,code:_code},
            _this:_this
        });
    };
});
