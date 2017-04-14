/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/4
 * Time: 16:12
 * 我的资产
 * */
'use strict';
define(function (require, exports, module) {
    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        var point = App.getParam('point')||"";
        var channel = App.getParam('channel')||App.component.storageGet("channel")||"V0101";
        App.render({
            url:_this.RouterTmpUrl,
            data:{title:_this.RouterTitle,data:{point:point,channel:channel}},
            _this:_this
        });
    };
});
