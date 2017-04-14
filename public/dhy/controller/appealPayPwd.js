/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/10/22
 * Time: 9:49
 * 支付密码申诉 #/appealPayPwd?mobile=14789997615
 * */
'use strict';
define(function (require, exports, module) {
    module.exports=function () {
        if(!App.pageAuth()){
            return false;
        }
        var _this = this;
        var _mobile = App.getParam("mobile") || App.component.storageGet("localMobile").val;
        var _mobileStr = _mobile.replace(/(\d{3})\d{6}(\d{2})/, "$1********$2");
        var _regPwd=/^[\w]{6,20}$/;
        var _regId=/(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
        //申诉状态
        App.getJSON("account/userappealpaypassstatus", function (resData) {

            if (resData.data.status == 0) {
                App.render({
                    url: _this.RouterTmpUrl,
                    data: {title: _this.RouterTitle, mobileStr: _mobileStr},
                    _this: _this
                }).component.formInputChange();
                //监听提交按钮
                App.component.listenSubmitBtn({
                    form: "#stepOne .u-form",
                    inputs: ".u-listen-input",
                    submitBtn: "#nextStep"
                });
                App.component.listenSubmitBtn({
                    form: "#stepTwo",
                    inputs: ".u-listen-input",
                    submitBtn: "#submitBtn"
                });

                var stepOne = $("#stepOne");
                var stepTwo = $("#stepTwo");
                //发送重置支付手机短信
                var sendSmsBtn = $("#getSms");
                sendSmsBtn.on("click", function () {
                    App.getJSON("account/sms?mobile=" + _mobile + "&type=update_paypass_complaint", function (res) {
                        if (res.code == "0000") {
                            var count = res.data.next;
                            var timer = setInterval(function () {
                                if (count > 0) {
                                    count--;
                                    sendSmsBtn.html('获取验证码(' + count + ')').attr('disabled', "");
                                } else {
                                    clearInterval(timer);
                                    count = 0;
                                    sendSmsBtn.html('获取验证码').removeAttr('disabled');
                                }
                            }, 1000);
                            App.Popover.weak({txt: "验证码已发送成功，10分钟内有效，请注意查收"});
                        }
                    });
                });
                //下一步
                var nextBtn = $("#nextStep");
                nextBtn.unbind().on("click", function () {
                    var _captcha = $("#getSmsVal").val();
                    App.getJSON("account/verify?mobile=" + _mobile + "&captcha=" + _captcha + "&type=update_paypass_complaint", function (res) {
                        App.Popover.weak({
                            txt: res.message, callback: function () {
                                stepOne.hide();
                                stepTwo.show();
                            }
                        });
                    })
                });

                var complaintForm = $("#stepTwo .u-form");
                var complaintSubmitBtn = $("#submitBtn");
                var page = $('#stepTwo');

                //检测输入状态
                //function checkInput() {
                //    var _inputArr = page.find(".u-listen-input");
                //    var _inputSize = _inputArr.size();
                //    var _tmpNum = 0;
                //    for (var i = 0; i < _inputSize; i++) {
                //        if ($(_inputArr[i]).data("mark") == true) {
                //            _tmpNum++;
                //        }
                //    }
                //    if (_tmpNum >= _inputSize) {
                //        complaintSubmitBtn.removeAttr('disabled');
                //    } else {
                //        complaintSubmitBtn.attr('disabled', "");
                //    }
                //}

                complaintSubmitBtn.on('click', function () {
                    var _payPass=$("#newPayPwd").val();
                    var _myID=$("#myID").val();
                    if(!_regPwd.test(_payPass)){

                        App.Popover.weak({txt:"原支付密码错误,密码应为6-20位英文、数字下划线符号，请重新输入"});

                    }else if(!_regId.test(_myID)){

                        App.Popover.weak({txt:"身份证号码错误,请重新输入"});

                    }else if(_regPwd.test(_payPass) && _regId.test(_myID)){

                        var _data = new FormData(complaintForm[0]);

                        _data.append('smscode', $("#getSmsVal").val());

                        App.ajaxJSON({
                            url: "account/userappealpaypass",
                            type: "POST",
                            //dataType: 'json',
                            contentType: false,
                            processData: false,
                            data: _data,
                            success: function (res){
                                if(res.code == "0000"){
                                    App.Popover.normal(res.message, "知道了");
                                    location.href = '#/login';
                                }
                            }
                        });
                    }


                    return false;
                });


            } else if (resData.data.status == 1) {
                //正在申诉
                App.Popover.weak({
                    txt: "您的申诉已提交过了,审核需要2~3个工作日,申诉审核通过后,您可使用新支付密码!", callback: function () {
                        location.href = "#/memberCenter";
                    }
                });
            }
        });
    };
});
