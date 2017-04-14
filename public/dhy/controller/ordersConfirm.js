/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/12/1
 * Time: 16:22
 * 订单确认
 * */
'use strict';
define(function (require, exports, module) {
    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        var _giftId=App.getParam("giftId");
        var _storeid=App.getParam("storeid");
        var _storeAddress=decodeURI(App.getParam("storeAddress"));
        var _areaId=App.getParam("areaId");
        var _gaobi=App.getParam("gaobi");
        var _integral=App.getParam("integral");
        var _name=decodeURI(App.getParam("name"));
        var _image=App.getParam("image");
        var _transportfee=App.getParam("transportfee");
        var _shopFromType=App.getParam("shopFromType");//商品来源类型
        var product={
            "gaobi":_gaobi||"0",
            "integral":_integral||"0",
            "name":_name||"",
            "image":_image||"",
            "transportfee":_transportfee||"0",
            "shopMoney":_integral,
            "shopPayMoney":parseInt(_integral),
            "shopFromType":_shopFromType
        };
        App.getJSON("gift/inventory?areaId="+_areaId+"&giftid="+_giftId+"&storeid="+_storeid,function(res){
            if(res.code="0000"){
                var DeliveryType=res.data["delivery_type"];//"1,2,3,4" res.data["delivery_type"]
                if(DeliveryType){
                    //到货方式
                    var harvestType=DeliveryType;
                    var _harvestArr=[];
                    var harvestArr=[];

                    var deliveryArr=[];
                    var _deliveryArr=[];

                    if(harvestType.indexOf(",")==-1){
                        _harvestArr.push(harvestType);
                        _deliveryArr.push(harvestType);
                    }else{
                        _harvestArr=harvestType.split(",");
                        _deliveryArr=harvestType.split(",");
                    }

                    _harvestArr.forEach(function(item){
                        var tmp={};
                        if(item=="1"){
                            tmp["id"]=item;
                            tmp["name"]="门店自提";
                            harvestArr.push(tmp);
                        }else if(item=="2"){
                            tmp["id"]=item;
                            if(res.data["pay"]){
                                tmp["name"]="红包抵邮";
                            }else{
                                tmp["name"]="积分抵邮";
                            }
                            harvestArr.push(tmp);
                        }else if(item=="3"){
                            tmp["id"]=item;
                            tmp["name"]="到货付邮";
                            harvestArr.push(tmp);
                        }else if(item=="4"){
                            tmp["id"]=item;
                            tmp["name"]="第三方平台";
                            harvestArr.push(tmp);
                        }
                    });
                    console.log(harvestArr);
                }
                App.getJSON("account/address",function(res2){
                    if(res.code="0000"){
                        console.log(res2.data);

                        App.render({
                            url:_this.RouterTmpUrl,
                            data:{
                                title:_this.RouterTitle,
                                data:res.data,
                                storeAddress:_storeAddress,
                                address:res2.data,
                                product:product,
                                //deliveryArr:deliveryArr,
                                harvestArr:harvestArr
                            },
                            _this:_this
                        }).component.formInputChange();

                        var ShopMoney=$("#shopMoney");//商品总金额
                        var ShopPayMoney=$("#shopPayMoney");//需支付总金额
                        var totalPayMoney=$("#totalPayMoney");//需支付总金额2
                        var fee=$(".transportFee");
                        var payment=$("#payType");
                        var payTypeHtml=$(".payTypeStr");
                        var disttStr=$("#distributtypeStr");
                        //运费计算
                        var countTransport= function (type,_integral,_transportfee,numType){
                            var _numType=numType||0;//0整数 1浮点数
                            console.log("运费方式"+type+"运费计算...",_numType);
                            if(type=="1" || type=="3" || type=="4"){
                                ShopPayMoney.html(_integral.toFixed(2));
                                totalPayMoney.html(_integral.toFixed(2));
                                ShopMoney.html(_integral.toFixed(2));
                                totalPayMoney.data("redmoeny",_integral.toFixed(2));
                                fee.html("0");
                            }else if(type=="2"){
                                var tmpM=parseFloat(_integral)+parseFloat(_transportfee);
                                //console.log(_integral,_transportfee,"=====",typeof tmpM,tmpM);
                                ShopPayMoney.html(tmpM.toFixed(2));
                                totalPayMoney.html(tmpM.toFixed(2));
                                ShopMoney.html(_integral.toFixed(2));
                                totalPayMoney.data("redmoeny",tmpM.toFixed(2));
                                fee.html(_transportfee);
                            }else{
                                //组合情况或者其他
                                fee.html("0");
                            }
                        };
                        //界面初始化计算运费
                        if(DeliveryType){
                            countTransport(DeliveryType,_integral*totalPayMoney.data("num"),_transportfee);
                        }

                        //到货方式选择
                        App.component.singleSelect({
                            wrap:"#harvestType",
                            callback:function(){
                                //console.log(arguments,"++++++++++++++++");
                                var _sId=arguments[0];
                                var _str=arguments[1];
                                var _spayType=payment.data("paytype");
                                var _num=totalPayMoney.data("num");
                                var _shopMoeny=0;
                                var _payStyle=payment.data("paytype");
                                //支付方式不同计算
                                if(_payStyle=="0"){
                                    //积分
                                    _shopMoeny=_integral*_num;
                                }else if(_payStyle=="2" || _payStyle=="1"){
                                    //红包
                                    _shopMoeny=_gaobi*_num;
                                }else if(_payStyle=="4"){
                                    //微信
                                    _shopMoeny=_gaobi*_num;
                                }

                                //选择计算运费和金额
                                if(DeliveryType){
                                    ShopMoney.data("delivery",_sId);
                                    console.log("选择计算运费和金额...",DeliveryType,arguments,_sId,_shopMoeny,"fee",_transportfee);
                                    if(_spayType=="0"){
                                        //积分运费
                                        countTransport(_sId,_shopMoeny,_transportfee);
                                    }else if(_spayType=="2"){
                                        //红包运费
                                        var _redFee=parseFloat(_transportfee/100).toFixed(2);
                                        countTransport(_sId,_shopMoeny,_redFee);
                                    }else if(_spayType=="4"){
                                        //微信运费
                                        var _wxFee=parseFloat(_transportfee/100).toFixed(2);
                                        countTransport(_sId,_shopMoeny,_wxFee);
                                    }

                                }else if(_sId=="2"){
                                    _str="普通快递";
                                }

                                disttStr.html(_str);
                            }
                        });

                        //支付方式选择
                        App.component.singleSelect({
                            wrap:"#payType .u-normal-list",
                            callback:function(){
                                var _id=arguments[0];
                                var _name=arguments[1];
                                var _htType=$("#harvestType");
                                var _deliveryTypeVal=_htType.data("mid");
                                payment.data("paytype",_id);
                                console.log("支付方式选择",_id,"--",DeliveryType,"===",_deliveryTypeVal);
                                if(_id=="2"){
                                    payTypeHtml.html(""); //红包
                                    var redFee=parseFloat(_transportfee/100).toFixed(2);
                                    countTransport(_deliveryTypeVal,_gaobi*(totalPayMoney.data("num")),redFee,1);
                                    _htType.find("li").each(function(){
                                        var _mName=$(this).data("mname");
                                        if(_mName =="积分抵邮" || _mName =="微信抵邮" ){
                                            $(this).data("mname","红包抵邮");
                                            $(this).find(".g-label-lf").html("红包抵邮");
                                        }
                                    });
                                }else if(_id=="0"){
                                    payTypeHtml.html("积分");
                                    countTransport(_deliveryTypeVal,parseInt(_integral)*(totalPayMoney.data("num")),_transportfee);
                                    _htType.find("li").each(function(){
                                        var _mName=$(this).data("mname");
                                        if(_mName =="红包抵邮" || _mName =="微信抵邮" ){
                                            $(this).data("mname","积分抵邮");
                                            $(this).find(".g-label-lf").html("积分抵邮");
                                        }
                                    });
                                }else if(_id=="4"){
                                    var wxFee=parseFloat(_transportfee/100).toFixed(2);
                                    payTypeHtml.html("元");
                                    countTransport(_deliveryTypeVal,_gaobi*totalPayMoney.data("num"),wxFee,1);
                                    _htType.find("li").each(function(){
                                        var _mName=$(this).data("mname");
                                        if(_mName =="红包抵邮" || _mName =="积分抵邮" ){
                                            $(this).data("mname","微信抵邮");
                                            $(this).find(".g-label-lf").html("微信抵邮");
                                        }
                                    });
                                }
                            }
                        });

                        //计算
                        App.component.amount({
                            callback:function(){
                                var _payType=payment.data("paytype");
                                var tFee=_transportfee;//ShopMoney.data("fee")
                                totalPayMoney.data("num",parseInt(arguments[0]));
                                if(_payType=="0"){
                                    //积分运费
                                }else if(_payType=="2"){
                                    //红包运费
                                    tFee=parseFloat(_transportfee/100).toFixed(2);
                                }else if(_payType=="4"){
                                    //微信运费
                                    tFee=parseFloat(_transportfee/100).toFixed(2);
                                }
                                if(_payType=="0"){
                                    if(DeliveryType){
                                        countTransport(ShopMoney.data("delivery"),arguments[0]*parseInt(_integral),tFee);
                                    }
                                }else if(_payType=="2"){
                                    if(DeliveryType){
                                        countTransport(ShopMoney.data("delivery"),arguments[0]*_gaobi,tFee,1);
                                    }
                                }else if(_payType=="4"){
                                    if(DeliveryType){
                                        countTransport(ShopMoney.data("delivery"),arguments[0]*_gaobi,tFee,1);
                                    }
                                }
                            }
                        });
                        //提交订单
                        $("#orderConfirmBtn").on("click",function(){
                            var _totalPayBtn=$("#totalPayMoney");
                            var _receiverVal=$("#receiver").val();
                            var _telVal=$("#tel").val();
                            var _addressVal=$("#address").val();
                            var _distributtypeVal=$("#harvestType").data("mid");
                            var _num=_totalPayBtn.data("num");
                            var _redMoney=_totalPayBtn.data("redmoeny");//红包支付金额
                            if(/^[0-9]{11}$/.test(_telVal) && !/^\s*$/g.test(_receiverVal) && !/^\s*$/g.test(_addressVal)){
                                $("input").blur();
                                switch (payment.data("paytype"))
                                {
                                    case 0://积分支付
                                        App.postJSON("gift/create",{
                                            "giftid":_giftId,
                                            "storeid":_storeid,
                                            "receiver":_receiverVal,
                                            "tel":_telVal,
                                            "address":_addressVal,
                                            "distributtype":_distributtypeVal,
                                            "num":_num,
                                            "pay":0
                                        },function(res3){
                                            if(res3.code=="0000"){
                                                App.Popover.confirm("","恭喜您,创建订单成功!","继续积分换礼","进入礼品订单",true,function(){
                                                    window.location.href="#/pointsExchange"
                                                },function(){
                                                    window.location.href="#/pointsOders"
                                                });
                                            }
                                        });
                                        break;
                                    case 2://红包支付
                                        //App.getJSON("account/info",function(info){
                                        //    App.component.storageSet({key:"payPass","val":info.meber?info.meber.payPass:""});
                                        //    if(info.meber && info.meber.payPass){
                                        //        App.getJSON("/account/balance",function(redMoney){
                                        //            var regPwd=/^[\w]{6,20}$/;
                                        //            //支付密码输入
                                        //            App.Popover.payPwd({
                                        //                cont:"所需支付金额:"+_redMoney+"红包 "+"红包余额:"+redMoney.data.GBBALANCE,
                                        //                callback:function(){
                                        //                    //console.log(arguments);
                                        //                    var _mod=arguments[0];
                                        //                    var _modMask=arguments[1];
                                        //                    var _inputVal=arguments[2];
                                        //                    if(!regPwd.test(_inputVal)){
                                        //                        App.Popover.weak({txt:"支付密码输入错误,密码应为6-20位英文、数字下划线符号，请重新输入"});
                                        //                    }else{
                                        //                        _mod.remove();
                                        //                        _modMask.removeClass("u-mask-active");
                                        //                        App.postJSON("gift/create",{
                                        //                            "giftid":_giftId,
                                        //                            "storeid":_storeid,
                                        //                            "receiver":_receiverVal,
                                        //                            "tel":_telVal,
                                        //                            "address":_addressVal,
                                        //                            "distributtype":_distributtypeVal,
                                        //                            "num":_num,
                                        //                            "password":_inputVal,
                                        //                            "pay":2
                                        //                        },function(res3){
                                        //                            if(res3.code=="0000"){
                                        //                                App.Popover.confirm("","恭喜您,创建订单成功!","继续积分换礼","进入礼品订单",true,function(){
                                        //                                    window.location.href="#/pointsExchange"
                                        //                                },function(){
                                        //                                    window.location.href="#/pointsOders"
                                        //                                });
                                        //                            }
                                        //                        });
                                        //                    }
                                        //                }
                                        //            });
                                        //        });
                                        //    }else{
                                        //
                                        //        App.Popover.confirm("你尚未设置支付密码,请先设置","","取消","确定",true,function(){
                                        //
                                        //        },function(){
                                        //            window.location.href="#/resetPayPwd";
                                        //        });
                                        //    }
                                        //});
                                        break;
                                    case 4://微信支付

                                        App.postJSON("gift/prepay",{
                                            "distributtype":_distributtypeVal,
                                            "tel":_telVal,
                                            "address":_addressVal,
                                            "receiver":_receiverVal,
                                            "giftid":_giftId,
                                            "storeid":_storeid,
                                            "num":_num
                                        },function(d){
                                            var payData=JSON.parse(d.data.payRequestParamJsonstr);

                                            App.getJSON("weixin/sign?url=" +encodeURIComponent(window.location.href.split('#')[0]), function (data) {
                                                wx.config({
                                                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                                                    appId: data.appId, // 必填，公众号的唯一标识
                                                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                                                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                                                    signature: data.signature,// 必填，签名，见附录1
                                                    jsApiList: [
                                                        'onMenuShareTimeline',
                                                        'onMenuShareAppMessage',
                                                        'showMenuItems',
                                                        'hideAllNonBaseMenuItem',
                                                        'scanQRCode',
                                                        'chooseWXPay',
                                                        'hideMenuItems'
                                                    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                                                });
                                            });

                                            wx.ready(function () {

                                                wx.hideAllNonBaseMenuItem();

                                                wx.chooseWXPay({
                                                    timestamp: payData.timeStamp, // 支付签名时间戳
                                                    nonceStr: payData.nonceStr, // 支付签名随机串，不长于 32 位
                                                    package: payData.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                                                    signType:payData.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                                    paySign: payData.paySign, // 支付签名
                                                    success: function (payRes) {
                                                        var tips=JSON.stringify(payRes);
                                                        // 支付成功后的回调函数
                                                        if(payRes.errMsg == "chooseWXPay:ok"){
                                                            if(!_shopFromType){
                                                                App.Popover.confirm("","恭喜您,创建订单成功!","继续积分换礼","进入礼品订单",true,function(){
                                                                    window.location.href="#/pointsExchange";
                                                                },function(){
                                                                    window.location.href="#/pointsOders";
                                                                });
                                                            }else {
                                                                App.Popover.confirm("","恭喜您,创建订单成功!","继续爆款抢购","进入礼品订单",true,function(){
                                                                    window.location.href="secKill/?active=4";
                                                                },function(){
                                                                    window.location.href="#/pointsOders";
                                                                });
                                                            }

                                                        }else if(payRes.errMsg == "chooseWXPay:cancel"){

                                                            App.Popover.weak({txt:"支付取消!"});

                                                        }else if(payRes.errMsg == "chooseWXPay:fail"){

                                                            App.Popover.weak({txt:"支付失败!"});

                                                        }else{

                                                            App.Popover.weak({txt:"支付失败!"});
                                                        }

                                                    }
                                                });
                                            });

                                        });

                                        break;
                                    default:
                                        App.Popover.weak({txt:"支付方式不存在!请重新选择支付方式"});
                                        break;
                                }
                            }else if(!/^[0-9]{11}$/.test(_telVal)){
                                App.Popover.weak({txt:"请正确输入手机号码"});
                            }else if(/^\s*$/g.test(_receiverVal)){
                                App.Popover.weak({txt:"请正确输入联系人"});
                            }else if(/^\s*$/g.test(_addressVal)){
                                App.Popover.weak({txt:"请正确输入地址"});
                            }
                        });
                    }
                });
            }
        });

    };
});