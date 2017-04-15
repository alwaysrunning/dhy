/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2016/3/18
 * Time: 11:06
 * */
'use strict';
define(function (require, exports, module) {

    var AppComponent = require("public/static/js/component/component").AppComponent;

    var App = {
        component: AppComponent,
        version: "v0.1",
        domain: "",
        ajaxHost: "/api/",
        //事件
        on: function (element, eventName, fun) {
            element.addEventListener(eventName, fun);
        },
        off: function (element, eventName, fun) {
            element.removeEventListener(eventName, fun);
        },
        //控制器
        Controller: {},
        //路由
        Router: function (router, selector) {
            var _app = this;

            function Router(router, selector) {
                var _this = this;
                this.selector = selector;
                this.routerMap = {};
                this.RouterTitle = "";
                this.parameters = "";
                this.RouterTmpUrl = "";
                this.change = function (callback) {
                    var _callback = callback || function () {
                        };
                    //路由变化绑定的全局回调
                    //iScroll清除
                    $(document).off();
                    if (window.myScroll) {
                        window.myScroll.destroy();
                        $(window.myScroll.scroller).attr('style', '').parent().removeClass("m-js-scroll");
                        window.myScroll = null;
                        $(document).off();
                        $(".scroll-mod").removeClass("u-scroll-inside");
                    }
                    //原生滚动条和Scroll重定位
                    document.querySelector("#gContent").scrollTop ? document.querySelector("#gContent").scrollTop = 0 : "";
                    //picker清除
                    $(".close-picker").trigger("click");
                    _callback();
                };
                for (var path in router) {
                    if (!router.hasOwnProperty(path)) continue;
                    this.routerMap[path] = {
                        title: router[path]["title"],
                        path: path,
                        ctrl: router[path]["controller"],
                        tmpUrl: router[path]["templateUrl"],
                        extend: router[path]["extend"] || {},
                        change: router[path]["change"] || function () {
                        }
                    };
                    if(path.search(/other/) == -1) {
                        //console.log(path,path.search(/other/));
                        this.routerMap["/other"] = {
                            title: "404",
                            path: "/other",
                            ctrl: function () {
                                console.warn("hello 404!");
                                var $_this = this;
                                App.render({
                                    url: $_this.RouterTmpUrl,
                                    data: {title: $_this.title},
                                    _this: $_this
                                });
                            },
                            tmpUrl: "views/dhy/404.ejs",
                            extend: {}
                        };
                    }
                }

                //匹配路由
                this.matchRouter = function (routeStr, _pat) {
                    for (var x in this.routerMap) {
                        var _route = this.routerMap[x];
                        _route.path.length > 1 ? _pat = new RegExp(routeStr, "i") : _pat = new RegExp("^" + routeStr + "$", "i");
                        var matchBool = _pat.test(_route.path);
                        if (matchBool) {
                            this.RouterCtrl = _route["ctrl"] || function () {console.warn("controllers function is no here!")};
                            this.RouterTmpUrl = _route["tmpUrl"];
                            this.RouterTitle = _route["title"];
                            this.RouterExtend = _route["extend"];
                            this.RouterChange = _route["change"] || function () {};
                            //单独控制路由变化绑定回调
                            return this.RouterTmpUrl;
                        }
                    }
                    return false;
                };

                this.init().watch();
                return this;
            }

            Router.prototype.init = function (routes) {
                var routeStr = routes || window.location.hash.substr(1);
                var _pat = null, _this = this;
                this.next ? this.next = null : this.next = function () {
                };
                if (routeStr.search(/^\/\?|^\/\S+\?/ig) !== -1) {
                    //console.warn("test...!",routeStr);
                    this.parameters = routeStr.match(/(\?|\&)\S+/)[0].replace(/(\?{1}|\&{1})/, "");
                    routeStr = routeStr.match(/^\/(\?|\S)+?(?=(\&|\?))/ig);
                    //console.warn("routeStr:",routeStr);
                } else {
                    this.parameters = "";
                }
                var _bool = this.matchRouter(routeStr, _pat);
                if (!_bool) {
                    console.warn("router is not here!", routeStr,routeStr.search(/\s/));
                    location.hash = "#/other";
                    // if(routeStr.search(/\s/)!==-1){
                    //     location.hash = "#/memberCenter";
                    // }else{
                    //     location.hash = "#/other";
                    // }
                } else {
                    _app.tmpUrl = _bool;
                    _this.RouterCtrl.call(_this, _this.parameters);
                }
                return this;
            };

            Router.prototype.watch = function () {
                var _this = this;
                _app.on(window, 'hashchange', function () {
                    _this.init(window.location.hash.substr(1)).change();
                    _this.RouterChange();
                    //全局更新channel
                    console.log("===hashchange=====",window.location.hash.substr(1));
                    //todo 每次切换保存当前地址参数
                });
                return this;
            };

            new Router(router, selector);
            return this;
        },
        //模版引擎
        render: function (obj) {//{url*,data,next,element,_this*,animateBool}
            var _data = obj.data || {version: this.version, title: "title"},
                _element = obj.element || "#wrap",
                _next = obj.next || function () {
                    },
                _wrap = $(_element),
                _routerExtend = obj._this.RouterExtend,
                _animateBool = obj.noAnimate || "open",
                _result = new EJS({url: obj.url}).render(_data),
                _device = $.device,
                $body = $('body'),
                _gBody = _wrap.find(".scroll-mod");

            _gBody.empty().html(_result);

            $("head title").empty().html(_data.title || "title");
            //时间清除
            if ($body.stopTime) {
                $body.stopTime();
            }
            // hack在微信IOS等webview中无法修改document.title的情况
            if (_device.iphone || _device.ios) {
                var $iframe = $('<iframe src="/favicon.ico" style="display: none;width: 0;height: 0;"></iframe>');
                $iframe.on('load', function () {
                    setTimeout(function () {
                        $iframe.off('load').remove();
                    }, 0);
                }).appendTo($body);
            }

            if (_animateBool == "open" && _routerExtend.animation) {
                _gBody.toggleClass("animated").toggleClass(_routerExtend.animation);
            } else if (_animateBool == "open" && !_routerExtend.animation) {
                _gBody.toggleClass("animated").toggleClass("fadeIn");//slideInRight
            } else {

            }

            _next();
            return this;
        },
        reRender: function (obj) {
            var _result = new EJS({url: obj.url}).render(obj.data), _callback = obj.callback || function () {};
            $(obj.wrap).empty().html(_result);
            _callback();
            return this;
        },
        //本地存储
        store: function () {

            function _localStorage() {
                this.s = localStorage;
                return this;
            }

            _localStorage.prototype = {
                init: function (options) {
                    this.options = {
                        expires: 200 * 60 * 60000,//60000毫秒1分钟 2*60*60000 默认2小时
                        domain: window.location.host,
                        path: "/",
                        secure: "",
                        val: ""
                    };
                    for (var x in options) {
                        this.options[x] = options[x];
                    }
                },
                check: function (key) {
                    return this.get(key);
                },
                set: function (key, val, _options) {
                    this.init(_options);
                    var date = new Date();
                    this.options.expires = date.getTime() + this.options.expires;
                    this.options.val = val;
                    this.s.setItem(key, JSON.stringify(this.options));
                    return this.options;
                },
                get: function (key) {
                    var _date = new Date(), currentTime = _date.getTime();
                    var _value = this.s.getItem(key);
                    if (typeof _value != 'string') {
                        return undefined
                    }
                    return JSON.parse(_value);
                },
                getAll: function () {
                    var ret = {};
                    for (var i = 0; i < this.s.length; i++) {
                        var key = this.s.key(i);
                        ret[key] = this.get(key);
                    }
                    return ret;
                },
                remove: function (key) {
                    this.s.removeItem(key);
                },
                clear: function () {
                    this.s.clear();
                }
            };

            function _cookieStore(options) {
                this.s = document.cookie;
            }

            _cookieStore.prototype = {
                init: function (options) {
                    this.options = {
                        expires: 2 * 60 * 60000,//60000毫秒1分钟  默认2小时
                        domain: window.location.host,
                        path: "/",
                        secure: "",
                        val: ""
                    };
                    for (var x in options) {
                        this.options[x] = options[x];
                    }
                },
                check: function (key) {
                    return this.get(key);
                },
                set: function (name, value, _options) {
                    this.init(_options);
                    var date = new Date();
                    this.options.expires = date.getTime() + this.options.expires;
                    this.options.val = value;
                    var valueToUse = "",
                        expires = this.options.expires,
                        path = this.options.path,
                        secure = this.options.secure;

                    if (this.options.val !== undefined && typeof(this.options.val) === "object") {
                        valueToUse = JSON.stringify(this.options)
                    } else {
                        valueToUse = encodeURIComponent(this.options)
                    }
                    this.s = name + "=" + valueToUse + (expires ? ("; expires=" + new Date(expires).toUTCString()) : '') +
                        "; path=" + (path || '/') + (secure ? "; secure" : '');
                },
                get: function (name) {
                    var _date = new Date(), currentTime = _date.getTime();
                    var cookies = this.getAllRawOrProcessed(false);
                    if (cookies.hasOwnProperty(name)) {
                        return this.processValue(cookies[name]);
                    } else {
                        return undefined;
                    }
                },
                processValue: function (value) {
                    if (value.substring(0, 1) == "{") {
                        try {
                            return JSON.parse(value);
                        }
                        catch (e) {
                            return value;
                        }
                    }
                    if (value == "undefined") return undefined;
                    return decodeURIComponent(value);
                },
                getAllRawOrProcessed: function (process) {
                    //process - process value or return raw value
                    var cookies = document.cookie.split('; '), s = {};
                    if (cookies.length === 1 && cookies[0] === '') return s;
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = cookies[i].split('=');
                        if (process) s[cookie[0]] = this.processValue(cookie[1]);
                        else s[cookie[0]] = cookie[1];
                    }
                    return s;
                },
                getAll: function () {
                    return this.getAllRawOrProcessed(true);
                },
                remove: function (name) {
                    this.set(name, "", -1);
                },
                clear: function () {
                    var cookies = this.getAll();
                    for (var i in cookies) {
                        this.remove(i);
                    }
                    return this.getAll();
                }
            };

            if (typeof localStorage == 'undefined') {
                return new _cookieStore();
            } else {
                return new _localStorage();
            }
        },
        Popover: AppComponent.modal(),
        //公用方法
        init: function () {
            var _this = this;
            _this.Popover = AppComponent.modal();
            window.scrollTo(0, 1);//收起地址栏
            //$("#wrap .g-body").addClass("animated").addClass("slideInRight");
            // AppComponent.ringMenu({
            //     jumpUrl: ["", "", "#/memberCenter"]
            // });
            //ajax
            $.extend($.ajaxSettings, {
                beforeSend: function () {
                    _this.Popover.loading("正在加载...");
                },
                complete: function () {
                    _this.Popover.loading("", true);
                },
                error: function (xhr) {
                    var errorTxt = "";
                    var codeTxt = "";
                    //console.log(xhr,xhr.status,"=====");
                    switch (xhr.status) {
                        case(500):
                            codeTxt = JSON.parse(xhr.response).code;
                            errorTxt = JSON.parse(xhr.response).message;
                            //errorTxt="服务器内部错误";
                            break;
                        case(401):
                            errorTxt = "未授权";
                            _this.Popover.normal(errorTxt, "知道了", true);
                            break;
                        case(403):
                            errorTxt = "无权限";
                            _this.Popover.normal(errorTxt, "知道了", true);
                            break;
                        case(404):
                            errorTxt = "请求未找到";
                            _this.Popover.normal(errorTxt, "知道了", true);
                            break;
                        case(408):
                            errorTxt = "请求超时";
                            _this.Popover.normal(errorTxt, "知道了", true);
                            break;
                        //default:
                        //errorTxt="未知错误";
                    }

                    if (xhr.status == "500" && (codeTxt == "200010002")) {
                        //没有登录
                        var Store = new _this.store();
                        if (Store.check("LoginBool")) {
                            Store.remove("LoginBool");
                        }
                        _this.Popover.weak({
                            txt: errorTxt, callback: function () {
                                _this.Popover.loading("", true);
                                location.href = "#/login?fromUrl=" + encodeURIComponent(location.hash ? location.hash : location.href);
                            }
                        });
                        Store = null;
                    } else if (xhr.status == "500" && codeTxt == "1010") {
                        _this.Popover.normal(errorTxt, "知道了", true, function () {
                            location.href = "#/personalInfo?mobile=" + App.component.storageGet("localMobile")["val"] + "&fromUrl=" + encodeURIComponent(location.hash);
                        });
                    } else if (xhr.status == "500" && codeTxt == "9998") {
                        switch (errorTxt) {
                            case "券码已使用":
                                _this.Popover.weak({
                                    txt: "卡券号已兑换"
                                });
                                break;
                            case "券码已过期":
                                _this.Popover.weak({
                                    txt: "卡券号已过期"
                                });
                                break;
                            case "券码兑换异常":
                                _this.Popover.weak({
                                    txt: "卡券号兑换异常"
                                });
                                break;
                            default:
                                _this.Popover.normal(errorTxt, "返回", true, function () {
                                    location.href = "#/selfPoints"
                                });
                        }

                    } else if (xhr.status == "500") {
                        _this.Popover.normal(errorTxt, "知道了", true);
                    }

                }
            });
            //默认事件
        },
        getParam: function (item) {
            var sValue = location.hash.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
            return sValue ? sValue[1] : sValue;
        },
        postJSON: function (method, data, callback) {
            return $.post(App.ajaxHost + method, data, callback, "json");
        },
        getJSON: function (url, callback) {
            return $.getJSON(App.ajaxHost + url, callback)
        },
        ajaxJSON: function (options) {
            var opts = {url: App.ajaxHost + options.url};
            $.extend(options, opts);
            return $.ajax(options);
        },
        ajax: function (url, parms) {
            parms = parms || {};
            var req = new XMLHttpRequest(),
                post = parms.post || null,
                callback = parms.callback || null,
                timeout = parms.timeout || null;

            req.onreadystatechange = function () {
                if (req.readyState != 4) return;

                // Error
                if (req.status != 200 && req.status != 304) {
                    if (callback) callback(false);
                    return;
                }

                if (callback) callback(req.responseText);
            };

            if (post) {
                req.open('POST', App.ajaxHost + url, true);
                req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            } else {
                req.open('GET', App.ajaxHost + url, true);
            }

            req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            req.send(post);

            if (timeout) {
                setTimeout(function () {
                    req.onreadystatechange = function () {
                    };
                    req.abort();
                    if (callback) callback(false);
                }, timeout);
            }
        },
        getPromise: function (url) {
            var defer = $.Deferred();
            $.getJSON(App.ajaxHost + url, function (res) {
                defer.resolve(res);
            });
            return defer.promise();
        },
        strUnicode: function (str) {
            var unicodeStr = "";
            for (var i = 0; i < str.length; i++) {
                var temp = str.charCodeAt(i).toString(16);
                unicodeStr += "\\u" + new Array(5 - String(temp).length).join("0") + temp;
            }
            return unicodeStr;
        },
        //微信权限
        wxAuth: function (callback) {
            var _callback = callback || function () {};
            var _this = this;
            var Store = new _this.store();
            var sup =  _this.getParam('ref') || '';

              $.ajax({
                type:"POST",
                url:"api/check",
                data:{
                    url: encodeURIComponent(location.href)
                },
                async:false,
                success:function (res) {
                    var _code=res.code.toString();
                    if(res.code == "9999"){
                        Store.set("LoginBool", false);
                        window.location.href = res.redirectUrl;
                    }else{
                        if(res.code == "2222"){
                            Store.set("LoginBool", false);
                        }else{
                            Store.set("LoginBool", res.code == "0000");//已经登录
                        }
                        _callback();
                    }
                }
               });
        },
        //页面权限
        pageAuth: function (callback) {
            var _this = this;
            var Store = new _this.store();
            var loginBool = Store.check("LoginBool") ? Store.check("LoginBool").val : false;
            var res = null;
            var _callback = callback || function () {
                };
            var tUrl = encodeURIComponent(location.hash ? location.hash : location.href);
            var getCookie=_this.component.getCookie;
            var tokenid = getCookie('tokenid');
            if (loginBool) {
                console.log("you are logged in ");
                res = true;
                _callback();
            } else {
                console.warn("you are No access! please log in");
                res = false;
                var _channel=App.getParam('channel')||App.component.storageGet('channel');
                App.Popover.weak({
                    txt: "您尚未登录或者登录过期,请先登陆", callback: function () {
                        setTimeout(function () {
                            if(tokenid && tokenid !== undefined && /superapp/ig.test(tokenid)){   // 如果是超级app登录失效的话就跳转到超级app的登录界面
                                location.href = 'http://wx.yunhou.com/super/passport/login';
                            }else{
                                location.href = "#/login?channel="+_channel+"&fromUrl=" + tUrl;
                            }   
                        }, 2000);
                    }
                });
            }
            Store = null;
            return res;
        },
        formatSeconds: function (value) {
            var theTime = parseInt(value);// 秒
            var theTime1 = 0;// 分
            var theTime2 = 0;// 小时
            if (theTime > 60) {
                theTime1 = parseInt(theTime / 60);
                theTime = parseInt(theTime % 60);
                if (theTime1 > 60) {
                    theTime2 = parseInt(theTime1 / 60);
                    theTime1 = parseInt(theTime1 % 60);
                }
            }
            var result = "" + parseInt(theTime) + "秒";
            if (theTime1 > 0) {
                result = "" + parseInt(theTime1) + "分" + result;
            }
            if (theTime2 > 0) {
                result = "" + parseInt(theTime2) + "小时" + result;
            }
            return result;
        },
        thirdHost: {
            //容易 http://manage.wx.rongyi.com/
            ry: {
                host: (function () {
                    if (window.DEV) {
                        return "http://weixin.preview.rongyi.com/"
                    } else {
                        return 'http://manage.wx.rongyi.com/'
                    }
                })()
            }
        }
    };
    window.App = App; //全局暴露App
    module.exports = App;
});