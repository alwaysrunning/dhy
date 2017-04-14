/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/4
 * Time: 16:12
 * 积分换礼·商品详情
 * */
'use strict';
define(function (require, exports, module) {
    module.exports= function(){
        var _this=this;
        var _giftId=App.getParam("id");
        var posCity=App.component.storageGet("city")||{"id":"430100000000","name":"长沙市"};
        var _areaId=posCity.id;
        var _shopFromType=App.getParam("shopFromType")||undefined;
        var _robBuyState=App.getParam("robBuyState")||undefined;
        $(document).off('touchmove');
        App.getJSON("gift/detail?giftid="+_giftId,function(res){
            console.log(res);
            if(res.code=="0000"){
                App.getJSON("store/area?areaid="+_areaId+"&giftid="+_giftId,function(res3){
                    console.log(res3);
                    if(res3.data.length>0 && res3.data[0].stores.length>0){
                        var county=res3.data[0].stores[0]["county"];
                        var county_id=res3.data[0].stores[0]["county_id"];
                        var id=res3.data[0].stores[0]["id"];
                        var name=res3.data[0].stores[0]["name"];
                    }
                    App.render({
                        url:_this.RouterTmpUrl,
                        data:{
                            title:_this.RouterTitle,
                            data:res.data,
                            storesList:{"countyId":county_id||0,"id":id||0,"county":county,"name":name},
                            shopFromType:_shopFromType,
                            robBuyState:_robBuyState
                        },
                        _this:_this
                    });
                    //门店
                    var _shopAreaHiddenVal= $('#shopAreaHidden').val();
                    var PointsShopArea = App.component.selectArea({trigger:"#shopArea",value:_shopAreaHiddenVal,data:res3.data,childKey:"stores"});
                    //console.log(res3.data,"=====");
                    //var tmpResData=res3.data;
                    //$.each(tmpResData,function(key,val){
                    //    var _item=val;
                    //    if(val["stores"]){
                    //        val["sub"]= val["stores"];
                    //    }
                    //});
                    //console.log(tmpResData,"++++");
                    //$.rawCitiesData=res3.data;
                    //$("#shopArea").on("tap",function(){
                    //    $("#start").storesPicker({
                    //        title: "选择兑换门店"
                    //    });
                    //});
                    //slider
                    $('#slide1').swipeSlide({
                        continuousScroll:true,
                        lazyLoad : true,
                        speed : 3000,
                        transitionType : 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
                        firstCallback : function(i,sum,me){
                            me.siblings('.usm-ft').find('.u-slider-dot').children().first().addClass('u-active');
                        },
                        callback : function(i,sum,me){
                            me.siblings('.usm-ft').find('.u-slider-dot').children().eq(i).addClass('u-active').siblings().removeClass('u-active');
                        }
                    });
                    //兑换
                    function exchange($obj,callback){
                        var _callback=callback||function(){};
                        var _shopAreaHidden=$("#shopAreaHidden");
                        var _shopAreaArr=_shopAreaHidden.val().split(",");
                        var _tmpAreaId=_shopAreaArr[0];
                        var _storeid=_shopAreaArr[1];
                        var _gaobi=_shopAreaHidden.data("gaobi");
                        var _integral=_shopAreaHidden.data("integral");
                        var _name=_shopAreaHidden.data("name");
                        var _image=_shopAreaHidden.data("image");
                        var _transportfee=_shopAreaHidden.data("transportfee");


                        var _storeAddressBool=false;

                        if(!$obj.hasClass("u-btn-disabled")){
                            $obj.on("tap",function(){
                                var _storeAddress=_shopAreaHidden.data("val");
                                var _storeAddressArr=_storeAddress ? _storeAddress.split(" "):[];

                                if(_storeAddressArr.length>0 && _storeAddressArr[1].length>0){
                                    _storeAddressBool=true;
                                }
                                console.log(_shopAreaArr,_storeAddressArr,_storeAddressBool,"====");

                                if(_storeid && _storeid !=="0" && _storeAddressBool){
                                    if(!App.pageAuth()){
                                        return false;
                                    }
                                    var _shopFromType=App.getParam("shopFromType")||"";//商品来源类型
                                    App.getJSON("account/integration",function(exchangeRes){
                                        if(exchangeRes.code=="0000"){
                                            window.location.href="#/ordersConfirm?giftid="+_giftId+"&shopFromType="+_shopFromType
                                                +"&storeid="+_storeid
                                                +"&areaId="+_tmpAreaId
                                                +"&storeAddress="+_storeAddress
                                                +"&gaobi="+_gaobi
                                                +"&integral="+_integral
                                                +"&name="+_name
                                                +"&image="+_image
                                                +"&transportfee="+_transportfee;
                                        }
                                    });
                                    _callback();
                                }else{
                                    App.Popover.normal("请正确选择兑换门店","知道了",true);
                                }
                            });
                        }
                    }
                    exchange($(".u-btn-exchange"));
                    //滚动
                    var detailsMore=$("#detailsMore");
                    var pedPriceBar=$("#pedPriceBar");
                    var ppbH=pedPriceBar.offset().top;
                    var scrollWrap=$("#scrollWrap");
                    var scrollBox=$("#scrollBox");
                    if(detailsMore.children().size()==0){
                        detailsMore.css("min-height","auto");
                    }
                    //detailsMore.addClass("u-opacity-hidden");
                    //var ch = (this.innerHeight > 0) ? this.innerHeight : this.screen.height;
                    //console.log(detailsMore.height());
                    //scrollWrap.height(ch);

                    var tmpPriceBar=pedPriceBar.clone().attr({"id":"pedPriceBarTmp","class":"u-normal-list g-fixed-bar u-hidden"});
                    $("body").append(tmpPriceBar);

                    exchange($("#pedPriceBarTmp .u-btn-exchange"),function(){
                        $("#pedPriceBarTmp").remove();
                    });

                    var pedPriceBarTmp=$("#pedPriceBarTmp");
                    //detailsMore.addClass("u-opacity-hidden");

                    //$(document).on('touchmove',function (e) { e.preventDefault(); });

                    var gContent=scrollBox.parents(".g-content");
                    gContent.addClass("m-js-scroll");

                    window.myScroll = new IScroll(gContent.get(0),{
                        probeType:1,
                        useTransform:true,
                        tap:true,
                        click:true,
                        mouseWheel:true
                    });
                    window.myScroll.refresh();
                    window.myScroll.on('scrollEnd',function(){
                        var _tmpY=Math.abs(this.y);
                        var _maxY=$("#scrollBox").height();
                        //价格悬浮
                        if(_tmpY>=ppbH){
                            pedPriceBar.addClass("u-hidden");
                            pedPriceBarTmp.removeClass("u-hidden");
                        }else{
                            pedPriceBar.removeClass("u-hidden");
                            pedPriceBarTmp.addClass("u-hidden");
                        }
                        //加载详情 _maxY/8
                        //if(_tmpY>=10 && detailsMore.hasClass("u-opacity-hidden")){
                        //    detailsMore.removeClass("u-opacity-hidden");
                        //}
                        window.myScroll.refresh();
                    });
                });
            }
        });
    };
});