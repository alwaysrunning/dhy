/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/4
 * Time: 16:12
 * 会员中心
 * */
'use strict';

define(function (require, exports, module){
    module.exports= function(){
        var _this=this;
        if(!App.pageAuth()){
            return false;
        }
        var channel = App.getParam('channel')||"V0101";
        var posCity=App.component.storageGet("city")||{"id":"430100000000","name":"长沙市"};
        var _babyNewUser=App.component.storageGet("babyNewUser");
        var _channelStore=App.component.storageGet("channel");
        var _shopCartNum=App.getParam("shopCartNum");
        var _muYin=false;
        var _accountId=App.component.storageGet("accountId");
        var _siebelId = App.component.storageGet("siebelId");

        if(_channelStore=="V0115" && _babyNewUser){
            _muYin=true;
           location.href = "/dhy/baby/improveMember";
           return;
        }
        App.getJSON("account/center",function(res){
            var _res=res;
            //渠道id
            if (!!channel) {
                console.log(channel,"===");
                App.component.storageSet({
                    key: 'channel',
                    val: channel
                });
            }

            //母婴判断
            if(channel && channel=="V0115"){
                _muYin=true;
                App.component.storageSet({
                    key: 'channel',
                    val: channel
                });

                if(_res.member.babyNewUser){
                    location.href="/dhy/baby/improveMember";
                    return;
                }
            }
            //用户id
            if(_res.member.accountId){
                _accountId=_res.member.accountId;
                App.component.storageSet({
                    key: "accountId",
                    val: _accountId
                });
            }

            //用户siebelId
            if(_res.member.siebelId){
                _siebelId=_res.member.siebelId;
                App.component.storageSet({
                    key: "siebelId",
                    val: _siebelId
                });
            }

            App.render({
                url:_this.RouterTmpUrl,
                data:{
                    title:_this.RouterTitle,
                    data:_res,
                    posCity:posCity,
                    channel:channel,
                    muYin:_muYin,
                    shopCartNum:_shopCartNum,
                    accountId:_accountId,
                    siebelId:_siebelId
                },
                _this:_this
            });

            var Store=new App.store();
            Store.set("localMobile",res.mobile);
            Store=null;
            App.component.storageSet({key:"payPass","val":res.member?res.member.payPass:""});

            //自助积分
            $("#selfPoints").on("tap",function(){
                location.href="#/selfPoints";
            });
            //快捷支付
            $("#quickPay").on("tap",function(){
                location.href="#/dev";
            });
            //商户订单
            // $("#shopOrder").on("tap",function(){
            //     location.href="/easy/jump?url="+decodeURIComponent(App.thirdHost.ry.host+"api/bubugao/integral");
            // });
            //店铺
            $("#bookmarkShop").on("tap",function(){
                location.href="#/dev";
            });
            //活动
            $("#bookActive").on("tap",function(){
                location.href="#/dev";
            });
            //切换账户
            $("#switchAccount").on("tap",function(){
                var _channel=channel||App.component.storageGet("channel");
                if(_channel){
                    location.href="#/login?reLogin=1&channel="+_channel;
                }else{
                    location.href="#/login?reLogin=1";
                }
            });
            // //卡包
            // $("#kaBao").on("tap",function(){
            //     location.href="/easy/jump?url="+decodeURIComponent(App.thirdHost.ry.host+"api/bubugao/kabaw");
            // });
        });
    };
});
