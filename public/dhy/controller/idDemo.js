/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/3
 * Time: 16:08
 * 身份证上传示例
 * */
'use strict';
define(function (require, exports, module) {
    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        App.render({
            url:this.RouterTmpUrl,
            data:{title:this.RouterTitle},
            _this:this
        });
    };
});