/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/11
 * Time: 16:12
 * 兑换红包
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
        }).component.formInputChange();
        //监听提交按钮
        App.component.listenSubmitBtn({form:"#myUnionAccountForm",inputs:".myUnionAccount-input",submitBtn:"#myUnionAccountFormSubmit"});
        //券码兑换
        var couponInput=$("#couponCode");
        var submitBtn=$("#myUnionAccountFormSubmit");
        submitBtn.on("click",function(){
            var _couponCode=couponInput.val();
            if(!/^\s*$/g.test(_couponCode)){
                App.getJSON("account/honebao?code="+_couponCode,function(res){
                    if(res.code=="0000" && res.data){
                        switch (res.data.status){
                            case 1:
                                App.Popover.confirm("兑换成功!","","查看明细","马上花掉",true,function(){
                                    location.href="#/redList";
                                },function(){
                                    location.href="#/pointsExchange";
                                });
                                break;
                            case 2:
                                App.Popover.weak({txt:"该兑换码已使用!"});
                                break;
                            case 3:
                                App.Popover.weak({txt:"该兑换码已作废!"});
                                break;
                            case 4:
                                App.Popover.weak({txt:"该兑换码未生效!"});
                                break;
                            case 5:
                                App.Popover.weak({txt:"该兑换码已过期!"});
                                break;
                            case 6:
                                App.Popover.weak({txt:"您已达兑换上限!"});
                                break;
                            case 7:
                                App.Popover.weak({txt:"兑换码错误,请重新输入"});
                                break;
                            default:
                                App.Popover.weak({txt:"未知错误"});
                        }

                    }
                });
            }else{
                App.Popover.weak({txt:"请正确输入兑换码"});
            }

        });
    };
});
