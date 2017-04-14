/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/4
 * Time: 16:12
 * 我的优惠券
 * */
'use strict';
define(function (require, exports, module) {
    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        var channel = App.getParam('channel');
        App.getJSON("coupon/count",function(res){
            App.render({
                url:_this.RouterTmpUrl,
                data:{title:_this.RouterTitle,data:res,channel:channel},
                _this:_this
            });
            //商场·梅溪新天地
            $("#mxhShop").on("tap",function(){
                location.href="/easy/jump?url="+decodeURIComponent(App.thirdHost.ry.host+"api/bubugao/kabaw");
            })
        });
    };
});
