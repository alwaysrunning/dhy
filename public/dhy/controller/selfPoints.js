/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2016/3/24
 * Time: 10:11
 * 自助积分
 * */
'use strict';
define(function (require, exports, module) {
    module.exports= function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        App.render({
            url:_this.RouterTmpUrl,
            data:{title:_this.RouterTitle},
            _this:_this
        });
        //扫码付
        App.component.scanCodePay({
            app:App,
            trriger:"#scanPoints",
            callback:function(result){
                var _cardNo = result.split("=")[1];
                location.href="#/scanPoints?cardno="+_cardNo;
            }
        });
    };
});