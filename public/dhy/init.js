/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2016/4/7
 * Time: 10:28
 * */
'use strict';
define(function (require, exports, module){

    window.DEBUG = window.DEV;
    if(!window.DEBUG){
        //alert(encodeURIComponent(window.location.href.split('#')[0]));
        //alert(window.location.href.split('#')[0]);
        //console.warn(location.href,"===",location.href.split('#'));
        App.getJSON("weixin/sign?url=" +encodeURIComponent(location.href.split('#')[0]), function (data) {
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
                    'hideMenuItems',
                    'showOptionMenu',
                    'chooseImage'
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        });
        wx.ready(function(){
            wx.hideMenuItems({
                menuList: [
                    "menuItem:share:appMessage",
                    "menuItem:share:timeline",
                    "menuItem:share:qq",
                    "menuItem:share:weiboApp",
                    "menuItem:favorite",
                    "menuItem:share:facebook",
                    "menuItem:share:QZone",
                    "menuItem:copyUrl",
                    "menuItem:openWithQQBrowser",
                    "menuItem:openWithSafari",
                    "menuItem:share:email"
                ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
            });
        });
    }

    //路由表+控制器
    var router={
        "/":{
            title:"会员登录",
            controller:require("public/dhy/controller/login"),
            templateUrl:"views/dhy/login.ejs"
        },
        "/login":{
            title:"会员登录",
            controller:require("public/dhy/controller/login"),
            templateUrl:"views/dhy/login.ejs"
        },
        "/licenses":{
            title:"用户协议",
            controller:require("public/dhy/controller/licenses"),
            templateUrl:"views/dhy/licenses.ejs"
        },
        /****************账户信息模块*****************/
        "/memberCenter":{
            title:"会员中心",
            controller:require("public/dhy/controller/memberCenter"),
            templateUrl:"views/dhy/memberCenter.ejs"
        },
        "/accountInfo":{
            title:"账户资料",
            controller:require("public/dhy/controller/accountInfo"),
            templateUrl:"views/dhy/accountInfo.ejs"
        },
        // "/merchantOrders":{
        //     title:"商户订单",
        //     controller:require("public/dhy/controller/merchantOrders"),
        //     templateUrl:"views/dhy/merchantOrders.ejs"
        // },
        "/pointsOders":{
            title:"礼品订单",
            controller:require("public/dhy/controller/pointsOders"),
            templateUrl:"views/dhy/pointsOders.ejs"
        },
        "/pointsDetails":{
            title:"礼品订单详情",
            controller:require("public/dhy/controller/pointsDetails"),
            templateUrl:"views/dhy/pointsDetails.ejs"
        },
        "/myMeans":{
            title:"我的资产",
            controller:require("public/dhy/controller/myMeans"),
            templateUrl:"views/dhy/myMeans.ejs"
        },
        "/myMemberCards":{
            title:"我的会员卡",
            controller:require("public/dhy/controller/myMemberCards"),
            templateUrl:"views/dhy/myMemberCards.ejs"
        },
        "/customerCenter":{
            title:"客服中心",
            controller:require("public/dhy/controller/customerCenter"),
            templateUrl:"views/dhy/customerCenter.ejs"
        },
        "/customerSort":{
            title:"客服列表",
            controller:require("public/dhy/controller/customerSort"),
            templateUrl:"views/dhy/customerSort.ejs"
        },
        "/pointsList":{
            title:"积分明细",
            controller:require("public/dhy/controller/pointsList"),
            templateUrl:"views/dhy/pointsList.ejs"
        },
        "/myMeansPoints":{
            title:"我的资产·积分",
            controller:require("public/dhy/controller/myMeansPoints"),
            templateUrl:"views/dhy/myMeansPoints.ejs"
        },
        "/redList":{
            title:"红包明细",
            controller:require("public/dhy/controller/redList"),
            templateUrl:"views/dhy/redList.ejs"
        },
        "/leagueAccount":{
            title:"联盟账户",
            controller:require("public/dhy/controller/leagueAccount"),
            templateUrl:"views/dhy/leagueAccount.ejs"
        },
        "/unionAccount":{
            title:"我的联通账户",
            controller:require("public/dhy/controller/unionAccount"),
            templateUrl:"views/dhy/unionAccount.ejs"
        },
        "/myUnionAccount":{
            title:"我的银联账户",
            controller:require("public/dhy/controller/myUnionAccount"),
            templateUrl:"views/dhy/myUnionAccount.ejs"
        },
        "/myUnionAddCard":{
            title:"我的银联添加银联卡",
            controller:require("public/dhy/controller/myUnionAddCard"),
            templateUrl:"views/dhy/myUnionAddCard.ejs"
        },
        "/exchangeRed":{
            title:"兑换红包",
            controller:require("public/dhy/controller/exchangeRed"),
            templateUrl:"views/dhy/exchangeRed.ejs"
        },
        "/myCoupons":{
            title:"我的优惠券",
            controller:require("public/dhy/controller/myCoupons"),
            templateUrl:"views/dhy/myCoupons.ejs"
        },
        "/couponsList":{
            title:"优惠券列表",
            controller:require("public/dhy/controller/couponsList"),
            templateUrl:"views/dhy/couponsList.ejs"
        },
        "/myParking":{
            title:"我的停车",
            controller:require("public/dhy/controller/myParking"),
            templateUrl:"views/dhy/myParking.ejs"
        },
        "/couponsDetails":{
            title:"优惠券详情",
            controller:require("public/dhy/controller/couponsDetails"),
            templateUrl:"views/dhy/couponsDetails.ejs"
        },
        "/couponsDetailsCode":{
            title:"优惠券详情·二维码",
            controller:require("public/dhy/controller/couponsDetailsCode"),
            templateUrl:"views/dhy/couponsDetailsCode.ejs"
        },
        "/personalInfo":{
            title:"完善个人信息",
            controller:require("public/dhy/controller/personalInfo"),
            templateUrl:"views/dhy/personalInfo.ejs"
        },
        "/accountSafe":{
            title:"账户安全",
            controller:require("public/dhy/controller/accountSafe"),
            templateUrl:"views/dhy/accountSafe.ejs"
        },
        "/appealPayPwd":{
            title:"支付密码申诉",
            controller:require("public/dhy/controller/appealPayPwd"),
            templateUrl:"views/dhy/appealPayPwd.ejs"
        },
        "/resetPayPwd":{
            title:"设置支付密码",
            controller:require("public/dhy/controller/resetPayPwd"),
            templateUrl:"views/dhy/resetPayPwd.ejs"
        },
        "/complaint":{
            title:"账户申诉",
            controller:require("public/dhy/controller/complaint"),
            templateUrl:"views/dhy/complaint.ejs"
        },
        "/complaint/demo":{
            title:"身份证上传示例",
            controller:require("public/dhy/controller/idDemo"),
            templateUrl:"views/dhy/idDemo.ejs"
        },
        "/restSetPhone":{
            title:"重置手机号码",
            controller:require("public/dhy/controller/restSetPhone"),
            templateUrl:"views/dhy/restSetPhone.ejs"
        },
        "/message":{
            title:"我的消息",
            controller:require("public/dhy/controller/message"),
            templateUrl:"views/dhy/message.ejs"
        },
        "/messageDetails":{
            title:"我的消息",
            controller:require("public/dhy/controller/messageDetails"),
            templateUrl:"views/dhy/messageDetails.ejs"
        },
        "/orderPayment":{
            title:"订单付款",
            controller:require("public/dhy/controller/orderPayment"),
            templateUrl:"views/dhy/orderPayment.ejs"
        },
        "/orderPayCode":{
            title:"付款码",
            controller:require("public/dhy/controller/orderPayCode"),
            templateUrl:"views/dhy/orderPayCode.ejs"
        },
        "/scanPoints":{
            title:"扫一扫积分",
            controller:require("public/dhy/controller/scanPoints"),
            templateUrl:"views/dhy/scanPoints.ejs"
        },
        "/selfPoints":{
            title:"自助积分",
            controller:require("public/dhy/controller/selfPoints"),
            templateUrl:"views/dhy/selfPoints.ejs"
        },
        "/cardPoints":{
            title:"卡券号积分",
            controller:require("public/dhy/controller/cardPoints"),
            templateUrl:"views/dhy/cardPoints.ejs"
        },
        "/commerceCardAdd":{
            title:"我的商务卡·绑卡",
            controller:require("public/dhy/controller/commerceCardAdd"),
            templateUrl:"views/dhy/commerceCardAdd.ejs"
        },
        "/commerceCardList":{
            title:"我的商务卡·列表",
            controller:require("public/dhy/controller/commerceCardList"),
            templateUrl:"views/dhy/commerceCardList.ejs"
        },
        "/commerceCardInfo":{
            title:"我的商务卡·详情",
            controller:require("public/dhy/controller/commerceCardInfo"),
            templateUrl:"views/dhy/commerceCardInfo.ejs"
        },
        "/dev":{
            title:"敬请期待",
            controller:require("public/dhy/controller/dev"),
            templateUrl:"views/dhy/dev.ejs"
        },
        /**********************************/
        "/myInvitation":{
            title:"我的邀请码",
            controller:require("public/dhy/controller/myInvitation"),
            templateUrl:"views/dhy/myInvitation.ejs"
        },
        "/myInvitationRule":{
            title:"好友邀请活动规则",
            controller:require("public/dhy/controller/myInvitationRule"),
            templateUrl:"views/dhy/myInvitationRule.ejs"
        },
        "/myInvitationList":{
            title:"我邀请的人",
            controller:require("public/dhy/controller/myInvitationList"),
            templateUrl:"views/dhy/myInvitationList.ejs"
        },
        /*********************************/
        "/pointsExchange":{
            title:"积分换礼",
            controller:require("public/dhy/controller/pointsExchange"),
            templateUrl:"views/dhy/pointsExchange.ejs"
        },
        "/search":{
            title:"积分换礼·搜索",
            controller:require("public/dhy/controller/search"),
            templateUrl:"views/dhy/search.ejs"
        },
        "/pointsExchangeList":{
            title:"积分商品·列表",
            controller:require("public/dhy/controller/pointsExchangeList"),
            templateUrl:"views/dhy/search.ejs"
        },
        "/pointsExchangeDetails":{
            title:"商品详情",
            controller:require("public/dhy/controller/pointsExchangeDetails"),
            templateUrl:"views/dhy/pointsExchangeDetails.ejs"
        },
        "/ordersConfirm":{
            title:"订单确认",
            controller:require("public/dhy/controller/ordersConfirm"),
            templateUrl:"views/dhy/ordersConfirm.ejs"
        },
        "/locationList":{
            title:"城市定位·已开放城市",
            controller:require("public/dhy/controller/locationList"),
            templateUrl:"views/dhy/locationList.ejs"
        },
        "/electricTicket":{
            title:"电子小票·列表",
            controller:require("public/dhy/controller/electricTicket"),
            templateUrl:"views/dhy/electricTicket.ejs"
        },
        "/electricTicketDetails":{
            title:"电子小票·详情",
            controller:require("public/dhy/controller/electricTicketDetails"),
            templateUrl:"views/dhy/electricTicketDetails.ejs"
        },
        "/applyRefund":{
            title:"申请退货",
            controller:require("public/dhy/controller/applyRefund"),
            templateUrl:"views/dhy/applyRefund.ejs"
        },
        "/commercialCardList":{
            title:"商务卡列表",
            controller:require("public/dhy/controller/commercialCardList"),
            templateUrl:"views/dhy/commercialCardList.ejs"
        },
        "/commercialCardInfo":{
            title:"商务卡详情",
            controller:require("public/dhy/controller/commercialCardInfo"),
            templateUrl:"views/dhy/commercialCardInfo.ejs"
        }
    };
    App.init();
    App.wxAuth(function(){
        App.Router(router,"#wrap");
    });

    //App.component.setCookie("currhash","avc");

    //关闭窗口清除指定数据 onbeforeunload  onUnload
    // $(window).bind("beforeunload",function () {
    //     var currHash=App.component.getCookie("currhash");
    //     if(currHash){
    //        App.component.delCookie("currhash");
    //     }
    // });
});