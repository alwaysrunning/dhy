/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/10/26
 * Time: 17:02
 * 账户申诉
 * */
'use strict';
define(function (require, exports, module) {
    module.exports = function () {
        //App.pageAuth();
        App.render({
            url: this.RouterTmpUrl,
            data: {title: this.RouterTitle},
            _this: this
        }).component.formInputChange();

        var sendSmsBtn = $("#getSms"),
            complaintForm = $("#complaintForm"),
            complaintSubmitBtn = $("#complaintSubmitBtn"),
            oldMobile = $("#oldMobile"),
            captcha = $("#captcha"),
            idCode = $("#idCode"),
            newMobile = $("#newMobile"),
            page = $('.m-complaint-page');
        //检测输入状态
        function checkInput() {
            var _inputArr = page.find("input");
            var _inputSize = _inputArr.size();
            var _tmpNum = 0;
            for (var i = 0; i < _inputSize; i++) {
                if ($(_inputArr[i]).data("mark") == true) {
                    _tmpNum++;
                }
            }
            if (_tmpNum >= _inputSize) {
                complaintSubmitBtn.removeAttr('disabled');
            } else {
                complaintSubmitBtn.attr('disabled', "");
            }
        }


        //监听提交按钮
        App.component.listenSubmitBtn({form: "#complaintForm", inputs: "input", submitBtn: "#complaintSubmitBtn"});
        //发送新手机号码短信
        newMobile.on('input propertychange', function () {
            if ($(this).val().length == 11 && oldMobile.val().length == 11) {
                sendSmsBtn.removeAttr('disabled').removeClass("u-disabled");
            } else {
                sendSmsBtn.attr('disabled', "").addClass("u-disabled");
            }
        });
        oldMobile.on('input propertychange', function () {
            if ($(this).val().length == 11 && newMobile.val().length == 11) {
                sendSmsBtn.removeAttr('disabled').removeClass("u-disabled");
            } else {
                sendSmsBtn.attr('disabled', "").addClass("u-disabled");
            }
        });
        sendSmsBtn.on("click", function () {
            var _newMobile = newMobile.val();
            var _$this = $(this);
            if (!_$this.hasClass("u-disabled")) {
                App.getJSON("account/sms?mobile=" + _newMobile + "&type=update_mobile_complaint", function (res) {
                    if (res.code == "0000") {
                        var count = res.data.next;
                        var timer = setInterval(function () {
                            if (count > 0) {
                                count--;
                                sendSmsBtn.html('获取验证码(' + count + ')').attr('disabled', "").addClass("u-disabled");
                            } else {
                                clearInterval(timer);
                                count = 0;
                                sendSmsBtn.html('获取验证码').removeAttr('disabled').removeClass("u-disabled");
                            }
                        }, 1000);
                        App.Popover.weak({txt: "验证码已发送成功，10分钟内有效，请注意查收"});
                    }
                });
            }
        });
        //提交
        complaintSubmitBtn.on("click", function () {
            var _data = new FormData(complaintForm[0]);

            App.ajaxJSON({
                url: "account/userappealphone",
                type: "POST",
                //dataType: 'json',
                contentType: false,
                processData: false,
                data: _data,
                success: function (res) {
                    if (res.code == "0000") {
                        // App.Popover.normal("申诉成功，您可使用新手机号登录！", "知道了");
                        App.Popover.normal("您的账号申诉提交成功，审核需要2~3个工作日。", "知道了");
                        location.href = '#/login';
                    }
                }
            });
            return false;
        });
    };
});