/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2016/3/18
 * Time: 10:49
 * */
'use strict';
/*
 * 对外接口
 *
 * */
define(function (require, exports, module) {
    /*
     * 大会员中用到组件
     * */
    module.exports = {
        AppComponent: {
            formInputChange: function (callback, closeCallBack) {
                var _callback = callback || function () {
                    };
                var _closeCallBack = closeCallBack || function () {
                    };
                $(".u-form-item input").on("input propertychange", function () {//oninput  propertychange
                    var val = $(this).val(), _closeIco = $(this).parent().find(".icon-guanbi");
                    if (val.length > 0) {
                        _closeIco.removeClass("u-hidden");
                    } else {
                        _closeIco.addClass("u-hidden");
                    }
                    _callback();
                });
                $(".u-form-item .icon-guanbi").on("click", function () {
                    $(this).parents(".u-form-item").find("input").val("");
                    $(this).addClass("u-hidden");
                    _closeCallBack();
                });
                return this;
            },
            formHistorySlider: function (options) {
                var _formHistory = function (options) {
                    if (!(this instanceof _formHistory)) {
                        return new _formHistory(options);
                    }
                    this.opts = {
                        wrap: ".u-form-history",
                        listWrap: ".u-form-history-list",
                        dropEvt: ".u-form-history-icoSwitch",
                        input: ".u-form-input-text",
                        clearEvt: ".u-form-history-list-clear",
                        key: "formHistorySlider",
                        val: "",
                        callback: function () {

                        }
                    };
                    $.extend(this.opts, options);
                    this.wrap = $(this.opts.wrap);
                    this.listWrap = this.wrap.find(this.opts.listWrap);
                    this.recordList = localStorage[this.opts.key] ? JSON.parse(localStorage[this.opts.key]).reverse() : [];
                    console.log(this.recordList);
                    this.init();
                };
                _formHistory.prototype = {
                    init: function () {
                        this.renderList();
                        var _this = this;
                        var downUpEvt = this.wrap.find(this.opts.dropEvt);
                        var clearEvt = this.wrap.find(this.opts.clearEvt);
                        var _input = this.wrap.find(this.opts.input);
                        var _li = this.listWrap.find("ul li");
                        var _callback = this.opts.callback;
                        //下拉
                        downUpEvt.on("click", function () {
                            $(this).find("i").eq(1).toggleClass("icon-xiajiantou").toggleClass("icon-shangjiantou");
                            _this.listWrap.toggleClass("u-display-block").toggleClass("u-animation-slide-top-fixed");
                        });
                        //选中值
                        _li.on("click", function () {
                            var _phone = $(this).data("phone");
                            _input.val(_phone);
                            downUpEvt.triggerHandler("click");
                            _input.triggerHandler("propertychange");
                            _input.data("mark", 1);
                            _callback();
                        });
                        //清除记录
                        clearEvt.on("click", function () {
                            if ($(this).hasClass("no")) {
                                downUpEvt.triggerHandler("tap");
                            } else {
                                if (confirm("确定清除历史记录?")) {
                                    $(this).siblings("ul").empty();
                                    downUpEvt.triggerHandler("tap");
                                    $(this).html("暂无历史记录").addClass("no");
                                    _this.del();
                                } else {
                                    downUpEvt.triggerHandler("tap");
                                }
                            }
                        });
                    },
                    renderList: function () {
                        var _this = this;
                        var _list = "";
                        if (this.recordList.length > 0) {
                            for (var i = 0; i < this.recordList.length; i++) {
                                _list += "<li data-phone='" + this.recordList[i] + "'><p><span>" + this.recordList[i] + "</span></p></li>";
                            }
                            _this.listWrap.find("ul").append(_list);
                            _this.listWrap.find(_this.opts.clearEvt).html("清除历史记录").removeClass("no");
                        } else {
                            _this.listWrap.find(_this.opts.clearEvt).html("暂无历史记录").addClass("no");
                        }
                    },
                    del: function () {
                        this.recordList = localStorage[this.opts.key] = JSON.stringify([]);
                        //console.log(localStorage.formHistorySlider);
                    }
                };
                return _formHistory(options);
            },
            storageSave: function (obj) {
                var tmpArr = [];
                var _localStorage = localStorage[obj.key];
                var dataStr = obj.val;
                if (!_localStorage) {
                    tmpArr.push(dataStr);
                    localStorage.formHistorySlider = JSON.stringify(tmpArr);
                } else if (_localStorage && _localStorage.indexOf(dataStr) == -1) {
                    console.log(JSON.parse(_localStorage),"+++");
                    tmpArr = JSON.parse(_localStorage) || [];
                    if($.isArray(tmpArr)){
                        tmpArr.push(dataStr);
                    }
                    localStorage.formHistorySlider = JSON.stringify(tmpArr);
                } else {
                    console.log("it is already exists!");
                }
            },
            storageSet: function (obj) {
                localStorage[obj.key] = JSON.stringify(obj.val);
            },
            storageDel: function (key) {
                localStorage.removeItem(key);
            },
            storageGet: function (key) {
                return JSON.parse(localStorage.getItem(key));
            },
            //设置cookie
            setCookie:function(name, value, seconds) {
                seconds = seconds || 0;   //seconds有值就直接赋值，没有为0，这个根php不一样。
                var expires = "";
                if (seconds != 0 ) {      //设置cookie生存时间
                    var date = new Date();
                    date.setTime(date.getTime()+(seconds*1000));
                    expires = "; expires="+date.toGMTString();
                }
                document.cookie = name+"="+escape(value)+expires+"; path=/";   //转码并赋值
            },
            getCookie:function (name) {
                // var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
                // if(arr=document.cookie.match(reg))
                //     return unescape(arr[2]);
                // else
                //     return null;
                var arrstr = document.cookie.split("; ");
                for(var i = 0;i < arrstr.length;i ++){
                    var temp = arrstr[i].split("=");
                    if(temp[0] == name) return unescape(temp[1]);
                }
            },
            delCookie:function (name) {
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var cval=this.getCookie(name);
                if(cval!=null)
                    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
            },
            modal: function () {

                function _modal() {
                    this.init();
                }

                _modal.prototype = {
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
                    normal: function (msg, msgBtn, alignCenter, callback) {
                        var normalAlert = $("#normalAlert"),
                            umbBtn = $("#normalModalBtn"),
                            msgMod = $("#normalModalText"),
                            _callback = callback || function () {
                                },
                            uMask = $("#uMask");

                        if (alignCenter) {
                            msgMod.addClass("u-align-center");
                        }
                        msgMod.html(msg);
                        umbBtn.html(msgBtn);

                        uMask.addClass("u-mask-active");
                        normalAlert.addClass("u-modal-active");

                        umbBtn.bind("click.umbBtn", function () {
                            uMask.removeClass("u-mask-active");
                            normalAlert.removeClass("u-modal-active");
                            umbBtn.unbind();
                            _callback();
                        });

                    },
                    loading: function (msg, del) {
                        var loadingModal = $("#loadingModal"),
                            loadingText = $("#loadingText");
                        //uMask=$("#uLoadingMask");
                        if (!del) {
                            loadingText.html(msg);
                            //uMask.addClass("u-mask-active");
                            loadingModal.addClass("u-modal-active");
                            $(document).on('touchmove', function (e) {
                                e.preventDefault();
                            });
                        } else {
                            loadingText.html(msg);
                            loadingModal.removeClass("u-modal-active");
                            //uMask.removeClass("u-mask-active");
                            $(document).off('touchmove');
                        }
                    },
                    confirm: function (msg, msgHd, msgBtnCancel, msgBtnConfirm, alignCenter, cancelCallback, confirmCallback, callback,autoClose) {
                        var confirmModal = $("#confirmModal"),
                            confirmModalFooter = $("#confirmModalFooter"),
                            msgMdoHd = $("#confirmModalHdText"),
                            msgMod = $("#confirmModalText"),
                            cancelBtn = confirmModalFooter.find("span[data-u-modal-cancel]"),
                            confirmBtn = confirmModalFooter.find("span[data-u-modal-confirm]"),
                            _callback = callback || function () {
                                },
                            _cancelCallback = cancelCallback || function () {
                                },
                            _confirmCallback = confirmCallback || function () {
                                },
                            _autoClose=autoClose||"close",
                            uMask = $("#uMask");

                        if (alignCenter) {
                            msgMod.addClass("u-align-center");
                        }
                        msgMdoHd.html(msgHd || "");
                        msgMod.html(msg);
                        cancelBtn.html(msgBtnCancel || "取消");
                        confirmBtn.html(msgBtnConfirm || "确定");

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

                return new _modal();
            },
            listenSubmitBtn: function (object) {//obj,_input,_submitBtn,inputCallback
                var _form = $(object.form);
                var _inputArr = _form.find(object.inputs);
                var _sizeInput = _inputArr.size();
                var _this = null;
                var _submitBtn = _form.find(object.submitBtn);
                var _inputCallback = object.inputCallback || function () {
                    };
                var _$this = this;

                function checkInput($this) {
                    var _tmpNum = 0;
                    var _input = $this;
                    var _inputVal = _input.val();
                    if (_inputVal && _inputVal.length > 0 && !/^\s*$/g.test(_inputVal)) {
                        _input.data("mark", "1");
                    } else {
                        _input.data("mark", "0");
                    }
                    for (var i = 0; i < _sizeInput; i++) {
                        var tmpBool = $(_inputArr[i]).data("mark");
                        if (tmpBool == "1") {
                            _tmpNum++;
                        } else {
                            _tmpNum--;
                        }
                    }
                    if (_tmpNum > _sizeInput - 1) {
                        _submitBtn.removeAttr('disabled');
                    } else {
                        _submitBtn.attr('disabled', "");
                    }
                }

                _inputArr.on("input", function () {
                    checkInput($(this));
                    _inputCallback.call(_$this, $(this));
                });
                _form.find(".icon-guanbi").on("tap.gb", function () {
                    var _gbInput = $(this).parent().siblings(object.inputs);
                    _gbInput.data("mark", "0");
                    checkInput($(this));
                });
            },
            scrollLoading: function (options) {

                function _ScrollLoading(options) {
                    if (!(this instanceof _ScrollLoading)) {
                        return new _ScrollLoading(options);
                    }
                    this.opts = {
                        wrapper: ".scroll-mod",//*必须.u-refresh .scroll-mod
                        list: ".u-data-list",//*必须
                        refreshInfo: {},
                        dir: ['up', 'down'],
                        threshold: 10,
                        startPage: 2,
                        judge: false,//手动限制
                        pageSize: 10,
                        ejsUrl: "views/dhy/scrollPointsList.ejs",
                        method: false,//1 post 0 get
                        postUrl: "",
                        extendData: {},//扩展data自定义字段,
                        inside: true,//是否在g-content内滚动
                        totalPage: function (data) {
                            //最多分页数目字段,请求数据后执行获取分页总数
                            return data ? data.data.totalPage : false;
                        },
                        getUrl: function (page, pageSize) {
                            return "account/integration/list?page=" + page + "&pagesize=" + pageSize;
                        },
                        preData: null,
                        callbackCreate: function () {

                        },
                        callbackScroll: function () {
                        },
                        callbackQuery: function () {

                        },
                        callbackUp: function () {

                        },
                        callbackDown: function () {

                        },
                        callbackScrollEnd: function () {

                        },
                        callbackScrollStart: function () {

                        },
                        callbackIng: function () {

                        }
                    };
                    $.extend(this.opts, options);
                    this.init();
                    return this;
                }

                _ScrollLoading.prototype = {
                    init: function () {
                        var me = this;
                        if (window.myScroll) {
                            me.destroy();
                        }
                        this.wrap = $(this.opts.wrapper);
                        this.list = this.wrap.find(this.opts.list);
                        var liSize = this.list.children().size();
                        if (this.opts.judge || liSize >= 5) {
                            $(document).on('touchmove', function (e) {
                                e.preventDefault();
                            });
                            this._create();
                            this._loadScroll();
                        } else {
                            console.log("scroll loading data list length is not enough !");
                            //this.wrap.height("auto");
                        }
                    },
                    _create: function () {
                        var me = this;
                        this.list.before("<div class='u-refresh-up u-hidden'><span class='u-refresh-icon'>&nbsp;</span><span class='u-refresh-label'>&#8595;加载更多...</span></div>");
                        this.list.after("<div class='u-refresh-down'><span class='u-refresh-icon'>&nbsp;</span><span class='u-refresh-label'>&#8593;加载更多...</span></div>");

                        $.each(me.opts.dir, function (i, dir) {
                            var $elem = $(".u-refresh-" + dir);
                            me._status(dir, true);    //初始设置加载状态为可用

                            me.opts.refreshInfo[dir] = {
                                icon: $elem.find('.u-refresh-icon'),
                                label: $elem.find('.u-refresh-label'),
                                text: $elem.find('.u-refresh-label').html()
                            };

                            $elem.on('click', function () {
                                if (!me._status(dir) || me.opts._actDir) return;         //检查是否处于可用状态，同一方向上的仍在加载中，或者不同方向的还未加载完成 traceID:FEBASE-569
                                me._setStyle(dir, 'loading');
                                me._loadingAction(dir, 'click');
                            });
                        });

                        me.opts.$upElem = this.wrap.find('.u-refresh-up');
                        me.opts.$downElem = this.wrap.find('.u-refresh-down');
                        me.opts.topOffset = me.opts.$upElem ? me.opts.$upElem.height() : 0;

                        var wrapperH = this.wrap.height();
                        console.log("自动设置高度", wrapperH);
                        //this.wrap.wrapAll($('<div class="u-refresh-wrapper"></div>').height(wrapperH).css('overflow','hidden')).css('height','auto');
                        //this.wrap.wrapAll($('<div class="u-refresh-wrapper"></div>'));
                        this.wrap.parent().addClass("m-js-scroll");
                        if (me.opts.inside) {
                            $(".scroll-mod").addClass("u-scroll-inside");//内部滚动时候外层必须100%
                        }
                        this.opts.callbackCreate();
                    },
                    _loadScroll: function () {
                        this.startY = (parseInt(this.opts.topOffset) * (-1));
                        var me = this,
                            threshold = me.opts.threshold;

                        window.myScroll = new IScroll(this.wrap.parent().get(0), {
                            probeType: 1,
                            useTransform: true,
                            tap: true,
                            click: true,
                            mouseWheel: false,
                            fadeScrollbars: false
                            //preventDefault: false,
                            //preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/ },
                            //startY:me.startY
                        });

                        window.myScroll.on("scrollStart", function () {
                            me.opts.callbackScrollStart.call(this, this.y);
                        });
                        window.myScroll.on('scroll', function () {

                            var _that = this,
                                upBool = me.opts.$upElem && me.opts.$upElem.length,
                                downBool = me.opts.$downElem && me.opts.$downElem.length,
                                upRefreshed = me.opts._upRefreshed,
                                downRefreshed = me.opts._downRefreshed,
                                upStatus = me._status('up'),
                                downStatus = me._status('down');

                            //console.log('scroll....',upBool,upStatus,upRefreshed,downBool,downStatus,downRefreshed);
                            me.opts.callbackIng.call(this, this.y);

                            if (upBool && !upStatus || downBool && !downStatus || _that.maxScrollY >= 0) return;

                            if (downStatus && downBool && !downRefreshed && this.y < (_that.maxScrollY - threshold)) {    //下边按钮，上拉加载

                                me._setMoveState('down', 'beforeload', 'pull');

                                _that.maxScrollY = _that.maxScrollY;
                            } else if (upStatus && upBool && !upRefreshed && this.y > threshold) {     //上边按钮，下拉加载

                                me._setMoveState('up', 'beforeload', 'pull');
                                _that.minScrollY = 0;

                            } else if (downStatus && downRefreshed && this.y > (_that.maxScrollY + threshold)) {      //下边按钮，上拉恢复

                                me._setMoveState('down', 'loaded', 'restore');

                                _that.maxScrollY = me.opts.topOffset;
                            } else if (upStatus && upRefreshed && this.y < threshold) {      //上边按钮，下拉恢复

                                me._setMoveState('up', 'loaded', 'restore');
                                _that.minScrollY = -me.opts.topOffset;
                            } else {
                                //console.warn("=-=")
                            }

                        });

                        window.myScroll.on('scrollEnd', function () {

                            var actDir = me.opts._actDir;
                            //console.log(me.opts,'scrollEnd....',actDir,me._status(actDir));

                            if (actDir && me._status(actDir)) {
                                me._setStyle(actDir, 'loading');
                                me._loadingAction(actDir, 'pull');
                            }

                            me.opts.callbackScroll();
                            me.opts.callbackScrollEnd.call(this, this.y);
                        });

                        //window.myScroll.scrollTo(0,0,1000);
                    },
                    _status: function (dir, status) {
                        var opts = this.opts;
                        //console.log("status....",dir,status);
                        return status === undefined ? opts['_' + dir + 'Open'] : opts['_' + dir + 'Open'] = !!status;
                    },
                    _setMoveState: function (dir, state, actType) {
                        var me = this,
                            opts = me.opts;

                        me._setStyle(dir, state);
                        opts['_' + dir + 'Refreshed'] = actType == 'pull';
                        opts._actDir = actType == 'pull' ? dir : '';

                        //console.log(dir,state,actType,"===");
                        return me;
                    },
                    /*
                     * 动态改变状态样式
                     * */
                    _changeStyle: function (dir, state) {
                        var me = this,
                            opts = me.opts,
                            refreshInfo = opts.refreshInfo[dir];

                        switch (state) {
                            case 'loaded':
                                refreshInfo.icon.removeClass().addClass('u-refresh-icon');
                                refreshInfo.label.html(refreshInfo.text);
                                opts._actDir = '';
                                break;
                            case 'beforeload':
                                refreshInfo.label.html('松开立即加载');
                                refreshInfo.icon.addClass('u-refresh-flip');
                                break;
                            case 'loading':
                                refreshInfo.label.html('加载中...');
                                refreshInfo.icon.removeClass().addClass('u-loading');
                                opts._actDir = dir;
                                break;
                            case 'disable':
                                refreshInfo.label.html('没有更多内容了');
                                opts.refreshInfo.up.label.html('没有更多内容了');
                                opts.refreshInfo.down.label.html('没有更多内容了');
                                break;
                        }
                        return me;
                    },
                    _setStyle: function (dir, state) {
                        var me = this;
                        return me._changeStyle(dir, state);
                    },
                    _loadingAction: function (dir, type) {
                        var me = this,
                            opts = me.opts,
                            nextPage = 0,
                            loadFn = opts.load;
                        if ($.isFunction(loadFn)) {
                            loadFn.call(me, dir, type);
                        } else {
                            if (me.list.data('page')) {
                                nextPage = parseInt(me.list.data('page'), 10) + 1;
                            } else {
                                nextPage = me.opts.startPage;
                            }
                            if (me.totalPage == undefined || (me.totalPage && nextPage <= me.totalPage)) {

                                me._queryData(nextPage, me.opts.pageSize, me.opts.callbackQuery, dir);
                            }
                            me.nextPage = nextPage;
                        }
                        me.afterDataLoading(dir);
                        return me;
                    },
                    //请求数据
                    _queryData: function (page, pageSize, callback, dir) {
                        //TODO 屏蔽up
                        if (dir == "down") {
                            var me = this;
                            if (!me.opts.method) {
                                App.getJSON(me.opts.getUrl(page, pageSize), function (data) {
                                    me.totalPage = me.opts.totalPage(data);
                                    if (me.totalPage && page <= me.totalPage) {
                                        me.renderData(dir, data, callback);
                                    } else {
                                        me.nextPage = page;
                                        me._setStyle(dir, 'disable');
                                    }
                                });
                            } else {
                                App.postJSON(me.opts.postUrl, {
                                    page: page,
                                    pageSize: pageSize
                                }, function (data) {
                                    me.totalPage = me.opts.totalPage(data);
                                    if (me.totalPage && page <= me.totalPage) {
                                        me.renderData(dir, data, callback);
                                    } else {
                                        me.nextPage = page;
                                        me._setStyle(dir, 'disable');
                                    }
                                });
                            }
                            me.list.data('page', page);
                        }
                    },
                    //渲染数据
                    renderData: function (dir, data, callback) {
                        var me = this,
                            _callback = callback || function () {
                                };
                        var resData = {};
                        if (typeof me.opts.preData == "function") {
                            resData = me.opts.preData(data);
                        } else {
                            resData = $.extend(me.opts.extendData, data);
                        }
                        //console.log("renderData:",{"data":resData});
                        if (dir == "up") {
                            //me.list.prepend(new EJS({url:me.opts.ejsUrl}).render({"data":resData}));
                        } else if (dir == 'down') {
                            me.list.append(new EJS({url: me.opts.ejsUrl}).render({"data": resData}));
                        }
                        window.myScroll.refresh();
                        _callback();
                    },
                    //重置属性
                    rePlay: function (callback, bool) {
                        var me = this, _bool = bool || false;
                        if (!_bool) {
                            me.list.data('page', 0);
                        }
                        callback.call(this);
                    },
                    reStart: function (options) {
                        $.extend(this.opts, options);
                        this.init();
                        return this;
                    },
                    afterDataLoading: function (dir) {
                        var me = this,
                            opts = me.opts,
                            _dir = dir || opts._actDir;
                        me._setStyle(_dir, 'loaded');
                        me._status(_dir, true);
                        window.myScroll.refresh();
                        opts['_' + _dir + 'Refreshed'] = false;

                        if (_dir == "up") {
                            window.myScroll.scrollTo(0, me.startY, 200);
                            me.opts.callbackUp();
                        } else if (_dir == "down") {
                            //window.myScroll.scrollBy(0, -me.startY, 200);
                            me.opts.callbackDown();
                        } else {
                            console.warn("Direction error!");
                        }
                        //限制提示
                        if (me.totalPage && me.nextPage > me.totalPage) {
                            me._setStyle(dir, 'disable');
                        }
                        return me;
                    },
                    destroy: function () {
                        var me = this;
                        if (window.myScroll) {
                            window.myScroll.destroy();
                            $(window.myScroll.scroller).attr('style', '').parent().removeClass("m-js-scroll");
                            window.myScroll = null;
                            $(document).off('touchmove');
                            if (me.list) {
                                me.list.data("page", undefined);
                            }
                        }
                    },
                    refresh: function () {
                        window.myScroll ? window.myScroll.refresh() : "";
                    }
                };

                return _ScrollLoading(options);
            },
            tabs: function (options) {
                function _tabs(options) {
                    if (!(this instanceof _tabs)) {
                        return new _tabs(options);
                    }
                    this.opts = {
                        wrap: ".u-tabs-wrap",
                        nav: ".u-tabs-nav ul li",
                        eq: 0,
                        show: ".u-tabs-show",
                        currentLi: "u-active",
                        hideName: "u-tabs-hide",
                        callback: function () {
                        },
                        callbackInit: function () {

                        }
                    };
                    $.extend(this.opts, options);
                    this.init();
                }

                _tabs.prototype = {
                    init: function () {
                        var me = this;
                        var _index = null;

                        me.wrap = $(me.opts.wrap);
                        me.nav = me.wrap.find(me.opts.nav);
                        me.show = me.wrap.find(me.opts.show);

                        me.nav.eq(me.opts.eq).addClass(me.opts.currentLi);

                        me.show.addClass(me.opts.hideName);
                        me.show.eq(me.opts.eq).removeClass(me.opts.hideName);

                        //滑动事件
                        var tmpSwipeNum = me.opts.eq; //当前滑动的索引
                        var tmpMinNum = 0;
                        var tmpMaxNum = me.nav.length - 1;

                        me.nav.on("click.tabs", function () {
                            tmpSwipeNum = _index = $(this).index();
                            $(this).addClass(me.opts.currentLi).siblings().removeClass(me.opts.currentLi);
                            me.show.eq(_index).removeClass(me.opts.hideName).siblings().addClass(me.opts.hideName);
                            me.opts.callback.call($(this), {index: _index});
                        });

                        $(document).on("swipeleft.tabs", function () {
                            if (_index) {
                                tmpSwipeNum = _index;
                            }
                            if (tmpSwipeNum < tmpMaxNum) {
                                tmpSwipeNum++;
                            } else {
                                tmpSwipeNum = tmpMinNum;
                            }
                            //console.log("swiping...left",tmpSwipeNum);
                            me.nav.eq(tmpSwipeNum).triggerHandler("click.tabs");
                        });
                        $(document).on("swiperight.tabs", function () {
                            if (_index) {
                                tmpSwipeNum = _index;
                            }
                            if (tmpSwipeNum > 0) {
                                tmpSwipeNum--;
                            } else {
                                tmpSwipeNum = tmpMaxNum;
                            }
                            //console.log("swiping...right2",tmpSwipeNum);
                            me.nav.eq(tmpSwipeNum).triggerHandler("click.tabs");
                        });
                        me.opts.callbackInit();
                    }
                };

                return _tabs(options);
            },
            dropDown: function (options) {
                function _dropDown(options) {
                    if (!(this instanceof _dropDown)) {
                        return new _dropDown(options);
                    }
                    this.opts = {
                        wrap: ".u-drop-down-wrap",
                        toggleWrap: ".u-drop-down-show",
                        evtClass: ".u-drop-text",
                        optionClass: ".u-drop-option",
                        curTxtClass: "span",
                        closeClass: ".u-drop-close",
                        tmpUrl: "views/dhy/dropDownList.ejs",
                        tmpArr: [],
                        callback: function () {
                        },
                        callbackToggle: function () {
                        },
                        callbackRender: function () {
                        },
                        callbackOpen: function () {
                        },
                        callbackClose: function () {
                        }
                    };
                    $.extend(this.opts, options);
                    this.init();
                    return this;
                }

                _dropDown.prototype = {
                    init: function () {
                        var _this = this;
                        var _wrap = $(_this.opts.wrap);
                        _this.normal(_wrap);
                    },
                    normal: function (wrap) {
                        var _this = this;
                        var _offset = wrap.offset();
                        var _evtObj = wrap.find(_this.opts.evtClass);
                        var _toggleWrap = wrap.find(_this.opts.toggleWrap);
                        _toggleWrap.css({"top": _offset.top + _offset.height});//*position body
                        //_toggleWrap.css({"top":_offset.height});
                        //渲染DOM
                        var _resultHtml = _this.tmpRender({
                            url: _this.opts.tmpUrl,
                            data: _this.opts.tmpArr,
                            target: _toggleWrap
                        });
                        _this.opts.callbackRender();
                        //展开
                        _evtObj.off().on("click.dropDown", function () {
                            var _tmpLocked = wrap.data("locked");//是否开启锁定
                            var tmpTgWrap = $(this).parents(_this.opts.wrap).find(_this.opts.toggleWrap);
                            if (!_tmpLocked) {
                                if (tmpTgWrap.hasClass("u-hidden")) {
                                    //展开
                                    $(this).find(".iconfont").removeClass("icon-xiajiantou").addClass("icon-shangjiantou");
                                    tmpTgWrap.removeClass("u-hidden").addClass("u-animation-slide-top-fixed");
                                    _this.opts.callbackOpen.call($(this), wrap);
                                } else {
                                    //隐藏
                                    $(this).find(".iconfont").addClass("icon-xiajiantou").removeClass("icon-shangjiantou");
                                    tmpTgWrap.addClass("u-hidden").removeClass("u-animation-slide-top-fixed");
                                    _this.opts.callbackClose.call($(this), wrap);
                                }
                            }
                        });

                        //选中
                        wrap.find(_this.opts.optionClass).off().on("click.dropDown", function () {

                            var _option = $(this).data("option");
                            var _val = $(this).html();
                            var _parentId = $(this).data("option-parent-id");
                            _evtObj.triggerHandler("click");

                            _evtObj.find(_this.opts.curTxtClass).html(_val);
                            _evtObj.find(_this.opts.curTxtClass).data("option-id", _option);
                            _evtObj.find(_this.opts.curTxtClass).data("option-parent-id", _parentId || _option);
                            $(this).addClass("u-active").siblings().removeClass("u-active");
                            _this.opts.callback.call($(this), _option, _val, wrap);
                        });
                        //关闭
                        wrap.find(_this.opts.closeClass).off().on("click.dropDown", function () {
                            _evtObj.triggerHandler("click");
                        });
                    },
                    tmpRender: function (obj) {
                        var _result = new EJS({url: obj.url}).render({data: obj.data});
                        if (obj.target) {
                            obj.target.empty().html(_result)
                        } else {
                            return _result;
                        }
                    },
                    destroy: function () {
                        var _this = this;
                        $(_this.opts.wrap).find(_this.opts.evtClass).off();
                        $(_this.opts.wrap).find(_this.opts.optionClass).off();
                        $(_this.opts.wrap).find(_this.opts.closeClass).off();

                    }
                };
                return _dropDown(options);
            },
            citySort: function () {
                var THIS = this;
                // 汉字拼音首字母列表 本列表包含了20902个汉字,用于配合 ToChineseSpell
                //函数使用,本表收录的字符的Unicode编码范围为19968至40869, XDesigner 整理
                var strChineseFirstPY = "YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBRCFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZYRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZNTYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJKQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXKWYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSDCJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHNGPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZSZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGXXZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTTTKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDKHNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCMBJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZHQKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJSZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHHARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKKBXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJQFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQYTLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZSQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDPJHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLRDTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBMYHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJHKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQHHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZKDDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCSZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCXTCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZQAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKTCSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLKQUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZRNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYSJTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHLLQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQXRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLLBNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJMHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFFYTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQXSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJHFXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLWTGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQYBKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLTYXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQYWRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTMLRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTYNXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXCHXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSLLLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXSXNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDXYYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTYYMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHKZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYGZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQSTDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQXQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXBQKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSLDLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSSNXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWBZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZQPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGWSGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJHCLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPKYGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDKNTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYSXDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRBCQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGKGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKXWYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYYZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJBZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQYQQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXYSZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXCQQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQTTFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJCJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXWWGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSRNQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXHLHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLGYJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDFQTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYEBHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMCLLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFYWHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZYZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMSTPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZMLLJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJMKMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQXYJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQTMYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZMCYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZHHXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJECXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLLXDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZEAWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJYHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHLRMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPNHMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQDCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY";
//此处收录了375个多音字,
                var oMultiDiff = {
                    "19969": "DZ",
                    "19975": "WM",
                    "19988": "QJ",
                    "20048": "YL",
                    "20056": "SC",
                    "20060": "NM",
                    "20094": "QG",
                    "20127": "QJ",
                    "20167": "QC",
                    "20193": "YG",
                    "20250": "KH",
                    "20256": "ZC",
                    "20282": "SC",
                    "20285": "QJG",
                    "20291": "TD",
                    "20314": "YD",
                    "20340": "NE",
                    "20375": "TD",
                    "20389": "YJ",
                    "20391": "CZ",
                    "20415": "PB",
                    "20446": "YS",
                    "20447": "SQ",
                    "20504": "TC",
                    "20608": "KG",
                    "20854": "QJ",
                    "20857": "ZC",
                    "20911": "PF",
                    "20985": "AW",
                    "21032": "PB",
                    "21048": "XQ",
                    "21049": "SC",
                    "21089": "YS",
                    "21119": "JC",
                    "21242": "SB",
                    "21273": "SC",
                    "21305": "YP",
                    "21306": "QO",
                    "21330": "ZC",
                    "21333": "SDC",
                    "21345": "QK",
                    "21378": "CA",
                    "21397": "SC",
                    "21414": "XS",
                    "21442": "SC",
                    "21477": "JG",
                    "21480": "TD",
                    "21484": "ZS",
                    "21494": "YX",
                    "21505": "YX",
                    "21512": "HG",
                    "21523": "XH",
                    "21537": "PB",
                    "21542": "PF",
                    "21549": "KH",
                    "21571": "E",
                    "21574": "DA",
                    "21588": "TD",
                    "21589": "O",
                    "21618": "ZC",
                    "21621": "KHA",
                    "21632": "ZJ",
                    "21654": "KG",
                    "21679": "LKG",
                    "21683": "KH",
                    "21710": "A",
                    "21719": "YH",
                    "21734": "WOE",
                    "21769": "A",
                    "21780": "WN",
                    "21804": "XH",
                    "21834": "A",
                    "21899": "ZD",
                    "21903": "RN",
                    "21908": "WO",
                    "21939": "ZC",
                    "21956": "SA",
                    "21964": "YA",
                    "21970": "TD",
                    "22003": "A",
                    "22031": "JG",
                    "22040": "XS",
                    "22060": "ZC",
                    "22066": "ZC",
                    "22079": "MH",
                    "22129": "XJ",
                    "22179": "XA",
                    "22237": "NJ",
                    "22244": "TD",
                    "22280": "JQ",
                    "22300": "YH",
                    "22313": "XW",
                    "22331": "YQ",
                    "22343": "YJ",
                    "22351": "PH",
                    "22395": "DC",
                    "22412": "TD",
                    "22484": "PB",
                    "22500": "PB",
                    "22534": "ZD",
                    "22549": "DH",
                    "22561": "PB",
                    "22612": "TD",
                    "22771": "KQ",
                    "22831": "HB",
                    "22841": "JG",
                    "22855": "QJ",
                    "22865": "XQ",
                    "23013": "ML",
                    "23081": "WM",
                    "23487": "SX",
                    "23558": "QJ",
                    "23561": "YW",
                    "23586": "YW",
                    "23614": "YW",
                    "23615": "SN",
                    "23631": "PB",
                    "23646": "ZS",
                    "23663": "ZT",
                    "23673": "YG",
                    "23762": "TD",
                    "23769": "ZS",
                    "23780": "QJ",
                    "23884": "QK",
                    "24055": "XH",
                    "24113": "DC",
                    "24162": "ZC",
                    "24191": "GA",
                    "24273": "QJ",
                    "24324": "NL",
                    "24377": "TD",
                    "24378": "QJ",
                    "24439": "PF",
                    "24554": "ZS",
                    "24683": "TD",
                    "24694": "WE",
                    "24733": "LK",
                    "24925": "TN",
                    "25094": "ZG",
                    "25100": "XQ",
                    "25103": "XH",
                    "25153": "PB",
                    "25170": "PB",
                    "25179": "KG",
                    "25203": "PB",
                    "25240": "ZS",
                    "25282": "FB",
                    "25303": "NA",
                    "25324": "KG",
                    "25341": "ZY",
                    "25373": "WZ",
                    "25375": "XJ",
                    "25384": "A",
                    "25457": "A",
                    "25528": "SD",
                    "25530": "SC",
                    "25552": "TD",
                    "25774": "ZC",
                    "25874": "ZC",
                    "26044": "YW",
                    "26080": "WM",
                    "26292": "PB",
                    "26333": "PB",
                    "26355": "ZY",
                    "26366": "CZ",
                    "26397": "ZC",
                    "26399": "QJ",
                    "26415": "ZS",
                    "26451": "SB",
                    "26526": "ZC",
                    "26552": "JG",
                    "26561": "TD",
                    "26588": "JG",
                    "26597": "CZ",
                    "26629": "ZS",
                    "26638": "YL",
                    "26646": "XQ",
                    "26653": "KG",
                    "26657": "XJ",
                    "26727": "HG",
                    "26894": "ZC",
                    "26937": "ZS",
                    "26946": "ZC",
                    "26999": "KJ",
                    "27099": "KJ",
                    "27449": "YQ",
                    "27481": "XS",
                    "27542": "ZS",
                    "27663": "ZS",
                    "27748": "TS",
                    "27784": "SC",
                    "27788": "ZD",
                    "27795": "TD",
                    "27812": "O",
                    "27850": "PB",
                    "27852": "MB",
                    "27895": "SL",
                    "27898": "PL",
                    "27973": "QJ",
                    "27981": "KH",
                    "27986": "HX",
                    "27994": "XJ",
                    "28044": "YC",
                    "28065": "WG",
                    "28177": "SM",
                    "28267": "QJ",
                    "28291": "KH",
                    "28337": "ZQ",
                    "28463": "TL",
                    "28548": "DC",
                    "28601": "TD",
                    "28689": "PB",
                    "28805": "JG",
                    "28820": "QG",
                    "28846": "PB",
                    "28952": "TD",
                    "28975": "ZC",
                    "29100": "A",
                    "29325": "QJ",
                    "29575": "SL",
                    "29602": "FB",
                    "30010": "TD",
                    "30044": "CX",
                    "30058": "PF",
                    "30091": "YSP",
                    "30111": "YN",
                    "30229": "XJ",
                    "30427": "SC",
                    "30465": "SX",
                    "30631": "YQ",
                    "30655": "QJ",
                    "30684": "QJG",
                    "30707": "SD",
                    "30729": "XH",
                    "30796": "LG",
                    "30917": "PB",
                    "31074": "NM",
                    "31085": "JZ",
                    "31109": "SC",
                    "31181": "ZC",
                    "31192": "MLB",
                    "31293": "JQ",
                    "31400": "YX",
                    "31584": "YJ",
                    "31896": "ZN",
                    "31909": "ZY",
                    "31995": "XJ",
                    "32321": "PF",
                    "32327": "ZY",
                    "32418": "HG",
                    "32420": "XQ",
                    "32421": "HG",
                    "32438": "LG",
                    "32473": "GJ",
                    "32488": "TD",
                    "32521": "QJ",
                    "32527": "PB",
                    "32562": "ZSQ",
                    "32564": "JZ",
                    "32735": "ZD",
                    "32793": "PB",
                    "33071": "PF",
                    "33098": "XL",
                    "33100": "YA",
                    "33152": "PB",
                    "33261": "CX",
                    "33324": "BP",
                    "33333": "TD",
                    "33406": "YA",
                    "33426": "WM",
                    "33432": "PB",
                    "33445": "JG",
                    "33486": "ZN",
                    "33493": "TS",
                    "33507": "QJ",
                    "33540": "QJ",
                    "33544": "ZC",
                    "33564": "XQ",
                    "33617": "YT",
                    "33632": "QJ",
                    "33636": "XH",
                    "33637": "YX",
                    "33694": "WG",
                    "33705": "PF",
                    "33728": "YW",
                    "33882": "SR",
                    "34067": "WM",
                    "34074": "YW",
                    "34121": "QJ",
                    "34255": "ZC",
                    "34259": "XL",
                    "34425": "JH",
                    "34430": "XH",
                    "34485": "KH",
                    "34503": "YS",
                    "34532": "HG",
                    "34552": "XS",
                    "34558": "YE",
                    "34593": "ZL",
                    "34660": "YQ",
                    "34892": "XH",
                    "34928": "SC",
                    "34999": "QJ",
                    "35048": "PB",
                    "35059": "SC",
                    "35098": "ZC",
                    "35203": "TQ",
                    "35265": "JX",
                    "35299": "JX",
                    "35782": "SZ",
                    "35828": "YS",
                    "35830": "E",
                    "35843": "TD",
                    "35895": "YG",
                    "35977": "MH",
                    "36158": "JG",
                    "36228": "QJ",
                    "36426": "XQ",
                    "36466": "DC",
                    "36710": "JC",
                    "36711": "ZYG",
                    "36767": "PB",
                    "36866": "SK",
                    "36951": "YW",
                    "37034": "YX",
                    "37063": "XH",
                    "37218": "ZC",
                    "37325": "CZ",
                    "38063": "PB",
                    "38079": "TD",
                    "38085": "QY",
                    "38107": "DC",
                    "38116": "TD",
                    "38123": "YD",
                    "38224": "HG",
                    "38241": "XTC",
                    "38271": "CZ",
                    "38415": "YE",
                    "38426": "KH",
                    "38461": "YD",
                    "38463": "AE",
                    "38466": "PB",
                    "38477": "XJ",
                    "38518": "YT",
                    "38551": "WK",
                    "38585": "ZC",
                    "38704": "XS",
                    "38739": "LJ",
                    "38761": "GJ",
                    "38808": "SQ",
                    "39048": "JG",
                    "39049": "XJ",
                    "39052": "HG",
                    "39076": "CZ",
                    "39271": "XT",
                    "39534": "TD",
                    "39552": "TD",
                    "39584": "PB",
                    "39647": "SB",
                    "39730": "LG",
                    "39748": "TPB",
                    "40109": "ZQ",
                    "40479": "ND",
                    "40516": "HG",
                    "40536": "HG",
                    "40583": "QJ",
                    "40765": "YQ",
                    "40784": "QJ",
                    "40840": "YK",
                    "40863": "QJG"
                };
//参数,中文字符串
//返回值:拼音首字母串数组
                function makePy(str) {
                    if (typeof (str) != "string")
                        throw new Error(-1, "函数makePy需要字符串类型参数!");
                    var arrResult = []; //保存中间结果的数组
                    for (var i = 0, len = str.length; i < len; i++) {
                        //获得unicode码
                        var ch = str.charAt(i);
                        //检查该unicode码是否在处理范围之内,在则返回该码对映汉字的拼音首字母,不在则调用其它函数处理
                        arrResult.push(checkCh(ch));
                    }
                    //处理arrResult,返回所有可能的拼音首字母串数组

                    return mkRslt(arrResult);
                }

                function checkCh(ch) {
                    var uni = ch.charCodeAt(0);
                    //console.log(ch,uni);
                    //如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数
                    if (uni > 40869 || uni < 19968)
                        return ch; //dealWithOthers(ch);
                    //检查是否是多音字,是按多音字处理,不是就直接在strChineseFirstPY字符串中找对应的首字母
                    return (oMultiDiff[uni] ? oMultiDiff[uni] : (strChineseFirstPY.charAt(uni - 19968)));
                }

                function mkRslt(arr) {
                    var arrRslt = [""];
                    for (var i = 0, len = arr.length; i < len; i++) {
                        var str = arr[i];
                        var strlen = str.length;
                        if (strlen == 1) {
                            for (var k = 0; k < arrRslt.length; k++) {
                                arrRslt[k] += str;
                            }
                        } else {
                            var tmpArr = arrRslt.slice(0);
                            arrRslt = [];
                            for (k = 0; k < strlen; k++) {
                                //复制一个相同的arrRslt
                                var tmp = tmpArr.slice(0);
                                //把当前字符str[k]添加到每个元素末尾
                                for (var j = 0; j < tmp.length; j++) {
                                    tmp[j] += str.charAt(k);
                                }
                                //把复制并修改后的数组连接到arrRslt上
                                arrRslt = arrRslt.concat(tmp);
                            }
                        }
                    }
                    return arrRslt;
                }

                /*======================================================================*/
                function initials(listClass, boxClass) {//公众号排序
                    var SortList = $(listClass);
                    var SortBox = $(boxClass);
                    SortList.sort(asc_sort).appendTo('.u-city-sort-box');//按首字母排序

                    function asc_sort(a, b) {
                        //console.log($(b).data("name").charAt(0)[0].toUpperCase().charAt(i));
                        var _b = makePy($(b).data("name").charAt(0))[0].toUpperCase();
                        var _a = makePy($(a).data("name").charAt(0))[0].toUpperCase();
                        return _b < _a ? 1 : -1;
                    }

                    var initials = [];
                    var num = 0;
                    //console.log(SortList);
                    SortList.each(function (i) {
                        var initial = makePy($(this).data("name").charAt(0))[0].toUpperCase();
                        if (initial >= 'A' && initial <= 'Z') {
                            if (initials.indexOf(initial) === -1)
                                initials.push(initial);
                        } else {
                            num++;
                        }
                    });

                    $.each(initials, function (index, value) {//添加首字母标签
                        SortBox.append('<li class="u-city-sort-letter" id="' + value + '">' + value + '</li>');
                    });
                    if (num != 0) {
                        SortBox.append('<li class="u-city-sort-letter" id="default">#</li>');
                    }

                    for (var i = 0; i < SortList.length; i++) {//插入到对应的首字母后面
                        var letter = makePy(SortList.eq(i).data("name").charAt(0))[0].toUpperCase();
                        switch (letter) {
                            case "A":
                                $('#A').after(SortList.eq(i));
                                break;
                            case "B":
                                $('#B').after(SortList.eq(i));
                                break;
                            case "C":
                                $('#C').after(SortList.eq(i));
                                break;
                            case "D":
                                $('#D').after(SortList.eq(i));
                                break;
                            case "E":
                                $('#E').after(SortList.eq(i));
                                break;
                            case "F":
                                $('#F').after(SortList.eq(i));
                                break;
                            case "G":
                                $('#G').after(SortList.eq(i));
                                break;
                            case "H":
                                $('#H').after(SortList.eq(i));
                                break;
                            case "I":
                                $('#I').after(SortList.eq(i));
                                break;
                            case "J":
                                $('#J').after(SortList.eq(i));
                                break;
                            case "K":
                                $('#K').after(SortList.eq(i));
                                break;
                            case "L":
                                $('#L').after(SortList.eq(i));
                                break;
                            case "M":
                                $('#M').after(SortList.eq(i));
                                break;
                            case "O":
                                $('#O').after(SortList.eq(i));
                                break;
                            case "P":
                                $('#P').after(SortList.eq(i));
                                break;
                            case "Q":
                                $('#Q').after(SortList.eq(i));
                                break;
                            case "R":
                                $('#R').after(SortList.eq(i));
                                break;
                            case "S":
                                $('#S').after(SortList.eq(i));
                                break;
                            case "T":
                                $('#T').after(SortList.eq(i));
                                break;
                            case "U":
                                $('#U').after(SortList.eq(i));
                                break;
                            case "V":
                                $('#V').after(SortList.eq(i));
                                break;
                            case "W":
                                $('#W').after(SortList.eq(i));
                                break;
                            case "X":
                                $('#X').after(SortList.eq(i));
                                break;
                            case "Y":
                                $('#Y').after(SortList.eq(i));
                                break;
                            case "Z":
                                $('#Z').after(SortList.eq(i));
                                break;
                            default:
                                $('#default').after(SortList.eq(i));
                                break;
                        }
                    }
                }

                return {
                    init: function (options) {
                        var opts = {
                            callback: function () {
                            }
                        };
                        $.extend(opts, options);
                        var Initials = $('.u-city-sort-initials');
                        var LetterBox = $('#letter');
                        var cityLi = $(".u-city-sort-list");
                        var citySelect = $(".u-city-cur-select");
                        var _li = "<li>A</li><li>B</li><li>C</li><li>D</li><li>E</li><li>F</li><li>G</li><li>H</li><li>I</li><li>J</li><li>K</li><li>L</li><li>M</li><li>N</li><li>O</li><li>P</li><li>Q</li><li>R</li><li>S</li><li>T</li><li>U</li><li>V</li><li>W</li><li>X</li><li>Y</li><li>Z</li>";

                        Initials.find('ul').append(_li);
                        initials('.u-city-sort-list', '.u-city-sort-box');

                        if (cityScrollBox) {
                            cityScrollBox.destroy();
                            $(cityScrollBox.scroller).attr('style', ''); // Required since the styles applied by IScroll might conflict with transitions of parent layers.
                            cityScrollBox = null;
                        } else {
                            var cityScrollBox = new IScroll("#citySortBox", {
                                probeType: 1,
                                useTransform: true,
                                tap: true,
                                click: true,
                                mouseWheel: false
                            });
                        }
                        //字母定位
                        $(".u-city-sort-initials ul li").on("click", function () {
                            var _this = $(this);
                            var LetterHtml = _this.html();
                            LetterBox.html(LetterHtml).show();

                            Initials.css('background', 'rgba(145,145,145,0.6)');

                            setTimeout(function () {
                                Initials.css('background', 'rgba(145,145,145,0)');
                                LetterBox.hide();
                            }, 1000);

                            var letter = _this.text();
                            var _letter = $('#' + letter);
                            if (_letter && _letter.length > 0) {
                                cityScrollBox.scrollToElement('#' + letter);
                            }
                        });

                        //选择城市
                        cityLi.on("click", function () {
                            var _name = $(this).data("name");
                            var _id = $(this).data("id");
                            citySelect.data("id", _id);
                            citySelect.data("name", _name);
                            citySelect.find("span b").html(_name);
                            opts.callback.call($(this), _id, _name);
                            THIS.storageSet({
                                "key": "city",
                                "val": {"id": _id, "name": _name}
                            })
                        });
                        var windowHeight = $(window).height();
                        var InitHeight = windowHeight - 45;
                        Initials.height(InitHeight);
                        var LiHeight = InitHeight / 28;
                        Initials.find('li').height(LiHeight);
                    }
                };
            },
            selectArea: function (options) {

                function _selectArea(options) {
                    if (!(this instanceof _selectArea)) {
                        return new _selectArea(options);
                    }
                    var rnd = Math.random().toString().replace('.', '');
                    this.id = 'scroller_' + rnd;
                    this.scroller = null;
                    this.data = null;
                    this.index = 0;
                    this.value = [0, 0, 0];
                    this.oldvalue = null;
                    this.text = ['', '', ''];
                    this.level = 3;
                    this.mtop = 30;
                    this.separator = ' ';
                    this.init(options);
                    return this;
                }

                _selectArea.prototype = {
                    init: function (settings) {
                        this.settings = $.extend({
                            eventName: 'click',
                            childKey: "child",
                            ejsUrl: "views/dhy/selectComponent.ejs"
                        }, settings);
                        this.trigger = $(this.settings.trigger);
                        var level = parseInt(this.settings.level);
                        this.level = level > 0 ? level : 3;
                        //this.trigger.attr("readonly", "readonly");
                        this.value = (this.settings.value && this.settings.value.split(",")) || [0, 0, 0];//初始值 id
                        this.text = this.settings.text || this.trigger.data('val') && this.trigger.data('val').split(' ') || ['', '', ''];//初始值 名称
                        this.oldvalue = this.value.concat([]);
                        this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
                        this.clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
                        this.getData();
                        this.bindEvent();
                    },
                    getData: function () {
                        var _this = this;
                        if (typeof this.settings.data == "object") {
                            this.data = this.settings.data;
                        } else {
                            $.ajax({
                                dataType: 'json',
                                cache: true,
                                url: this.settings.data,
                                type: 'GET',
                                success: function (result) {
                                    _this.data = result.data;
                                },
                                accepts: {
                                    json: "application/json, text/javascript, */*; q=0.01"
                                }
                            });
                        }
                    },
                    bindEvent: function () {
                        var _this = this;
                        //console.log(_this.trigger);
                        _this.trigger.on("click", function () {
                            $("body").append("<div id='tmpBar'></div>");
                            var tmpBar = $("#tmpBar");
                            App.reRender({
                                wrap: "#tmpBar",
                                url: _this.settings.ejsUrl,
                                data: {data: {}},
                                callback: function () {
                                    $('.u-select-nav-btn').on('click', function () {
                                        $('.u-select').toggleClass('u-select-active');
                                        $('.u-select-mask').toggleClass('u-mask-active');
                                    });
                                }
                            });
                            var mod = $(".u-select-mod"), wheels = mod.find(".u-select-wheels");
                            mod.removeClass("u-hidden");
                            wheels.attr({"id": _this.id});
                            _this.scroller = $('#' + _this.id);
                            _this.format();//循环格式化数据转换html

                            _this.mtop = wheels.find("ul li").height();
                            mod.find(".u-select-cancel").on("click", function () {
                                _this.cancel();
                                mod.addClass("u-hidden");
                                tmpBar.remove();
                            });
                            mod.find(".u-select-submit").on("click", function () {
                                _this.submit();
                                mod.addClass("u-hidden");
                                tmpBar.remove();
                            });
                            var start = 0,
                                end = 0;
                            _this.scroller.children().bind('tap', function (e) {
                                start = (e.changedTouches || e.originalEvent.changedTouches)[0].pageY;
                            });
                            _this.scroller.children().bind('touchmove', function (e) {
                                end = (e.changedTouches || e.originalEvent.changedTouches)[0].pageY;
                                var diff = end - start;
                                var dl = $(e.target).parent();
                                if (dl[0].nodeName != "UL") {
                                    return;
                                }
                                var top = parseInt(dl.css('top') || 0) + diff;
                                dl.css('top', top);
                                start = end;
                                return false;
                            });
                            _this.scroller.children().bind('touchend', function (e) {
                                end = (e.changedTouches || e.originalEvent.changedTouches)[0].pageY;
                                var diff = end - start;
                                var dl = $(e.target).parent();
                                if (dl[0].nodeName != "UL") {
                                    return;
                                }
                                var i = $(dl.parent()).index();
                                var top = parseInt(dl.css('top') || 0) + diff;
                                if (top > _this.mtop) {
                                    top = _this.mtop;
                                }
                                if (top < -$(dl).height() + 60) {
                                    top = -$(dl).height() + 60;
                                }
                                var mod = top / _this.mtop;
                                var mode = Math.round(mod);
                                var index = Math.abs(mode) + 1;
                                if (mode == 1) {
                                    index = 0;
                                }
                                _this.value[i] = $(dl.children().get(index)).attr('ref');
                                _this.value[i] == 0 ? _this.text[i] = "" : _this.text[i] = $(dl.children().get(index)).html();
                                for (var j = _this.level - 1; j > i; j--) {
                                    _this.value[j] = 0;
                                    _this.text[j] = "";
                                }
                                if (!$(dl.children().get(index)).hasClass('focus')) {
                                    _this.format();
                                }
                                $(dl.children().get(index)).addClass('focus').siblings().removeClass('focus');
                                dl.css('top', mode * _this.mtop);
                                return false;
                            });
                            return false;
                        });
                    },
                    format: function () {
                        var _this = this;
                        var child = _this.scroller.children();
                        this.f(this.data);//递归数据
                    },
                    f: function (data) {
                        var _this = this;
                        var item = data;
                        if (!item) {
                            item = [];
                        }
                        var str = '<ul><li ref="0">请选择</li>';
                        var focus = 0,
                            childData, top = _this.mtop;
                        if (_this.index !== 0 && _this.value[_this.index - 1] == "0") {
                            str = '<ul><li ref="0" class="focus">请选择</li>';
                            _this.value[_this.index] = 0;
                            _this.text[_this.index] = "";
                            focus = 0;
                        } else {
                            if (_this.value[_this.index] == "0") {
                                str = '<ul><li ref="0" class="focus">请选择</li>';
                                focus = 0;
                            }
                            for (var j = 0, len = item.length; j < len; j++) {
                                var pid = item[j].pid || 0;
                                var id = item[j].id || 0;
                                var cls = '';
                                if (_this.value[_this.index] == id) {
                                    cls = "focus";
                                    focus = id;
                                    childData = item[j][_this.settings.childKey];
                                    top = _this.mtop * (-j);
                                    console.log(_this.mtop);
                                }
                                str += '<li pid="' + pid + '" class="' + cls + '" ref="' + id + '">' + item[j].name + '</li>';
                            }
                        }
                        str += "</ul>";
                        var newdom = $(str);
                        newdom.css('top', top);
                        var child = _this.scroller.children();
                        $(child[_this.index]).html(newdom);
                        _this.index++;
                        if (_this.index > _this.level - 1) {
                            _this.index = 0;
                            return;
                        }
                        _this.f(childData);
                    },
                    submit: function () {
                        this.oldvalue = this.value.concat([]);
                        if (this.trigger[0].nodeType == 1) {
                            //input
                            this.trigger.data('val', this.text.join(this.separator));
                            this.trigger.data('value', this.value.join(','));
                            this.trigger.find(".txt").html(this.text.join(this.separator));
                        }
                        var hiddenInput = $(this.settings.trigger + "Hidden");
                        hiddenInput.val(this.value.join(','));
                        hiddenInput.data('val', this.text.join(this.separator));
                        this.settings.callback && this.settings.callback.call(this, this.scroller, this.text, this.value);
                        //选中后的回调，默认有填充trigger的value值，以及赋值它后面紧跟着的hidden的value值，以逗号分隔id，空格分隔文字
                    },
                    cancel: function () {
                        this.value = this.oldvalue.concat([]);
                    }
                };

                return _selectArea(options);
            },
            amount: function (options) {

                function _amount(options) {
                    if (!(this instanceof _amount)) {
                        return new _amount(options);
                    }
                    this.opts = {
                        wrap: ".u-count-form",
                        addTrigger: ".ucf-amount-increase",
                        reduceTrigger: ".ucf-amount-decrease",
                        input: ".ucf-amount-input",
                        stopEvent: true,
                        maxNum: null,
                        callback: function () {
                        }
                    };
                    $.extend(this.opts, options);
                    this.num = 1;
                    this.init();
                    return this;
                }

                _amount.prototype = {
                    init: function () {
                        var _this = this;
                        $.each($(this.opts.wrap), function (key, val) {
                            var _wrap = $(val);
                            _this.maxNum = _wrap.data("maxnum");
                            _this.triggerInput(_wrap);
                            _this.add(_wrap);
                            _this.reduce(_wrap);
                        });
                    },
                    triggerInput: function (wrap) {
                        var _this = this;
                        wrap.find(this.opts.input).on("blur.blurCount", function () {
                            var tempNum = $(this).val();
                            var patt1 = /^[1-9]\d*$/;
                            var bool = patt1.test(tempNum);
                            if (bool) {
                                _this.num = tempNum;
                                //console.log(num);
                            } else {
                                //alert("请正确输入大于0的数字");
                                $(this).val("1");
                            }
                            _this.opts.callback.call(_this, _this.num);
                        });
                        return this;
                    },
                    add: function (wrap) {
                        var _this = this;
                        wrap.find(_this.opts.addTrigger).on("click.addCount", function (event) {
                            if (_this.num > 0 && _this.num < _this.maxNum) {
                                _this.num++;
                            } else {
                                _this.num = 1
                            }
                            wrap.find(_this.opts.input).val(_this.num);
                            if (_this.opts.stopEvent) {
                                event.stopPropagation();
                            }
                            _this.opts.callback.call(_this, _this.num);
                        });
                        return this;
                    },
                    reduce: function (wrap) {
                        var _this = this;
                        wrap.find(_this.opts.reduceTrigger).on("click.reduceCount", function (event) {
                            if (_this.num > 1 && _this.num < _this.maxNum) {
                                _this.num--;
                            } else {
                                _this.num = 1;
                            }
                            wrap.find(_this.opts.input).val(_this.num);
                            if (_this.opts.stopEvent) {
                                event.stopPropagation();
                            }
                            _this.opts.callback.call(_this, _this.num);
                        });
                        return this;
                    }
                };

                return _amount(options)
            },
            singleSelect: function (options) {
                var opts = {
                    wrap: ".u-single-select",
                    callback: function () {

                    }
                };
                $.extend(opts, options);
                var wrap = $(opts.wrap);
                var trigger = wrap.find("li");
                trigger.on("tap", function () {
                    $(this).addClass("u-active").siblings().removeClass("u-active");
                    $(this).parents(opts.wrap).data("mid", $(this).data("mid")).data("mname", $(this).data("mname"));

                    opts.callback.call($(this), $(this).data("mid"), $(this).data("mname"));
                });
                trigger.eq(0).triggerHandler("tap");
                return this;
            },
            sessionSet: function (obj) {
                if (window.sessionStorage) {
                    sessionStorage.setItem(obj.key, JSON.stringify(obj.val));
                } else {
                    alert("当前环境不支持sessionStorage!");
                }
            },
            sessionGet: function (key) {
                if (window.sessionStorage) {
                    return JSON.parse(sessionStorage.getItem(key));
                } else {
                    alert("当前环境不支持sessionStorage!");
                }
            },
            sessionDel: function (key) {
                if (window.sessionStorage) {
                    sessionStorage.removeItem(key);
                } else {
                    alert("当前环境不支持sessionStorage!");
                }
            },
            scanCodePay: function (options) {
                var opts = {
                    app: null,
                    trriger: "#payScanCode",
                    callback: function (result) {
                        var _orderId = result.split(":")[1];
                        opts.app.getJSON("paypass/apporder?orderid=" + _orderId, function (pa) {
                            /*{"data":{"duration":10,"id":43691,"orderCode":"s001459556415554560","payeeId":69,"status":0,"orderAmount"
                             :12,"customerName":"太楚湘潭店","cashier":3559,"createTime":1450837995000},"code":"0000"}s001462507373151232
                             */
                            opts.app.component.storageSet({
                                key: "scanCodeOrder",
                                val: pa.data
                            });
                            location.href = "#/orderPayment?type=1&payMoney=" + pa.data.orderAmount;
                        });
                    }
                };
                $.extend(opts, options);
                if (wx && opts.app) {

                    $(opts.trriger).on("tap", function () {

                        wx.ready(function () {
                            wx.hideAllNonBaseMenuItem();
                            wx.scanQRCode({
                                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                                success: function (res) {
                                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果 p00:xxx
                                    opts.callback(result);
                                }
                            });
                        });

                    });

                } else {
                    console.warn("scanCodePay argument error!")
                }

            },
            ringMenu: function (options) {
                function _ringMenu(options) {
                    if (!(this instanceof _ringMenu)) {
                        return new _ringMenu(options);
                    }
                    this.opts = {
                        jumpUrl:["","","#/memberCenter"]
                    };
                    $.extend(this.opts, options);
                    this.init();
                }

                _ringMenu.prototype = {
                    init: function () {
                        var _body = $("body");
                        var _html = "";
                        _html += "<div id='ringMenu' class='m-ring-menu animated slideInLeft'>";
                        _html += "<div class='mrm-start'><i class='icon iconfont icon-danchuangzujianjia'></i></div>";
                        _html += "<div class='mrm-main u-hidden'><ul>";
                        _html += "<li class='mrm-go-back'><div class='mrm-icon-txt'><i class='icon iconfont icon-danchuangzujianfanhui'></i><h5>返回</h5></div></li>";

                        //_html += "<li class='mrm-jump' data-url='"+this.opts.jumpUrl[0]+"'><div class='mrm-icon-txt'><i class='icon iconfont icon-shouye'></i><h5>首页</h5></div></li>";
                        //_html += "<li class='mrm-jump' data-url='"+this.opts.jumpUrl[1]+"'><div class='mrm-icon-txt'><i class='icon iconfont icon-sousuo'></i><h5>搜索</h5></div></li>";
                        _html += "<li class='mrm-jump' data-url='"+this.opts.jumpUrl[2]+"'><div class='mrm-icon-txt'><i class='icon iconfont icon-gerenzhongxin'></i><h5>个人中心</h5></div></li>";

                        _html += "<li class='mrm-close'><div class='mrm-icon-txt'><i class='icon iconfont icon-danchuangzujianguanbi'></i></div></li>";
                        _html += "</ul></div>";
                        _html += "</div>";
                        _body.append(_html);

                        this.box = $("#ringMenu");
                        this.mask = $("#uMask");
                        this.openBtn = this.box.find(".mrm-start");
                        this.menu = this.box.find(".mrm-main");
                        this.closeBtn = this.menu.find(".mrm-close");
                        this.goBack=this.box.find(".mrm-go-back");
                        this.jumpBtn=this.menu.find(".mrm-jump");
                        this._triggerEvent();
                    },
                    _triggerEvent: function () {
                        var me = this;
                        me.openBtn.on("tap", function () {
                            me.mask.addClass("u-mask-active");
                            $(this).addClass("u-hidden");
                            me.menu.removeClass("u-hidden");
                        });
                        me.closeBtn.on("tap", function () {
                            me.mask.removeClass("u-mask-active");
                            me.openBtn.removeClass("u-hidden");
                            me.menu.addClass("u-hidden");
                        });
                        me.goBack.on("tap",function(){
                            history.back();
                            me.closeBtn.triggerHandler("tap");
                        });
                        me.mask.on("tap",function(){
                            me.closeBtn.triggerHandler("tap");
                        });
                        me.jumpBtn.each(function(key,value){
                              $(this).on("tap",function(){
                                  console.log($(this).data("url"));
                                  location.href=$(this).data("url");
                                  me.closeBtn.triggerHandler("tap");
                              });
                        });
                        var touch=require("public/static/js/component/touch");
                        var isMove=false;
                        var openBtn = me.openBtn.get(0);
                        var dx, dy;
                        var saveOffX=0,saveOffY=0;
                        touch.on(openBtn, 'touchstart', function(ev){
                            ev.preventDefault();
                            isMove=true;
                            dx=parseInt(me.box.css("left"));
                            dy=me.box[0].offsetTop;
                        });
                        touch.on(openBtn, 'drag', function(ev){
                            if(!isMove) return false;
                            var OffX=ev.x-saveOffX;
                            var OffY=ev.y-saveOffY;
                            if(me.openBtn.offset().left<10&&OffX<0) return false;
                            if(me.openBtn.offset().top<10&&OffY<0) return false;
                            var Left=dx+ev.x;
                            var positionLeft = Left + "px";
                            var positionTop = dy + ev.y + "px";
                            $("#msg").html(positionLeft+"OffX:"+OffX+"saveOffX:"+saveOffX)
                            saveOffX=ev.x;
                            saveOffY=ev.y;
                            if(Left>-lib.flexible.rem2px(1.73)){
                                me.box.css({
                                    left:positionLeft,
                                    top:positionTop
                                });
                            }else {
                                touch.trigger(openBtn, "dragend");
                            }

                        });
                        touch.on(openBtn, 'dragend', function(ev){
                            isMove=false;
                            saveOffX=0;
                            saveOffY=0;
                        });

                    }
                };
                return _ringMenu(options);
            }
        }
    };
});