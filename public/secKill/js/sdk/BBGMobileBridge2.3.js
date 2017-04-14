var BBGMobile = {
    Config: {
        userid: null,
        token: null,
        system: null,
        ver: null
    },
    ready: function (callback) {
        BBGMobile.exe(callback);
    },
    readyUser: function (callbackName) {
        BBGMobile.exe(function (bbg) {
            bbg.Config.ready(callbackName);
        });
    },
    exe: function (callback) {// 执行

        if (BBGMobile.isIOS()) {
            BBGMobile.IOS.ready(function () {
                callback.call(this, BBGMobile.IOS);
            });
        } else if (BBGMobile.isAndroid()) {
            BBGMobile.ANDROID.ready(function () {
                callback.call(this, BBGMobile.ANDROID);
            });
        }
    },
    log: function (message) {
        if (BBGMobile.isIOS()) {
            BBGMobile.IOS.log(message);
        } else if (BBGMobile.isAndroid()) {
            BBGMobile.ANDROID.log(message);
        }
    },
    isIOS: function () {
        return !!/ipad|iphone|mac/i.test(navigator.userAgent);
    },
    isAndroid: function () {
        return !!/android/i.test(navigator.userAgent);
    },
    IOS: {
        openCustomURLinIFrame: function (src) {
            var rootElm = document.documentElement;
            var newFrameElm = document.createElement("IFRAME");
            newFrameElm.setAttribute("style", "display: none;");
            newFrameElm.setAttribute("src", src);
            rootElm.appendChild(newFrameElm);
            // remove the frame now
            newFrameElm.parentNode.removeChild(newFrameElm);
        },
        calliOSFunction: function (functionName, args, successCallback, errorCallback) {
            var url = "BBGAPP://";
            var callInfo = {};
            callInfo.functionname = functionName;
            if (successCallback) {
                callInfo.success = successCallback;
            }
            if (errorCallback) {
                callInfo.error = errorCallback;
            }
            if (args) {
                callInfo.args = args;
            }
            url += JSON.stringify(callInfo);
            BBGMobile.IOS.openCustomURLinIFrame(url);
        },
        ready: function (callback) {
            callback.call(this, BBGMobile.IOS);
        },
        Config: {
            ready: function (callbackName) {
                var data = {
                    "funName": "BBGMobile.IOS.Config.init",
                    "callbackMethod": callbackName
                };
                BBGMobile.IOS.calliOSFunction("ready", data);
            },
            init: function (info) {
                info = JSON.parse(info);
                BBGMobile.Config.userid = info.userid;
                BBGMobile.Config.token = info.token;
                BBGMobile.Config.system = info.system;
                var method = info.callbackMethod;
                var funMethod = method + "(BBGMobile.Config)";
                eval(funMethod);
            }
        },
        Trade: {
            webPaySuccess: function (orderid, totalAmount, quantity, payType, other) {
                var data = {
                    "orderid": orderid,
                    "totalAmount": totalAmount,
                    "quantity": quantity,
                    "payType": payType,
                    "other": other
                };
                BBGMobile.IOS.calliOSFunction("webPaySuccess", data);
            }
        },
        Goods: {
            productIndex: function (prdouctid, shopid) {
                if (!shopid) {
                    shopid = "1";
                }
                var data = {
                    "prdouctid": prdouctid,
                    "shopid": shopid
                };
                BBGMobile.IOS.calliOSFunction("goodsProductIndex", data);
            },
            tgIndex: function (prdouctid, shopid) {
                if (!shopid) {
                    shopid = "1";
                }
                var data = {
                    "prdouctid": prdouctid,
                    "shopid": shopid
                };
                BBGMobile.IOS.calliOSFunction("goodsTgIndex", data);
            }
        },
        FerrisWheelAuth: {
            auth: function (data) {
                var authData = {
                    "funName": "BBGMobile.IOS.FerrisWheelAuth.do"
                };
                $.extend(authData, data);
                BBGMobile.IOS.calliOSFunction('ferrisWheelAuth', authData);

                //YunHouSDK.use('sdk.encrypt',function(encrypt){
                //    var secret = '1508c95281e097eaa916abbaf4d8aff1';
                //    data.parameters['cityId'] = "430100000000";
                //    var back = {
                //        system: "ios",
                //        timestamp: Math.round(new Date()),
                //        token: "77bd893dcec444debd168e177af05ae2",
                //        cityId: "430100000000"
                //    };
                //    back['sign'] = encrypt.encrypt(data.parameters,secret,back.timestamp);
                //    BBGMobile.IOS.FerrisWheelAuth.do(back);
                //});


                return BBGMobile.IOS.FerrisWheelAuth;
            },
            success: function (callback) {
                this.successCallback = callback;
                return BBGMobile.IOS.FerrisWheelAuth;
            },
            do: function (backData) {
                if (typeof backData == 'string') {
                    backData = JSON.parse(backData);
                }
                if (typeof this.successCallback == 'function') {
                    this.successCallback({
                        sign: backData['sign'],
                        cityId: backData['cityId'],
                        timestamp: backData['timestamp'],
                        token: backData['token']
                    });
                }
                return BBGMobile.IOS.FerrisWheelAuth;
            },
            editUserInfo:function(){
                BBGMobile.IOS.calliOSFunction('editUserInfo');
            },
            setTimeCallback:null,
            getTimes:function(){
                if (typeof this.setTimeCallback == 'function') {
                    //alert(typeof this.setTimeCallback);
                    //BBGMobile.IOS.log('回调成功');
                    this.setTimeCallback();
                }
                return BBGMobile.IOS.FerrisWheelAuth;
            }
        },
        log: function (message) {
            BBGMobile.IOS.calliOSFunction('log', {
                message: message
            });
        }
    },
    ANDROID: {
        ready: function (callback) {
            if (window.AndroidJavascriptBridge) {
                callback.call(this, BBGMobile.ANDROID);
            }
        },
        Config: {
            ready: function (callbackName) {
                if (AndroidJavascriptBridge && AndroidJavascriptBridge.ready) {
                    AndroidJavascriptBridge.ready("BBGMobile.ANDROID.Config.init", callbackName);
                }
            },
            init: function (info) {
                info = JSON.parse(info);
                BBGMobile.Config.userid = info.userid;
                BBGMobile.Config.token = info.token;
                BBGMobile.Config.system = info.system;
                var method = info.callbackMethod;
                var funMethod = method + "(BBGMobile.Config)";
                eval(funMethod);
            }
        },
        Trade: {
            webPaySuccess: function (orderid, totalAmount, quantity, payType, other) {
                AndroidJavascriptBridge.webPaySuccess(orderid, totalAmount, quantity, payType, other);
            }
        },
        Goods: {
            productIndex: function (prdouctid, shopid) {
                if (!shopid) {
                    shopid = "1";
                }
                AndroidJavascriptBridge.goodsProductIndex(prdouctid, shopid);
            },
            tgIndex: function (prdouctid) {
                if (!shopid) {
                    shopid = "1";
                }
                AndroidJavascriptBridge.goodsTgIndex(prdouctid);

            }
        },
        FerrisWheelAuth: {
            auth: function (data) {
                if (AndroidJavascriptBridge && AndroidJavascriptBridge.ferrisWheelAuth) {
                    data = JSON.stringify(data);
                    BBGMobile.ANDROID.log(data);
                    AndroidJavascriptBridge.ferrisWheelAuth("BBGMobile.ANDROID.FerrisWheelAuth.do", data);
                }

                //YunHouSDK.use('core.common.encrypt',function(encrypt){
                //    var secret = 'c1318e1e9e120e2b4a8aaef2bf81981a';
                //    data.parameters['cityId'] = "430100000000";
                //    var back = {
                //        system: "ios",
                //        timestamp: Math.round(new Date()),
                //        token: "d0c5c18b0f1f4103b6d60fb76756a4ec",
                //        cityId: "430100000000"
                //    };
                //    back['sign'] = encrypt.encrypt(data.parameters,secret,back.timestamp);
                //    BBGMobile.ANDROID.FerrisWheelAuth.do(back);
                //});


                return BBGMobile.ANDROID.FerrisWheelAuth;
            },
            success: function (callback) {
                this.successCallback = callback;
                return BBGMobile.ANDROID.FerrisWheelAuth;
            },
            do: function (backData) {
                if (typeof backData == 'string') {
                    backData = JSON.parse(backData);
                }
                if (typeof this.successCallback == 'function') {
                    this.successCallback({
                        sign: backData['sign'],
                        cityId: backData['cityId'],
                        timestamp: backData['timestamp'],
                        token: backData['token']
                    });
                }
                return BBGMobile.ANDROID.FerrisWheelAuth;
            },
            editUserInfo:function(){
                if (AndroidJavascriptBridge && AndroidJavascriptBridge.editUserInfo) {
                    AndroidJavascriptBridge.editUserInfo();
                }
            },
            setTimeCallback:null,
            getTimes:function(){
                if (typeof this.setTimeCallback == 'function') {
                    this.setTimeCallback();
                }
                return BBGMobile.ANDROID.FerrisWheelAuth;
            }
        },
        log: function (message) {
            if (AndroidJavascriptBridge && AndroidJavascriptBridge.log) {
                AndroidJavascriptBridge.log(message);
            }
        }
    }
};