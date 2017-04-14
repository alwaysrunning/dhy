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
        App.getJSON("account/user",function(res){
            if(res.data.isAccountActive){
                App.render({
                    url:_this.RouterTmpUrl,
                    data:{title:_this.RouterTitle,data:res.data},
                    _this:_this
                });
                //快捷支付
                $("#quickPay").on("tap",function(){
                    location.href="#/dev";
                });
                //自助积分
                $("#selfPoints").on("tap",function(){
                    location.href="#/selfPoints";
                });
                //商场·梅溪新天地
                $("#mxhShop").on("tap",function(){
                    location.href="/easy/jump?url="+decodeURIComponent(App.thirdHost.ry.host+"api/bubugao/kabaw");
                })
            }else{
                App.Popover.normal("请先完善个人信息","知道了",true,function(){
                    window.location.href="#/personalInfo?mobile="+res.data.mobile;
                });
            }
        });
    };
});
