/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/10/26
 * Time: 16:12
 * 订单付款-付款码0 扫码1
 * */
'use strict';
define(function (require, exports, module) {
    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        var _type=App.getParam("type")||"0";
        var _payMoney=App.getParam("payMoney")||"";
        var formUrl=App.getParam("fromUrl");
        //查询红包余额
        App.getJSON("account/balance",function(red){
            var _redBalance=red.data.GBBALANCE;
            App.render({
                url:_this.RouterTmpUrl,
                data:{title:_this.RouterTitle,orderType:_type,redBalance:_redBalance,payMoney:_payMoney},
                _this:_this
            }).component.formInputChange();
            //监听提交按钮
            App.component.listenSubmitBtn({form:"#orderPayment",inputs:"input",submitBtn:"#orderPayBtn"});

            var payPwdMod=$("#payPwdMod");
            var orderPayBtn=$("#orderPayBtn");
            var payMoney=$("#payMoney");
            var payPwdInput=$("#payPwd");
            var regPwd=/^[\w]{6,20}$/;
            var regMoney=/^(\d{1,5}\.\d{1,2}|\d{1,5})$/;
            var payType="";
            //支付方式
            App.component.singleSelect({
                wrap:"#payType .u-normal-list",
                callback:function(){
                    if(arguments[0]=="4"){
                        payPwdMod.addClass("u-hidden");
                    }else{
                        payPwdMod.removeClass("u-hidden");
                    }
                    payType=arguments[0];
                }
            });
            var test=110200;
            console.log(regMoney.test(test),"===",test);
            //提交
            orderPayBtn.on("click",function(){
                var _payPwd=payPwdInput.val();
                var _payamt=payMoney.val();

                if(!regPwd.test(_payPwd)){

                    App.Popover.weak({txt:"密码应为6-20位英文、数字下划线符号，请重新输入"});

                }else if(!regMoney.test(_payamt)){

                    App.Popover.weak({txt:"请正确输入支付金额(保留小数点两位),最大金额为:99999"});

                }else if(regMoney.test(_payamt) && regPwd.test(_payPwd) && (_payamt>_redBalance)){

                    App.Popover.weak({txt:"您当前的余额不足以完成本次支付!",callback:function(){
                        if(formUrl){
                            if(formUrl.indexOf("?")==-1){
                                window.location.href=decodeURIComponent(formUrl);
                            }else{
                                window.location.href=decodeURIComponent(formUrl);
                            }
                        }
                    }});

                }else if(regMoney.test(_payamt) && regPwd.test(_payPwd) && (_payamt<=_redBalance)){

                    var payPassBool=App.component.storageGet("payPass");
                    if(payPassBool){
                        if(_type=="0" && payType=="2"){
                            //付款码+红包支付
                            App.postJSON("paypass/barcode",{
                                "payamt":_payamt,
                                "payPwd":_payPwd
                            },function(res){
                                console.log(res.data);
                                App.Popover.weak({
                                    txt:"操作成功",
                                    callback:function(){
                                        var _code=res.data.BARCODE;
                                        window.location.href="#/orderPayCode?code="+_code;
                                    }
                                });
                            })
                        }else if(_type=="1" && payType=="2"){
                            //扫码付+红包支付
                            var _scanCodeOrder=App.component.storageGet("scanCodeOrder");
                            App.postJSON("paypass/apporderpay",{
                                "storeId":_scanCodeOrder.payeeId,
                                "orderNo":_scanCodeOrder.orderCode,
                                "txamt":_payamt,
                                "payPwd":_payPwd,
                                "payType":"2"
                            },function(scanPayData){
                                App.component.storageDel("scanCodeOrder");
                                App.Popover.confirm("你已经成功支付红包:"+_payamt,"","返回会员中心","查看红包明细",true,function(){
                                    window.location.href="#/memberCenter";
                                },function(){
                                    window.location.href="#/redList";
                                });
                            })
                        }
                    }else{
                        App.Popover.confirm("你尚未设置支付密码,请先设置","","取消","确定",true,function(){

                        },function(){
                            window.location.href="#/resetPayPwd";
                        });
                    }
                }

            });
        });

    };
});
