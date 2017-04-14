/**
 * Created by xmm on 2015-04-25.
 */

(function (w) {
    var ios = {
        invoke: function (name, data) {
            var src = 'yunhouBridge://' + util.queryString(data);
            loadIframe(src);
        }
    };
    var android = {
        invoke: function (name, data) {
            if (AndroidJavascriptBridge && AndroidJavascriptBridge[name]) {
                AndroidJavascriptBridge[name](data);
            }
        }
    };
    var getUa = function () {
        return {
            ua: navigator.userAgent,
            ios: !!/ipad|iphone|mac/i.test(navigator.userAgent),
            android: !!/android/i.test(navigator.userAgent),
            weixin: !!/MicroMessenger/i.test(navigator.userAgent),
            app: !!/YunHou/i.test(navigator.userAgent),
            ver: navigator.userAgent.match(/YunHou\/([\d\.]+)/i) && navigator.userAgent.match(/YunHou\/([\d\.]+)/i)[1]
        };
    };
    var loadIframe = function (url) {
        var newFrameElm = document.createElement("IFRAME");
        var rootElm = document.documentElement;
        newFrameElm.setAttribute("style", "display: none;");
        newFrameElm.setAttribute("src", url);
        rootElm.appendChild(newFrameElm);
        // remove the frame now
        newFrameElm.parentNode.removeChild(newFrameElm);
    };
    var queryString = function (parmas) {
        var s = [], add = function (key, value) {
            value = typeof value === 'function' ? null : ( value == null ? "" : value );
            if (value) {
                s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            }
        };
        if (typeof parmas === 'object' && toString.apply(parmas) !== '[object Array]') {
            Object.keys(parmas).map(function (key) {
                add(key, parmas[key]);
            });
        }
        return s.join("&").replace('r20', "+");
    };
    var event = {};

    w.yh = {
        ua: getUa(),
        invoke: function (name, data) {
            if (data.success && typeof data.success === 'function') {
                event[name] = event[name] || {};
                event[name]['success'] = data.success;
            }
            if (data.error && typeof data.error === 'function') {
                event[name] = event[name] || {};
                event[name]['error'] = data.error;
            }

            if (this.ua.ios && this.ua.app) {
                ios.invoke(name, data);
            } else if (this.ua.android && this.ua.app) {
                android.invoke(name, data);
            } else if (!this.ua.app) {
                this.complete('error', name, '请在云猴内浏览此页面');
            } else {
                this.complete('error', name, '请使用android或ios系统浏览此页面');
            }
            return this;
        },
        complete: function (name, success, data) {
            var type = success ? 'success' : 'error';
            event[name] && event[name][type] && typeof event[name][type] === 'function' && event[name][type](data);
            return this;
        },
        ready: function (success, error) {
            return this.invoke('ready', {
                success: success,
                error: error
            });
        },
        jump: function (params, fail) {
            var src = typeof params == 'string' ? params : 'yunhou://yunhou.app/openwith?' + queryString(params);
            var timer = null;
            var time = 1000, timeBegin = Date.now(), timeEnd = 0;
            loadIframe(src);
            timer = setTimeout(function () {
                timeEnd = Date.now();
                clearTimeout(timer);
                if (!timeBegin || timeEnd - timeBegin < time + 200) {
                    fail && typeof fail === 'function' && fail({
                        code: '4000',
                        message: '跳转失败'
                    });
                }
            }, time);
            return this;
        },
        freshUA: getUa,
        old: {
            sign: function (params, success) {
                //字符化所有参数
                var paramToString = function (data) {
                    if (data) {
                        $.each(data, function (key, value) {
                            if (typeof value != 'string') {
                                data[key] = value.toString();
                            }
                        });
                        return data;
                    } else {
                        return '';
                    }
                };
                if (BBGMobile) {
                    BBGMobile.exe(function (platform) {
                        platform.FerrisWheelAuth.success(function (data) {
                            if (typeof success == 'function') {
                                success(data);
                            }
                        }).auth({
                            parameters: paramToString(params)
                        });
                    });
                }
                return this;
            },
            edit: function () {
                if (BBGMobile) {
                    BBGMobile.exe(function (platform) {
                        platform.FerrisWheelAuth.editUserInfo();
                    });
                }
                return this;
            }
        }
    };
})(window);
