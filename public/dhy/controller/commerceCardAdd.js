/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2016/3/31
 * Time: 9:12
 * 我的商务卡--绑卡
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
            App.component.listenSubmitBtn({form:"#myUnionAccountForm",inputs:".myUnionAccount-input",submitBtn:"#myCommerceCardFormSubmit"});

            $('#myCommerceCardFormSubmit').on("click",function(){
                var _cardNo=$("#cardNo").val();
                var _cardPwd=$("#cardPwd").val();
                var reg=/^[0-9a-zA-Z]+$/g;//只能是数字或者字母 或数字和字母组合

                if(reg.test(_cardNo)){
                    App.Popover.weak({txt:"输入有误！请正确输入银行卡号/步步高商务卡号"});
                }

                //todo 商务卡绑定接口
                //App.getJSON('unionpay/verify?bankno='+_bankno,function(res){
                //    console.log(res);
                //    if(res.code=="0000" && res.data["vip"]==1){
                //        App.Popover.weak({
                //            txt:res.message,
                //            callback:function(){
                //            window.location.href="#/commerceCardList";
                //        }});
                //    }else if(res.code=="0000" && res.data["vip"]==0){
                //        //App.Popover.weak({txt:"验证失败！当前验证的手机号码与银联会员预留手机号码不匹配"});
                //        //App.Popover.normal("验证失败！当前验证的手机号码与银联会员预留手机号码不匹配","知道了",true);
                //    }
                //});
            });
        }
    };
});