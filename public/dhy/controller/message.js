/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/12/2
 * Time: 16:55
 * 我的消息
 * */
'use strict';
define(function (require, exports, module){
    module.exports= function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        App.getJSON("message/omit",function(res){
            console.log(res);
            if(res.code=="0000"){
                App.render({
                    url:_this.RouterTmpUrl,
                    data:{title:_this.RouterTitle,data:res.data},
                    _this:_this
                });
            }
        });
    };
});
