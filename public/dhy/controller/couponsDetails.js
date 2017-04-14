/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/4
 * Time: 16:12
 * 优惠券详情 type=1商城 2门店 3联盟  siebel 门店 member联盟 mall商城
 * */
'use strict';
define(function (require, exports, module) {
    module.exports= function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        var _type=App.getParam("type");
        var _couponid=App.getParam("couponid");
        var _giftid=App.getParam("giftid")||"";
        var _fromUrl=App.getParam("fromUrl");
        var queryType=[{name:"商城·优惠券",value:"mall"},{name:"门店·优惠券",value:"siebel"},{name:"联盟·优惠券",value:"member"}];
        var _areaid="430100000000";
        if(App.component.storageGet("city")){
            _areaid=App.component.storageGet("city")["id"];
        }

        queryType[17]={name:"优惠券",value:"YHQ"};
        queryType[19]={name:"第三方·优惠券",value:"DSFQM"};

        if( (_couponid || _giftid) && (_type=="3" || _type=="18" || _type=="20")){
            //联盟·优惠券·第三方
            //var _code=App.getParam("code")||"";
            var couponUrl="";
            var _codeid=App.getParam("codeid")||"";

            if(_type=="3" || _type=="18"){//联盟
                couponUrl="coupon/detail?couponid="+_couponid+"&type=member";
            }else if(_type=="20"){//第三方
                couponUrl="coupon/detail?type=third&giftid="+_giftid+"&codeid="+_codeid;
            }


            App.getJSON(couponUrl,function(res){
                console.log(res,_type);
                App.render({
                    url:_this.RouterTmpUrl,
                    data:{title:_this.RouterTitle,type:_type,data:res.data,codeid:_codeid},
                    _this:_this
                });
                $("head title").empty().html(queryType[_type-1]["name"]);//"·"+res.data["name"]

                if(_type!=="20"){
                    App.component.dropDown({
                        wrap:"#upSlider",
                        tmpArr:res.data && res.data["stores"]||[],
                        tmpUrl:"views/dhy/dropDownCouponsList.ejs"
                    });
                }

                var couponSubmit=$("#myUnionAccountFormSubmit");
                couponSubmit.on("click",function(){
                    var storeId=$("#selectStoreId").data("option-id")||"";
                    if(storeId){
                        location.href=$(this).data("href");
                    }else{
                        App.Popover.weak({txt:"请选择门店"});
                    }
                })

            });
        }else if(_type=="2"){
            //门店
            var _id=App.getParam("id");
            var _vendorDesc=App.getParam("vendorDesc");
            var _startTime=App.getParam("startTime");
            var _endTime=App.getParam("endTime");
            var _voucherName=App.getParam("voucherName");
            var _fourCheckNo=App.getParam("fourCheckNo");
            App.render({
                url:_this.RouterTmpUrl,
                data:{
                    title:_this.RouterTitle,
                    type:_type,
                    voucherNo:_id,
                    vendorDesc:_vendorDesc,
                    startTime:_startTime,
                    endTime:_endTime,
                    fourCheckNo:_fourCheckNo,
                    voucherName:decodeURI(_voucherName)
                },
                _this:_this
            });
            var _title=_voucherName?queryType[_type-1]["name"]+"·"+decodeURI(_voucherName):queryType[_type-1]["name"];//encodeURIComponent
            $("head title").empty().html(_title);
        }else{
            App.Popover.weak({txt:"该优惠券详情暂无相关数据...",callback:function(){
                if(_fromUrl){
                    location.href=decodeURIComponent(_fromUrl);
                }
            }})
        }
    };
});
