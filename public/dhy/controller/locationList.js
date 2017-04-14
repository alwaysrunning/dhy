/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/4
 * Time: 16:12
 * 城市定位·列表
 * */
'use strict';
define(function (require, exports, module) {
    module.exports=function(){
        var _this=this;
        //alert("城市定位");
        App.getJSON("area",function(res){
            console.log(res);
            if(res.code=="0000"){
                App.component.storageSet({
                    "key": "cityList",
                    "val":res.data
                });
                var _curCity=App.component.storageGet("city");

                var cityListRun=function(){
                    var _citySort=App.component.citySort();
                    _citySort.init({
                        callback:function(){
                            var _formUrl=decodeURIComponent(App.getParam("fromUrl"));
                            if(_formUrl){
                                if(_formUrl.indexOf("?")==-1){
                                    location.href=_formUrl+"?cityId="+arguments[0]+"&cityName="+decodeURIComponent(arguments[1]);
                                }else{
                                    location.href=_formUrl+"&cityId="+arguments[0]+"&cityName="+decodeURIComponent(arguments[1]);
                                }
                            }
                        }
                    });
                    var ch = (window.innerHeight > 0) ? window.innerHeight :window.screen.height;
                    $("#citySortBox").height(ch);

                    var _matchOk=$("#matchOk");
                    var _matchFail=$("#matchFail");

                    $("#changeCityBtn").on("click",function(){
                        _matchFail.addClass("u-hidden");
                        _matchOk.removeClass("u-hidden");
                    });
                };

                if(!_curCity && !window.DEBUG){
                    wx.ready(function () {

                        wx.hideAllNonBaseMenuItem();

                        wx.getLocation({
                            type: 'wgs84',
                            success: function (res) {
                                App.Popover.weak({txt:"自动定位成功..."});
                                getLocation(res);
                            },
                            fail:function(){
                                App.Popover.weak({txt:"自动定位失败..."});
                                _curCity={"id":"430100000000","name":"长沙市"};

                                App.render({
                                    url:_this.RouterTmpUrl,
                                    data:{title:_this.RouterTitle,data:res.data,curCity:_curCity},
                                    _this:_this
                                });

                                cityListRun();
                            },
                            cancel:function(){
                                App.Popover.weak({txt:"自动定位取消..."});
                                _curCity={"id":"430100000000","name":"长沙市"};

                                App.render({
                                    url:_this.RouterTmpUrl,
                                    data:{title:_this.RouterTitle,data:res.data,curCity:_curCity},
                                    _this:_this
                                });

                                cityListRun();
                            }
                        });
                    });
                }else{

                    App.render({
                        url:_this.RouterTmpUrl,
                        data:{title:_this.RouterTitle,data:res.data,curCity:_curCity||{"id":"430100000000","name":"长沙市"}},
                        _this:_this
                    });

                    cityListRun();
                }
                //匹配定位
                var getLocation=function(res,callback){
                    if(!res || !res.latitude && !res.longitude){
                        //长沙
                        res={
                            latitude:"28.12",//北纬
                            longitude:"113"//东经
                        };
                        //上海
                        //res={
                        //    latitude:"31.22",
                        //    longitude:"121.48"
                        //}
                    }
                    var _callback=callback||function(){};
                    App.getJSON("area/location?lat="+res.latitude+"&lng="+res.longitude,function(resArea){
                        console.log(resArea);
                        //alert(JSON.stringify(resArea));
                        if(resArea.code="0000"){
                            if(resArea.data.find){
                                var _curSelect=$(".u-city-cur-select");
                                _curSelect.data("id",resArea.data.find.id);
                                _curSelect.data("name",resArea.data.find.name);
                                _curSelect.find("span b").html(resArea.data.find.name);
                                //App.Popover.weak({txt:resArea.data.find.name});
                                App.component.storageSet({
                                    "key": "city",
                                    "val":{"id":resArea.data.find.id,"name":resArea.data.find.name}
                                });
                                var getFormUrl=App.getParam("fromUrl");
                                var formUrl=decodeURIComponent(getFormUrl);
                                if(getFormUrl){
                                    if(formUrl.indexOf("?")==-1){
                                        window.location.href=formUrl+"?cityId="+resArea.data.find.id+"&cityName="+decodeURIComponent(resArea.data.find.name);
                                    }else{
                                        window.location.href=formUrl+"&cityId="+resArea.data.find.id+"&cityName="+decodeURIComponent(resArea.data.find.name);
                                    }
                                }else{
                                    _callback();
                                }
                            }else {
                                //定位匹配没开放城市
                                var matchOkCity=$("#matchOk");
                                var matchFailCity=$("#matchFail");
                                matchOkCity.addClass("u-hidden");
                                matchFailCity.removeClass("u-hidden");
                                $("#curCityTxt").html(resArea.data.city);
                                $("#topCurCity").html(resArea.data.city);
                            }
                        }
                    });
                };
                //点击图标定位
                var autolocation=$("#autoLocation");
                autolocation.on("tap",function(){
                    App.Popover.weak({txt:"即将自动定位..."});
                    if(!window.DEBUG){
                        wx.ready(function () {
                            wx.getLocation({
                                type: 'wgs84',
                                success: function (res) {
                                    App.Popover.weak({txt:"自动定位成功..."});
                                    getLocation(res,function(){},true)
                                },
                                fail:function(){
                                    App.Popover.weak({txt:"自动定位失败..."});
                                },
                                cancel:function(){

                                }
                            });

                        });
                    }else {
                        getLocation(res);
                    }
                })
            }
        });
    };
});