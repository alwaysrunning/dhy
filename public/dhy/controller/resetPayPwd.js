/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/12/18
 * Time: 17:35
 * */
'use strict';
define(function (require, exports, module) {
    module.exports= function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        var _mobile=App.component.storageGet("localMobile").val||"";
        var _mobileStr=_mobile.replace(/(\d{3})\d{6}(\d{2})/,"$1********$2");
        var _restStatus=App.getParam("type")||"0";//"0"初次设置 "1"重置
        var _formUrl=App.getParam("fromUrl");
        var _password="";
        App.render({
            url:_this.RouterTmpUrl,
            data:{title:_this.RouterTitle,mobile:_mobileStr,restStatus:_restStatus},
            _this:_this
        }).component.formInputChange();
        //监听提交按钮
        App.component.listenSubmitBtn({form:"#restPayPwdForm",inputs:"input",submitBtn:"#restPayPwdBtn"});
        //发送重置支付手机短信
        var sendSmsBtn=$("#getSms");
        sendSmsBtn.on("click",function(){
            App.getJSON("account/sms?mobile="+_mobile+"&type=update_pay_password",function(res){
                if(res.code=="0000") {
                    var count = res.data.next;
                    var timer = setInterval(function () {
                        if (count > 0) {
                            count--;
                            sendSmsBtn.html('获取验证码(' + count + ')').attr('disabled',"");
                        } else {
                            clearInterval(timer);
                            count = 0;
                            sendSmsBtn.html('获取验证码').removeAttr('disabled');
                        }
                    }, 1000);
                    App.Popover.weak({txt:"验证码已发送成功，10分钟内有效，请注意查收"});
                }
            });
        });

        //提交新手机号码和短信
        var submitBtn=$("#restPayPwdBtn");
        submitBtn.unbind().on("click",function(){
            var _captcha=$("#getSmsVal").val();
            var _password1=$("#password1").val();
            var _password2=$("#password2").val();
            var _oriPayPass=$("#oriPayPass").val();
            var _payPass=$("#payPass").val();
            var regCaptcha=/^[0-9]{6}$/;
            var regPwd=/^[\w]{6,20}$/;

            switch (_restStatus){
                //初次设置密码
                case "0":
                    if(!regCaptcha.test(_captcha)){

                        App.Popover.weak({txt:"验证码错误，请正确输入6位数字验证码！"});

                    }else if(!regPwd.test(_password1) || !regPwd.test(_password2)){

                        App.Popover.weak({txt:"密码应为6-20位英文、数字下划线符号，请重新输入"});

                    }else if(regPwd.test(_password1) && regPwd.test(_password2) && _password1!==_password2){

                        App.Popover.weak({txt:"两次密码输入不一致，请重新输入"});

                    }else if(regCaptcha.test(_captcha) && regPwd.test(_password1) && regPwd.test(_password2) && _password1===_password2){

                        App.postJSON("account/setpaypass",{
                            "mobile":_mobile,
                            "captcha":_captcha,
                            "paypass":_password2
                        },function(res){
                            console.log(res);
                            $("input").blur();
                            App.Popover.weak({txt:res.message,callback:function(){
                                if(_formUrl){
                                    window.location.href=decodeURIComponent(_formUrl);
                                }else{
                                    window.location.href="#/memberCenter";
                                }
                            }
                            });
                        });
                    }
                    break;
                //更新支付密码
                case "1":

                    if(!regCaptcha.test(_captcha)){

                        App.Popover.weak({txt:"验证码错误,请正确输入6位数字验证码！"});

                    }else if(!regPwd.test(_oriPayPass)){

                        App.Popover.weak({txt:"原支付密码错误,密码应为6-20位英文、数字下划线符号，请重新输入"});

                    }else if(!regPwd.test(_payPass)){

                        App.Popover.weak({txt:"新支付密码错误,密码应为6-20位英文、数字下划线符号，请重新输入"});

                    }else if(regCaptcha.test(_captcha) && regPwd.test(_oriPayPass) && regPwd.test(_payPass)){

                        App.postJSON("account/updatepaypass",{
                            "paypass":_payPass,
                            "oripaypass":_oriPayPass,
                            "captcha":_captcha,
                            "phone":_mobile
                        },function(res){
                            App.Popover.weak({txt:res.message,callback:function(){
                                if(_formUrl){
                                    window.location.href=decodeURIComponent(_formUrl);
                                }else{
                                    window.location.href="#/memberCenter";
                                }
                            }});
                        });

                    }
                    break;
                default :
                    App.Popover.weak({txt:"设置支付密码类型不存在!"});
            }

            return false;
        });

    };
});