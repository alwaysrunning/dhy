/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/4
 * Time: 16:12
 * 商户订单
 * */
'use strict';
define(function (require, exports, module){
    module.exports= function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        App.getJSON("order/search?page=1&pagesize=1&status=0&type=commodity",function(res){
            console.log(res);
        });
        App.render({
            url:_this.RouterTmpUrl,
            data:{title:_this.RouterTitle},
            _this:_this
        });
    };
});
