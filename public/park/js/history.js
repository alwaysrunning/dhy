/**
 * Created by Ray on 2016/1/11.
 */
$(function () {
    $.getJSON('http://' + window.location.host + '/api/weixin/sign?callback=?', {
        url: encodeURIComponent(window.location.href.split('#')[0])
    }).then(function (data) {
        wx.config({
            //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名，见附录1
            jsApiList: [
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'chooseWXPay',
                'hideMenuItems',
                'openLocation'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
    });

    var goThere = null;
    wx.ready(function () {
        wx.hideAllNonBaseMenuItem();

        goThere = function (longitude, latitude, parkingLot, address) {
            wx.openLocation({
                latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
                longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
                //scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
                //infoUrl: '', // 在查看位置界面底部显示的超链接,可点击跳转
                name: parkingLot, // 位置名
                address: address // 地址详情说明
            });
        }
    });

    var initHistory = function () {
        var pagesize = 10,
            total,
            totalPage,
            page = 1;
        var updateList = function () {
            $.getJSON("/api/etc/history",
                {
                    pagesize: pagesize,
                    page: page
                }, function (data) {
                    total = data.total;
                    totalPage = Math.floor((total - 1) / pagesize) + 1;
                    if (total == 0) {
                        $(".up span").html("没有停车历史...");
                        listScroll && listScroll.refresh();
                    } else if (data.data && data.data.length > 0) {
                        fillList(data.data);
                    }
                })
        };
        var fillList = function (data) {
            $.each(data, function (index, item) {
                var content = '<div class="list-item">' +
                    '<div class="list-title">' +
                    '<span class="iconfont-park icon-tingcheweizhi"></span>' +
                    '<h3 class="list-text">' + item.address + '</h3>' +
                    '<a class="goThere btn white">' +
                    '<span class="iconfont-park icon-daozheliqu"></span>' +
                    '到这里去' +
                    '</a>' +
                    '</div>' +
                    '<div class="list-body">' +
                    '<p class="list-text">' + item.parkingLot + '</p>' +
                    '<p class="list-text">进场时间：' + item.inTime + '</p>' +
                    '<p class="list-text">出场时间：' + item.outTime + '</p>' +
                    '<p class="list-text">停车票号：' + item.orderNo + '</p>' +
                    '<p class="list-text">车牌号码：' + item.carNo + '</p>' +
                    '</div>' +
                    '</div>';
                var jqContetnt = $(content);
                jqContetnt.find('.goThere').on('tap', function () {
                    if (!!goThere) {
                        goThere(item.longitude, item.latitude,item.parkingLot,item.address);
                    }
                });
                $(".list").append(jqContetnt);
            });
            if (page < totalPage) {
                $(".up span").html("上拉加载更多...");
            } else {
                $(".up span").html("没有更多了...");
            }
            listScroll && listScroll.refresh();
            page++;
        };
        updateList();
        var listScroll = new IScroll(".wrapper", {});
        listScroll.on("scrollEnd", function () {
            if (page <= totalPage && this.y - this.maxScrollY < 10) {
                $(".up span").html("加载中...");
                updateList();
            }
        });
    };
    initHistory();
});
