/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/10/22
 * Time: 9:49
 * 用户协议
 * */
'use strict';
define(function (require, exports, module) {
    module.exports=function(){
        var _this=this;
        App.getJSON("licenses",function(res){
            App.render({
                url:_this.RouterTmpUrl,
                data:{title:_this.RouterTitle,data:res.data},
                _this:_this
            });
        });
    };
});