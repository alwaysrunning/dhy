/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/10
 * Time: 16:12
 * 积分明细
 * */
'use strict';
define(function (require, exports, module) {
    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        App.getJSON("account/integration/list?page=1&pagesize=10",function(res){
            App.render({
                url:_this.RouterTmpUrl,
                data:{title:_this.RouterTitle,data:res.data},
                _this:_this
            });
        });
    };
});