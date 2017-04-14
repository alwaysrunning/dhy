/**
 * Created by ricopter@qq.com on 2016/12/8.
 */
'use strict';
(function ($) {

    function _Modal() {
        this.init();
    }

    _Modal.prototype = {
        init: function () {
            var _body = $("body");
            var _maskHtml = "<div class='u-mask' id='uMask'></div>";
            var _maskLoadingHtml = "<div class='u-mask' id='uLoadingMask'></div>";
            var _normalHtml = "<div class='u-modal u-modal-alert' id='normalAlert'><div class='u-modal-dialog'><div class='u-modal-bd' id='normalModalText'></div><div class='u-modal-footer'><span class='u-modal-btn' id='normalModalBtn'></span></div></div></div>";
            var _loadingHtml = "<div class='u-modal u-modal-confirm' id='loadingModal'><div class='u-modal-dialog yh-modal-dialog'><div class='u-modal-hd'><i class='u-preloader u-preloader-white'></i></div><div class='u-modal-bd u-modal-text-center' id='loadingText'></div></div></div>";
            var _confirmHtml = "<div class='u-modal u-modal-confirm' id='confirmModal'><div class='u-modal-dialog yh-modal-dialog'><div class='u-modal-hd' id='confirmModalHdText'></div><div class='u-modal-bd u-modal-text-center' id='confirmModalText'></div><div class='u-modal-footer' id='confirmModalFooter'><span class='u-modal-btn yh-modal-btn' data-u-modal-cancel></span> <span class='u-modal-btn yh-modal-btn' data-u-modal-confirm></span></div></div></div>";

            var _weakHtml = "<div id='weakAlert' class='u-modal u-modal-weak'><div class='u-weak-txt'></div></div>";

            _body.append(_maskLoadingHtml).append(_maskHtml).append(_loadingHtml).append(_normalHtml).append(_confirmHtml).append(_weakHtml);
            this.body = _body;
            this.uMask = $("#uMask");
        },
        destroy: function () {

        },
        weak: function (options) {
            var opts = {
                mod: "#weakAlert",
                txt: "",
                delay: 2000,
                callback: function () {
                }
            };
            $.extend(opts, options);
            var mod = $(opts.mod);
            var txt = mod.find(".u-weak-txt");
            txt.html(opts.txt);
            mod.addClass("u-modal-active");
            setTimeout(function () {
                mod.removeClass("u-modal-active");
                txt.html("");
                opts.callback();
            }, opts.delay);
        },
        normal: function (options) {
            var opts = {
                msg: "",
                msgBtn: "",
                alignCenter:"",
                callback: function () {}
            };
            $.extend(opts, options);

            var normalAlert = $("#normalAlert"),
                umbBtn = $("#normalModalBtn"),
                msgMod = $("#normalModalText"),
                _callback = opts.callback || function () {},
                uMask = $("#uMask");

            if (opts.alignCenter) {
                msgMod.addClass("u-align-center");
            }
            msgMod.html(opts.msg);
            umbBtn.html(opts.msgBtn);

            uMask.addClass("u-mask-active");
            normalAlert.addClass("u-modal-active");

            umbBtn.bind("click.umbBtn", function () {
                uMask.removeClass("u-mask-active");
                normalAlert.removeClass("u-modal-active");
                umbBtn.unbind();
                _callback();
            });

        },
        loading: function (options) {
            //msg, del
            var opts = {
                msg: "",
                del:false,
                callback: function () {}
            };
            $.extend(opts, options);

            var loadingModal = $("#loadingModal"),
                loadingText = $("#loadingText");
            //uMask=$("#uLoadingMask");
            if (!opts.del) {
                loadingText.html(opts.msg);
                //uMask.addClass("u-mask-active");
                loadingModal.addClass("u-modal-active");
                $(document).on('touchmove', function (e) {
                    e.preventDefault();
                });
            } else {
                loadingText.html(opts.msg);
                loadingModal.removeClass("u-modal-active");
                //uMask.removeClass("u-mask-active");
                $(document).off('touchmove');
            }
        },
        confirm: function (options) {
            //msg, msgHd, msgBtnCancel, msgBtnConfirm, alignCenter, cancelCallback, confirmCallback, callback,autoClose
            var opts = {
                msg: "",
                msgHd:"",
                msgHTML:"",
                msgBtnCancel:"取消",
                msgBtnConfirm:"确定",
                alignCenter:"",
                autoClose:"close",
                cancelCallback:function () {},
                confirmCallback:function () {},
                callback: function () {}
            };
            $.extend(opts, options);

            var confirmModal = $("#confirmModal"),
                confirmModalFooter = $("#confirmModalFooter"),
                msgMdoHd = $("#confirmModalHdText"),
                msgMod = $("#confirmModalText"),
                cancelBtn = confirmModalFooter.find("span[data-u-modal-cancel]"),
                confirmBtn = confirmModalFooter.find("span[data-u-modal-confirm]"),
                _callback = opts.callback || function () {},
                _cancelCallback = opts.cancelCallback || function () {},
                _confirmCallback = opts.confirmCallback || function () {},
                _autoClose=opts.autoClose,
                uMask = $("#uMask");

            if (opts.alignCenter) {
                msgMod.addClass("u-align-center");
            }
            msgMdoHd.html(opts.msgHd);
            if(opts.msgHTML){
                msgMod.empty().append(opts.msgHTML);
            }else{
                msgMod.html(opts.msg);
            }
            cancelBtn.html(opts.msgBtnCancel);
            confirmBtn.html(opts.msgBtnConfirm);

            uMask.addClass("u-mask-active");
            confirmModal.addClass("u-modal-active");

            cancelBtn.off().bind("click.cancelBtn", function () {
                uMask.removeClass("u-mask-active");
                confirmModal.removeClass("u-modal-active");
                cancelBtn.unbind("cancelBtn");
                _cancelCallback();
            });

            confirmBtn.off().bind("click.confirmBtn", function () {
                if(_autoClose=="close"){
                    uMask.removeClass("u-mask-active");
                    confirmModal.removeClass("u-modal-active");
                    cancelBtn.unbind("confirmBtn");
                    _confirmCallback();
                }else{
                    var tmpBool=_confirmCallback(uMask,confirmModal,cancelBtn);
                    if(tmpBool=="start"){
                        uMask.removeClass("u-mask-active");
                        confirmModal.removeClass("u-modal-active");
                        cancelBtn.unbind("confirmBtn");
                    }
                }
            });

            _callback();
        },
        popup: function (obj) {
            var opts = {
                title: "",
                html: "",
                callback: function () {
                }
            };
            $.extend(opts, obj);
            var _popupHtml = "";
            _popupHtml += "<div class='u-modal u-modal-list-exit u-modal-active' id='popupList'><div class='u-modal-dialog yh-modal-popup'><div class='u-popup-hd'><h3 class='u-popup-title'>";
            _popupHtml += opts.title + "</h3><span class='u-popup-close icon iconfont icon-danchuangguanbi'></span></div><div class='u-popup-bd'>";
            _popupHtml += opts.html;
            _popupHtml += "</div></div></div>";
            this.uMask.addClass("u-mask-active");
            this.body.append(_popupHtml);
            var _this = this;
            var popupListMod = $("#popupList");
            var popupClose = popupListMod.find(".u-popup-close");
            popupClose.on("click.popupListClose", function () {
                popupListMod.remove();
                _this.uMask.removeClass("u-mask-active");
            });
            opts.callback();
        },

        payPwd: function (options) {
            var opts = {
                tit: "请输入支付密码",
                cont: "",//红包：
                callback: function () {
                }
            };
            var _this = this;
            $.extend(opts, options);
            function getRandomNum(Min, Max) {
                var range = Max - Min;
                var rand = Math.random();
                return (Min + Math.round(rand * range));
            }

            var randNum = getRandomNum(1, 100);
            var _payMod = "myPopupPay" + randNum;
            var _payHtml = "<div class='u-auto-modal u-modal-pay u-modal-active' id='" + _payMod + "'><div class='u-modal-dialog yh-modal-popup'><div class='u-popup-hd'><span class='u-popup-close icon iconfont icon-danchuangguanbi'></span><h3 class='u-popup-title'>" + opts.tit + "</h3></div><div class='u-popup-bd'><div class='u-popup-pay-mod'><div class='uppm-tit'>" + opts.cont + "</div><div class='uppm-cont'><input type='password' class='u-form-input-pay' placeholder='" + opts.tit + "'/><div class='u-forget-pwd-txt'><a href='#/appealPayPwd'>忘记密码?</a></div></div><div class='uppm-foot'><button type='button' class='u-btn u-radius u-btn-block u-btn-normal u-btn-confirmSubmit'>确定</button></div></div></div></div></div>";
            _this.body.append(_payHtml);
            _this.uMask.addClass("u-mask-active");

            var payMod = $("#" + _payMod);
            var confirmBtn = payMod.find(".u-btn-confirmSubmit");
            var cancelBtn = payMod.find(".u-popup-close");
            var payInput = payMod.find(".u-form-input-pay");
            var forgetPwd = payMod.find(".u-forget-pwd-txt");

            confirmBtn.on("click", function () {
                opts.callback.call($(this), payMod, _this.uMask, payInput.val(), this);
            });
            cancelBtn.on("click", function () {
                $(this).off();
                payMod.remove();
                _this.uMask.removeClass("u-mask-active");
            });
            forgetPwd.on("click", function () {
                $(this).off();
                payMod.remove();
                _this.uMask.removeClass("u-mask-active");
            });
        }
    };

    $.fn.Modal=new _Modal();
})($);