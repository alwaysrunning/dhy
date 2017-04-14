/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2016/3/24
 * Time: 14:09
 * 扫一扫积分
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
        var _cardNo=App.getParam("cardno");

        App.getJSON("account/pointIncrease?cardno="+_cardNo,function(pa){
            App.Popover.confirm("",pa.message,"查看明细","马上花掉",true,function(){
                location.href="#/pointsList"
            },function(){
                location.href="#/pointsExchange";
            });
        })
    }
});