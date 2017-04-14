/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/10/27
 * Time: 10:58
 * 账户安全
 * */
'use strict';
define(function (require, exports, module) {
    module.exports= function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        var _payPass=App.component.storageGet("payPass");//是否设置支付密码
        var _accountId=App.component.storageGet("accountId");

        App.getJSON("account/paySignParam",function(res) {
            App.render({
                url: _this.RouterTmpUrl,
                data: {title: _this.RouterTitle, data: res.data},
                _this: _this
            });
        });
        //var _siebelId=App.component.storageGet("siebelId");
        // App.getJSON("account/userappealpaypassstatus",function(res){
        //     var _appeal=res.data.status;//申诉状态
        //     App.render({
        //         url:_this.RouterTmpUrl,
        //         data:{title:_this.RouterTitle,payPass:_payPass,appeal:_appeal,accountId:_accountId},
        //         _this:_this
        //     });
        // });
    };
});
