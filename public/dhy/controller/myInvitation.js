/**
 * Created by 沐沐 on 2016-01-27.
 */
'use strict';
define(function (require, exports, module) {
    module.exports=function () {
        if(!App.pageAuth()){
            return false;
        }
        var _this = this;

        $.getJSON('/api/weixin/sign', {
            url: encodeURIComponent(window.location.href.split('#')[0])
        }, function (data) {
            wx.config({
                //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature,// 必填，签名，见附录1
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'showMenuItems', 'hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        });

        App.getJSON("invitation/get", function (res) {
            App.render({
                url: _this.RouterTmpUrl,
                data: {
                    title: _this.RouterTitle,
                    data: res.data
                },
                _this: _this
            });

            $('#invitationCodeSubmit').on('click', function () {
                var inputBtn = $(this);
                if (!inputBtn.hasClass('disabled')) {
                    var invitationCode = $('#invitationCode').val();
                    inputBtn.addClass('disabled');
                    App.ajaxJSON({
                        url: 'invitation/submit',
                        type: 'POST',
                        data: {
                            invitationCode: invitationCode
                        },
                        success: function (res) {
                            App.Popover.weak({
                                txt: res.message
                            });
                        },
                        complete: function () {
                            inputBtn.removeClass('disabled');
                            App.Popover.loading("", true);
                        }
                    });
                }
            });

            $('#invitationCode').on('input propertychange', function () {
                var invitationCode = $('#invitationCode').val();
                $('#invitationCodeSubmit').toggleClass('disabled', !invitationCode);
            });

            $('#invitationShare').on('click', function () {
                $('.m-invitation-share').show();
            });
            $('.m-invitation-share').on('click', function () {
                $('.m-invitation-share').hide();
            });

            wx.ready(function () {
                wx.hideAllNonBaseMenuItem();

                wx.onMenuShareTimeline({
                    title: '【小步之家】千万会员幸福之家', // 分享标题
                    link: 'http://' + window.location.host + '/invitation/share/' + res.data.regCode.invitationCode, // 分享链接
                    imgUrl: 'http://' + window.location.host + '/invitation/img/share.jpg', // 分享图标
                    success: function () {
                        App.postJSON('/invitation/share');
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.onMenuShareAppMessage({
                    title: '【小步之家】千万会员幸福之家', // 分享标题
                    desc: '快和我一起加入吧！30秒变会员，活动资讯，一手掌握。还有更多折扣、赠礼、抽奖、多倍积分等着你哟~', // 分享描述
                    link: 'http://' + window.location.host + '/invitation/share/' + res.data.regCode.invitationCode, // 分享链接
                    imgUrl: 'http://' + window.location.host + '/invitation/img/share.jpg', // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        App.postJSON('/invitation/share');
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.showMenuItems({
                    menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline'] // 要显示的菜单项，所有menu项见附录3
                });
            });
        });
    };
});