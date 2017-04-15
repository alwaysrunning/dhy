/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/10/22
 * Time: 9:49
 * 登录模块
 * */
'use strict';
define(function (require, exports, module) {
    module.exports = function () {
        var getCookie=App.component.getCookie;
        var fromUrl = App.getParam("fromUrl");
        var withUser = App.getParam('withUser');
        var channel = App.getParam('channel')||"V0101";
        var muYin=false;//母婴标识

        if(channel){
            channel =channel.toLocaleUpperCase();
            App.component.storageSet({
                key: "channel",
                val: channel
            });
            App.component.setCookie("channel",channel)
        }
        //channel
        if (!!channel) {
            console.log("==channel==ok",channel);
            if(channel=="V0115" || channel=="v0115"){
                muYin=true;
            }
            App.component.storageSet({
                key: 'channel',
                val: channel
            });
            App.component.setCookie("channel",channel)
        } else {
            console.log("==channel==error");
            App.component.storageSet({
                key: 'channel',
                val: 'V0101'
            });
            App.component.setCookie("channel",'V0101')
        }
        App.render({
            url: this.RouterTmpUrl,
            data: {title: this.RouterTitle,muYin:muYin},
            _this: this
        }).component.formInputChange();

        var sendSmsBtn = $("#sendSms");
        var loginBtn = $("#loginBtn");
        var _mobileInput = $("#mobile");
        var _captchaInput = $("#captcha");
        var Store = new App.store();
        var _formHistorySlider = App.component.formHistorySlider();
        //console.log("~~~~~~~",getCookie("tokenid"));
        //发送验证码提前验证
        _mobileInput.on("input propertychange", function () {
            if (/^[0-9]{11}$/.test(_mobileInput.val())) {
                sendSmsBtn.removeAttr('disabled').removeClass("u-disabled");
            } else {
                sendSmsBtn.attr('disabled', "").addClass("u-disabled");
            }
        });
        $("#mobileClose").on("tap", function () {
            sendSmsBtn.attr('disabled', "").addClass("u-disabled");
        });

        //判断是否登录
        var loginBool = Store.check("LoginBool");
        var _reLogin = App.getParam("reLogin");
        var _reChanel= App.component.storageGet("channel");

        if(_reChanel){
            _reChanel= _reChanel.toLocaleUpperCase();
        }

        //如果之前登录过超级APP，则删除里面存的tokenid值
        var superTokenid = getCookie("tokenid");
        if(superTokenid && superTokenid !== undefined && /superapp/ig.test(superTokenid)){
            App.component.delCookie("tokenid");
        }

        //更新频道id
        if (!fromUrl && (loginBool && loginBool.val == true) && !_reLogin) {
            location.href = "#/memberCenter?channel="+_reChanel;
        }else if(fromUrl && (loginBool && loginBool.val == true) && !_reLogin && (withUser !== '1')){
            //已登录的用户
            location.href = decodeURIComponent(fromUrl);
        }

        // if(muYin){
        //     $("#checkbox_a1").on("click",function () {
        //         var _check=$(this).is(':checked');
        //         if(_check){
        //             $(this).data("mark", "1");
        //             loginBtn.removeAttr('disabled');
        //         }else{
        //             $(this).data("mark", "0");
        //             loginBtn.attr('disabled', "");
        //         }
        //     })
        // }
        //监听提交按钮
        App.component.listenSubmitBtn({form: "#loginForm", inputs: "input", submitBtn: "#loginBtn"});
        //发送短信
        sendSmsBtn.on("click", function () {
            var _mobile = _mobileInput.val();
            var _$this = $(this);
            if (!_$this.hasClass("u-disabled")) {
                if (!/^[0-9]{11}$/.test(_mobile)) {
                    App.Popover.weak({txt: "请正确输入手机号码"});
                } else {
                    App.getJSON("account/sms?mobile=" + _mobile + "&type=login", function (res) {
                        if (res.code == "0000") {
                            var count = res.data.next;
                            var timer = setInterval(function () {
                                if (count > 0) {
                                    count--;
                                    _$this.html('获取验证码(' + count + ')').attr('disabled', "").addClass("u-disabled");
                                } else {
                                    clearInterval(timer);
                                    count = 0;
                                    _$this.html('获取验证码').removeAttr('disabled').removeClass("u-disabled");
                                }
                            }, 1000);
                            App.Popover.weak({txt: "发送短信成功"});
                        }
                    })
                }
            }
        });
        //登录
        loginBtn.on("click", function () {
            var _mobile = _mobileInput.val();
            var _captcha = _captchaInput.val();
            var _disabled = $(this).attr("disabled");
            var _loginKey=getCookie("_o2ouk");
            var _tokenSession=getCookie("tokenid");

            console.log("==_tokenSession===",_tokenSession);

            if (!/^[0-9]{6}$/.test(_captcha)) {
                App.Popover.weak({txt: "验证码错误，请正确输入6位数字验证码！"});
            } else {
                if (!_disabled) {
                    console.log(channel);
                    App.postJSON("loginV2", {
                        mobile: _mobile,
                        captcha: _captcha,
                        channel: _reChanel,
                        tokenSession:_tokenSession,
                        loginKey:_loginKey
                    }, function (res) {
                        console.log("==channel==",channel);
                        //console.log(res);
                        if (res.code == "0000") {
                            Store.set("LoginBool", true);
                            App.component.storageSave({
                                key: "formHistorySlider",
                                val: _mobile
                            });

                            App.component.storageSet({
                                key: "accountId",
                                val: res.data.accountId
                            });

                            if(muYin){
                                App.component.storageSet({
                                    key: "babyNewUser",
                                    val: res.data.babyNewUser
                                });
                            }

                            //Store = null;
                            $("input").blur();
                            //新会员邀请码判断
                            if (res.data && res.data.newUser) {
                                App.Popover.confirm(
                                    "<div class='u-yqcode-tip'><input class='u-yqcode-inputTxt' type='text' id='yqCode' name='yqCode' placeholder='输入邀请码'><p>助力我的邀请人，7天内有效哦！</p></div>",
                                    "<div class='u-yqcode-hd'><div class='umh-lf'>邀请码</div><div class='umh-rg' id='ythClose'><span class='u-popup-close icon iconfont icon-danchuangguanbi'></span></div></div>",
                                    "<div style='color:#333'>不填</div>",
                                    "提交",
                                    true,
                                    function () {
                                        //取消
                                        $("#confirmModal").removeClass("u-yqcode-modal");
                                        var jumpUrl = '';
                                        //附加用户信息
                                        if (fromUrl && withUser === '1') {
                                            location.href = 'http://' + window.location.host + '/easy/jump?url=' + fromUrl;
                                        }else if (fromUrl){
                                            if(muYin && res.data.babyNewUser){
                                                jumpUrl = "/dhy/baby/improveMember?fromUrl="+fromUrl;

                                            } if(channel=="012838" && !res.data.bindingLicensePlate){
                                                jumpUrl = "/park/perfectCarInfo/"+channel+"?fromUrl="+fromUrl;

                                            }else{
                                                jumpUrl = decodeURIComponent(fromUrl);
                                            }
                                        }else {
                                            if(muYin && res.data.babyNewUser){
                                                jumpUrl = "/dhy/baby/improveMember";
                                            } if(channel=="012838" && !res.data.bindingLicensePlate){
                                                jumpUrl = "/park/perfectCarInfo/"+channel;
                                            }else{
                                                jumpUrl =  "#/memberCenter?channel="+_reChanel;
                                            }
                                        }
                                        location.href = jumpUrl;
                                    },
                                    function (uMask,confirmModal,cancelBtn) {
                                        //确认
                                        //alert("确认...");
                                        var reTurnTips="stop";

                                        var invitationCode = $("#yqCode").val();
                                        if (/^\d{6}$/g.test(invitationCode)) {

                                            $("#confirmModal").removeClass("u-yqcode-modal");

                                            App.ajaxJSON({
                                                type:"post",
                                                url:"invitation/submit",
                                                data:{"invitationCode": invitationCode},
                                                success: function(resYq){
                                                    //200010005 签名无效状态
                                                    //手动关闭遮罩邀请弹窗
                                                    uMask.removeClass("u-mask-active");
                                                    confirmModal.removeClass("u-modal-active");
                                                    cancelBtn.unbind("confirmBtn");

                                                    App.Popover.weak({
                                                        txt: resYq.message || "提交邀请码成功", callback: function () {
                                                            var jumpUrl = '';
                                                            if (fromUrl && withUser === '1') {
                                                                jumpUrl = 'http://' + window.location.host + '/easy/jump?url=' + fromUrl;
                                                            } else if (fromUrl) {
                                                                if(muYin && res.data.babyNewUser){
                                                                    jumpUrl = "/dhy/baby/improveMember?fromUrl="+fromUrl;
                                                                } if(channel=="012838" && !res.data.bindingLicensePlate){
                                                                    jumpUrl = "/park/perfectCarInfo/"+channel+"?fromUrl="+fromUrl;
                                                                }else{
                                                                    jumpUrl = decodeURIComponent(fromUrl);
                                                                }
                                                            }else {
                                                                if(muYin && res.data.babyNewUser){
                                                                    jumpUrl = "/dhy/baby/improveMember";
                                                                } if(channel=="012838" && !res.data.bindingLicensePlate){
                                                                    jumpUrl = "/park/perfectCarInfo/"+channel;
                                                                }else{
                                                                    jumpUrl = "#/memberCenter?channel="+_reChanel;
                                                                }
                                                            }
                                                            location.href = jumpUrl;
                                                        }
                                                    });

                                                },
                                                error:function(xhr, type){
                                                    App.Popover.weak({
                                                        txt: JSON.parse(xhr.response).message
                                                    });
                                                }
                                            });

                                        } else {
                                            App.Popover.weak({
                                                txt: "邀请码输入错误，请重新输入"
                                            });
                                            return reTurnTips;
                                        }
                                    },
                                    function () {
                                        $("#confirmModal").addClass("u-yqcode-modal");
                                        $("#ythClose").on("click", function () {
                                            $("#confirmModalFooter").find("span[data-u-modal-cancel]").triggerHandler("click");
                                        })
                                    },
                                    "open"
                                );
                            } else {
                                //alert("==no new user!==");
                                var _jumpUrl="";
                                if (fromUrl) {
                                    var deCodeUrl = decodeURIComponent(fromUrl);
                                    //附加用户信息
                                    if (withUser === '1') {
                                        _jumpUrl = 'http://' + window.location.host + '/easy/jump?url=' + fromUrl;
                                    } if(muYin && res.data.babyNewUser){
                                        _jumpUrl = "/dhy/baby/improveMember?fromUrl="+fromUrl;

                                    } if(channel=="012838" && !res.data.bindingLicensePlate){
                                        _jumpUrl = "/park/perfectCarInfo/"+channel+"?fromUrl="+fromUrl;
                                    }else{
                                        _jumpUrl  = deCodeUrl;
                                    }
                                } else {
                                    if(muYin && res.data.babyNewUser){
                                        _jumpUrl = "/dhy/baby/improveMember";
                                    } if(channel=="012838" && !res.data.bindingLicensePlate){
                                        _jumpUrl = "/park/perfectCarInfo/"+channel;
                                    }else{
                                        _jumpUrl = "#/memberCenter?channel="+_reChanel;
                                    }
                                }

                                location.href = _jumpUrl;
                            }
                        }
                    });
                }
            }

            return false;
        });
        //监听验证码输入
        _captchaInput.on("input propertychange", function () {
            var _val = $(this).val();
            if (_val.length == 6) {
                //关闭软键盘
                $(this).focus();
                $(this).blur();
            }
        })
    };
});
