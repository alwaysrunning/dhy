/**
 * Created by ricopter@qq.com on 2016/12/12.
 * 微信常用函数
 */
'use strict';
(function (win,$) {
    win.WxTools = {
        StorageSet: function (obj) {
            localStorage[obj.key] = JSON.stringify(obj.val);
        },
        StorageDel: function (key) {
            localStorage.removeItem(key);
        },
        StorageGet: function (key) {
            var _key = localStorage.getItem(key);
            return _key ? JSON.parse(_key) : _key;
        },
        //获取URL参数
        GetParam: function (item) {
            var sValue = location.hash.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
            //var isUrlCode =/\%+/ig; "[\?\&]" + item + "=([^\&]*)(\&?)", "i")
            return sValue ? sValue[1] : sValue;
        },
        //时间转换成毫秒
        ConvertTimeMs: function (timeStr, str) {
            var _str = str || ".";
            var _month = timeStr.substring(5, timeStr.lastIndexOf(_str));
            var _day = timeStr.substring(timeStr.length, timeStr.lastIndexOf(_str) + 1);
            var _year = timeStr.substring(0, timeStr.indexOf(_str));
            return Date.parse(_month + '/' + _day + '/' + _year)
        },
        //客户端时间计算
        GetNowFormatDate: function (str,isAll,ms) {
            var date = ms ? new Date(ms) : new Date();
            var _isAll=isAll?true:false;
            var seperator1 = str || "";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();

            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (minutes >= 0 && minutes <= 9) {
                minutes = "0" + minutes;
            }
            var res=year + seperator1 + month + seperator1 + strDate;
            if(_isAll){
                res += " "+hours+":"+minutes
            }
            return res;
        },
        FormatDate: function (dataObj, str) {
            var _data = dataObj;
            var sep = str || "-";
            var timeSep = ":";
            var year = _data.getFullYear();
            var month = _data.getMonth() + 1;
            var strDate = _data.getDate();
            var hours = _data.getHours();
            var minutes = _data.getMinutes();
            var seconds = _data.getSeconds();

            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (minutes >= 0 && minutes <= 9) {
                minutes = "0" + minutes;
            }
            var res = year + sep + month + sep + strDate + " " + hours + timeSep + minutes;

            return res.toString();
        },
        //求两个时间的天数差 日期格式为 YYYY.MM.dd
        DaysBetween: function (DateOne, DateTwo, str) {
            var _str = str || ".";
            var OneMonth = DateOne.substring(5, DateOne.lastIndexOf(_str));
            var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf(_str) + 1);
            var OneYear = DateOne.substring(0, DateOne.indexOf(_str));

            var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf(_str));
            var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf(_str) + 1);
            var TwoYear = DateTwo.substring(0, DateTwo.indexOf(_str));

            var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
            return cha;//Math.abs(cha)
        },
        getBetTimes: function () {
            var start = new Date();//开始时间
            var end = new Date();
        },
        //动态地图签名初始化
        MapLoader: function (options) {
            var opts={
                key:"OF5BZ-FQZKI-HIYGM-5NCLV-OJHIE-Q7BPV",
                success:function () {},
                err:function () {},
                libraries:"convertor"
            };
            $.extend(opts,options);
            if(!document.getElementById("QMaps")){
                window.initTheMap = function () {
                    opts.success(qq.maps)
                };
                var script = document.createElement('script');
                script.id="QMaps";
                script.type = 'text/javascript';
                //script.async = true;
                script.src = "http://map.qq.com/api/js?v=2.exp&libraries="+opts.libraries+"&callback=initTheMap&key=" + opts.key;
                if(script.onerror){
                    opts.err(script.onerror);
                }
                document.head.appendChild(script);
            }else{
                console.warn("qq maps already!")
            }
        },
        //html5获取地理位置
        getGeoInfo:function (options) {
            var opts={
                success:function () {},
                err:function () {},
                nonsupport:function () {}//不支持html5地理定位回调
            };
            $.extend(opts,options);
            var _this=this;

            if(navigator.geolocation) {

                console.log("%c开始获取地理位置坐标","color:green");

                navigator.geolocation.getCurrentPosition(function (position){
                    var _latitude = position.coords.latitude;
                    var _longitude = position.coords.longitude;


                    _this.MapLoader({
                        success:function (QMap) {
                            var currLatLng = new QMap.LatLng(parseFloat(_latitude),parseFloat(_longitude));

                            QMap.convertor.translate(currLatLng, 1,function (res){
                                var latLng = res[0]; //latLng.lat  latLng.lng
                                opts.success.call(this,QMap,currLatLng,latLng);
                            });
                        },
                        err:function (err) {
                            alert(err);
                        }
                    });

                },function (err) {
                    switch(err.code){
                        case err.TIMEOUT:
                            alert("连接超时，请重试");
                            break;
                        case err.PERMISSION_DENIED:
                            alert("您拒绝了使用位置共享服务!");
                            break;
                        case err.POSITION_UNAVAILABLE:
                            alert("亲爱的火星朋友，非常抱歉，我们暂时无法为您所在的星球提供位置服务");
                            break;
                        default:
                            alert(err.message);
                    }
                });
            }else{
                opts.nonsupport();
            }
        },
        //字符串截取
        cutString: function (str, len) {
            //length属性读出来的汉字长度为1
            if (str.length * 2 <= len) {
                return str;
            }
            var strlen = 0;
            var s = "";
            for (var i = 0; i < str.length; i++) {
                s = s + str.charAt(i);
                if (str.charCodeAt(i) > 128) {
                    strlen = strlen + 2;
                    if (strlen >= len) {
                        return s.substring(0, s.length - 1) + "...";
                    }
                } else {
                    strlen = strlen + 1;
                    if (strlen >= len) {
                        return s.substring(0, s.length - 2) + "...";
                    }
                }
            }
            return s;
        }
    };
})(this,$);


