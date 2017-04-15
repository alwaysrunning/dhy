/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/10/26
 * Time: 16:12
 * 账户资料
 * */
'use strict';
define(function (require, exports, module){

    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        var _reChanel= App.component.storageGet("channel");
        App.getJSON("account/info",function(res){
            console.log(res);
            App.render({
                url:_this.RouterTmpUrl,
                data:{title:_this.RouterTitle,data:res},
                _this:_this
            });
            App.component.storageSet({key:"payPass","val":res.meber?res.meber.payPass:""});
            //退出账户
            $("#loginOut").on("tap",function(){
                location.href="#/login?reLogin=1&channel="+_reChanel;
            });
        });
    };
});
