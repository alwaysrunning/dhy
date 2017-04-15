/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/10/27
 * Time: 10:58
 * 重置手机号码
 * */
'use strict';
define(function (require, exports, module) {
    module.exports= function(){
        var _this=this;
        if(!App.pageAuth()){
            return false;
        }
        var oldMobile=App.getParam("mobile")||App.component.storageGet("localMobile").val;
        App.render({
            url:this.RouterTmpUrl,
            data:{title:this.RouterTitle,oldMobile:oldMobile},
            _this:this
        }).component.formInputChange();

        var submitBtn=$("#submitBtn");
        var captcha=$("#captcha");
        var oldMoblie=$("#oldMobile");
        var oldcaptcha="";

        var newMobileSubmitBtn=$("#newMobileSubmitBtnRest"),
            newCaptcha=$("#newCaptcha"),
            newMobile=$("#newMobile"),
            newSendSmsBtn=$("#getNewSms");
        //登录按钮监听
        function listenLoginBtn(obj,_mobileInput,_captchaInput,loginBtn){
            function checkInput(){
                var _captchaVal=_captchaInput.val();
                var _mobileInputVal=_mobileInput.val();
                if(_captchaVal.length>0 && _mobileInputVal.length>0){
                    loginBtn.removeAttr('disabled');
                }else{
                    loginBtn.attr('disabled',"");
                }
            }
            obj.on("input",function(){
                checkInput()
            });
            obj.find(".icon-guanbi").on("touchstart.gb",function(){
                checkInput()
            });
        }
        listenLoginBtn($("#restSetPhoneForm"),oldMoblie,captcha,submitBtn);
        listenLoginBtn($("#restSetPhoneForm2"),newMobile,newCaptcha,newMobileSubmitBtn);
        //发送旧手机短信
        var sendSmsBtn=$("#getSms");
        sendSmsBtn.on("click",function(){
            var _oldMoblie=oldMoblie.data("oldmoblie");
            App.getJSON("account/sms?mobile="+_oldMoblie+"&type=update_mobile",function(res){
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
        //提交旧手机号码短信
        submitBtn.on("click",function(){
            var _oldMoblie=oldMoblie.data("oldmoblie");
            oldcaptcha=captcha.val();
            if(!/^[0-9]{6}$/.test(oldcaptcha)){
                App.Popover.weak({txt:"验证码错误，请正确输入6位数字验证码！"});
            }else{
                App.getJSON("account/verify?mobile="+_oldMoblie+"&captcha="+oldcaptcha+"&type=update_mobile",function(res){
                    if(res.code="0000"){
                        $("#stepOne").hide();
                        $("#stepTwo").show().toggleClass("fadeInRight");
                    }
                });
            }
            return false;
        });

        //发送新手机号码短信
        newMobile.on("input propertychange",function(){
            if(/^[0-9]{11}$/.test($(this).val())){
                newSendSmsBtn.removeAttr('disabled');
            }else{
                newSendSmsBtn.attr('disabled',"");
            }
        });
        $("#newsMobileClose").on("tap",function(){
            newSendSmsBtn.attr('disabled',"");
        });

        newSendSmsBtn.on("click",function(){
            var _newMobile=newMobile.val();
            App.getJSON("account/sms?mobile="+_newMobile+"&type=update_mobile",function(res){
                if(res.code=="0000") {
                    var count = res.data.next;
                    var timer = setInterval(function () {
                        if (count > 0) {
                            count--;
                            newSendSmsBtn.html('获取验证码(' + count + ')').attr('disabled',"");
                        } else {
                            clearInterval(timer);
                            count = 0;
                            newSendSmsBtn.html('获取验证码').removeAttr('disabled');
                        }
                    }, 1000);
                    App.Popover.weak({txt:"验证码已发送成功，10分钟内有效，请注意查收"});
                }
            });
        });

        //提交新手机号码和短信
        newMobileSubmitBtn.unbind().on("click",function(){
            var _newMobile=newMobile.val(),_newCaptcha=newCaptcha.val();
            if(!/^[0-9]{6}$/.test(_newCaptcha)){
                App.Popover.weak({txt:"验证码错误，请正确输入6位数字验证码！"});
            }else{
                App.getJSON("account/updatemobile?mobile="+_newMobile+"&captcha="+_newCaptcha+"&captchaOld="+oldcaptcha,function(res){
                    $("input").blur();
                    App.Popover.weak({txt:res.message,callback:function(){
                        window.location.href="#/memberCenter";
                    }});
                });
            }

            return false;
        });

    };
});
