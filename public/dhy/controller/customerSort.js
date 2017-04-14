/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/4
 * Time: 16:12
 * 客服列表详情 customer/shop lat=28.12&lng=113
 * */
'use strict';
define(function (require, exports, module){
    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        var _sellerid=App.getParam("id");
        var _debug=window.DEBUG;

        function getLocation(res){
            //伪造长沙
            if(!res || !res.latitude && !res.longitude){
                res={
                    latitude:"28.12",
                    longitude:"113"
                }
            }
            App.getJSON("area/location?lat="+res.latitude+"&lng="+res.longitude,function(resArea){
                console.log(resArea);
                if(resArea.code="0000"){
                    var _areaid=resArea.data["find"]["id"];
                    if(_areaid){
                        App.getJSON("customer/shop?sellerid="+_sellerid+"&areaid="+_areaid+"&page=1&pagesize=10",function(res){
                            console.log(res);
                                App.render({
                                    url:_this.RouterTmpUrl,
                                    data:{title:_this.RouterTitle,data:res.data},
                                    _this:_this
                                });

                                App.component.scrollLoading({
                                    wrapper: "#customerWrap",
                                    list: "#customerList",
                                    ejsUrl: "views/dhy/scrollCustomerSort.ejs",
                                    getUrl: function (page, pageSize) {
                                        return "customer/shop?sellerid="+_sellerid+"&areaid="+_areaid+"&page="+page+"&pagesize="+pageSize
                                    },
                                    totalPage: function (data) {
                                        var result = false;
                                        if (data) {
                                            var _total = data["total"];
                                            var _count = data["pagesize"];
                                            var _index = data["page"];
                                            var _maxPageSize = _count !== 0 ? Math.ceil(_total / _count) : 0;
                                            if (_index <= _maxPageSize) {
                                                result = _maxPageSize
                                            } else {
                                                console.log("page error!");
                                                App.Popover.weak({txt: "没有了更多内容了..."});
                                            }
                                        }
                                        return result;
                                    }
                                });

                        });
                    }else{
                        App.render({
                            url:_this.RouterTmpUrl,
                            data:{title:_this.RouterTitle,data:[]},
                            _this:_this
                        });
                    }
                }
            });
        }

        if(!window.DEBUG){

            //App.getJSON("weixin/sign?url=" + encodeURIComponent(window.location.href.split('#')[0]), function (data) {
            //    wx.config({
            //        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            //        appId: data.appId, // 必填，公众号的唯一标识
            //        timestamp: data.timestamp, // 必填，生成签名的时间戳
            //        nonceStr: data.nonceStr, // 必填，生成签名的随机串
            //        signature: data.signature,// 必填，签名，见附录1
            //        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'showMenuItems', 'hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            //    });
            //});

            wx.ready(function () {
                wx.getLocation({
                    type: 'wgs84',
                    success: function (res) {
                        getLocation(res);
                    },
                    fail:function(){
                        App.Popover.weak({txt:"城市定位失败..."});
                    },
                    cancel:function(){

                    }
                });
                wx.hideAllNonBaseMenuItem();
            });
        }else{
            getLocation();
        }

    };
});