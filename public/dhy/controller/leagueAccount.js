/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/10
 * Time: 16:12
 * 联盟账户
 * */
'use strict';
define(function (require, exports, module) {
    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        App.render({
            url:_this.RouterTmpUrl,
            data:{title:_this.RouterTitle},
            _this:_this
        });
    };
});
