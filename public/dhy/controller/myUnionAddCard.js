/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/10
 * Time: 16:12
 * 我的银联账户--绑卡
 * */
'use strict';
define(function (require, exports, module) {
    module.exports= function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        var Store=new App.store();
        var _phone=Store.get("localMobile").val;
        if(!_phone){
            window.location.href="#/login";
        }else{
            App.render({
                url:_this.RouterTmpUrl,
                data:{title:_this.RouterTitle,mobile:_phone},
                _this:_this
            }).component.formInputChange();
            //监听提交按钮
            App.component.listenSubmitBtn({form:"#myUnionAccountForm",inputs:".myUnionAccount-input",submitBtn:"#myUnionAccountFormSubmit"});

            $('#myUnionAccountFormSubmit').on("click",function(){
                var _bankno=$("#bankCardNumber").val();
                App.getJSON('unionpay/verify?bankno='+_bankno,function(res){
                    console.log(res);
                    if(res.code=="0000" && res.data["vip"]==1){
                        window.location.href="#/myUnionAccount";
                    }else if(res.code=="0000" && res.data["vip"]==0){
                        App.Popover.weak({txt:"验证失败！当前验证的手机号码与银联会员预留手机号码不匹配"});
                        //App.Popover.normal("验证失败！当前验证的手机号码与银联会员预留手机号码不匹配","知道了",true);
                    }
                });
            });
        }
    };
});
