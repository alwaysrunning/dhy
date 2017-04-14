/**
 * Created by 沐沐 on 2015-07-31.
 */

YunHouSDK.use('core.ferrisWheel.main', function (ferris) {
    var allLayer = 'warning win lost ticket rule shortfall';//所有遮罩名字
    var ferrisWheel = null, warningClose = null;

    //显示提示
    var showWarning = function (text) {
        $('.pop-up').removeClass(allLayer).addClass('warning').find('.warning .text').text(text);
        $('#overlayer').show();
        $('#spinner').hide();
    };

    var showShort = function () {
        $('.pop-up').removeClass(allLayer).addClass('shortfall');
        $('#overlayer').show();
    };

    //关闭提示
    var hideWarning = function () {
        $('#overlayer').hide();
        $('.pop-up').removeClass(allLayer);
    };
    //设置次数
    var setTimes = function (times) {
        $('#timesLeft').text('剩余抽奖次数:' + times + '次');
    };
    //设置中奖结果
    var setResult = function (result) {
        if (result.goods) {
            ferrisWheel.pointTo(result.goods.id, function () {
                $('#overlayer').show();
                if (result.goods.category >= 0) {
                    //中奖
                    var award = '<h5 class="award-title">' + result.goods.name + '</h5>' +
                        '<img src="' + result.goods.uri + '"/>';
                    $('#result').find('.award').empty().html(award);
                    $('.pop-up').removeClass(allLayer).addClass('result win');
                    $('#result').find('.award .award-title').circleType({radius: 100});

                    //设置资料补全回调
                    if (result.isMember !== undefined && result.isMember === '0') {
                        warningClose = showShort;
                    }
                } else {
                    //没中奖
                    $('.pop-up').removeClass(allLayer).addClass('result lost');
                }
            });
        }
    };

    var draw = function () {
        $.getJSON('/api/ferris/draw', {
            activityid: activityid,
            cityid: cityId
        }).then(function (data) {
            setTimes(data.data.times);
            setResult(data.data);
        }).fail(function (err) {
            showWarning(err.responseJSON.message);
        });
    };

    var share = function () {
        $.getJSON('/api/ferris/share', {
            activityid: activityid
        }).then(function (data) {
            //alert(data.data.times);
            setTimes(data.data.times);
        }).fail(function (err) {
            showWarning(err.responseJSON.message);
        });
    };

    var renderGoods = function (goods) {
        var goodsLength = goods.length;
        var perDeg = 360 / goodsLength;
        $(goods).each(function (i, e) {
            var html = '<div class="award-content" ' +
                'style="transform: rotate(' + (i * perDeg) + 'deg);-webkit-transform: rotate(' + (i * perDeg) + 'deg);">' +
                '<div class="award-text">' + e.name + '</div>' +
                '<img class="award-pic" src="' + e.uri + '"/>' +
                '</div>';
            $('#wheelAward').append(html);
        });
    };

    var getLocation = function (lat, lng, code) {
        if (arguments.length == 1) {
            code = lat;
            lat = undefined;
        }
        var ajax = $.ajax({
            url: '/api/ferris/info',
            dataType: 'json',
            timeout: 10000, //超时时间设置，单位毫秒
            data: {
                lat: lat,
                lng: lng,
                code: code
            },
            success: function (data) {
                mobile = data.mobile;
                cityId = data.area.id;

                wx.onMenuShareTimeline({
                    title: data.shareMessage.message, // 分享标题
                    link: data.shareMessage.link, // 分享链接
                    imgUrl: data.shareMessage.image, // 分享图标
                    success: function () {
                        share();
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.onMenuShareAppMessage({
                    title: data.shareMessage.message, // 分享标题
                    desc: data.shareMessage.message, // 分享描述
                    link: data.shareMessage.link, // 分享链接
                    imgUrl: data.shareMessage.image, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function () {
                        share();
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.showMenuItems({
                    menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline'] // 要显示的菜单项，所有menu项见附录3
                });


                $('#location').attr('href', 'http://' + window.location.host + '/#/locationList?fromUrl=' + encodeURIComponent(window.location.href.split('?')[0]))
                    .html(data.area.name + ' <span class="iconfont icon-xiajiantou">');
                //长沙 <span class="iconfont icon-xiajiantou">

                ids = data.goods.map(function (e) {
                    return e.id;
                });
                activityid = data.activityid;

                $('#wheelBody').addClass('wheel-' + data.goods.length);
                renderGoods(data.goods);
                setTimes(data.time);
                ferrisWheel = new ferris('#wheelAward', ids);
                $('.award-text').circleType({radius: 100});

                $('#records').empty();
                $(data.records).each(function (i, e) {
                    var liHtml = '<li>' + e + '</li>';
                    $('#records').append(liHtml);
                });

                $('.rule .text').html(data.rules);

                bind();
                $('#area').fadeOut();
            },
            error: function (err, status) {
                if (err.responseJSON) {
                    if (err.responseJSON.code == '200010002') {
                        if (store.check("LoginBool")) {
                            store.remove("LoginBool");
                        }
                        window.location.href = 'http://' + window.location.host + '/#/login?fromUrl=' + window.location.href
                    } else {
                        showWarning(err.responseJSON.message);
                    }
                } else {
                    if (status == 'timeout' || status == 'error') {
                        ajax.abort();
                        showWarning('网络不好，请稍后再试！');
                    }
                }
            }
        });
    };

    var getParams = function (item) {
        var sValue = window.location.href.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        return sValue ? sValue[1] : sValue;
    };

    var init = function () {
        var cityId = getParams('cityId');
        var storeCity = JSON.parse(localStorage.getItem('city'));

        wx.ready(function () {
            if (cityId) {
                getLocation(cityId);
            } else if (storeCity) {
                //alert(storeCity.id);
                getLocation(storeCity.id);
            } else {

                wx.getLocation({
                    type: 'wgs84',
                    success: function (res) {
                        getLocation(res.latitude, res.longitude);
                    },
                    fail: function () {
                        getLocation();
                    },
                    cancel: function () {
                        getLocation();
                    }
                });
            }
            wx.hideAllNonBaseMenuItem();
        });
        //getLocation();
    };

    //去补全资料
    var goShortFall = function () {
        if (mobile) {
            window.location.href = 'http://' + window.location.host + '/#/personalInfo?mobile=' + mobile + '&fromUrl=' + encodeURIComponent(window.location.href);
        }
    };


    var bind = function () {
        //转盘按钮
        $('#wheelBtn').on('touchend', function () {
            if (ferris) {
                draw();
            }
        });
        //规则按钮
        $('#rule').on('touchend', function () {
            $('.pop-up').removeClass(allLayer).addClass('rule');
            $('#overlayer').show();
        });

        $('.pop-up .rule .cancel').on('touchend', function () {
            $('.pop-up').removeClass(allLayer);
            $('#overlayer').hide();
        });
        //结果按钮
        $('.pop-up .result .cancel').on('touchend', function () {
            $('.pop-up').removeClass(allLayer);
            $('#overlayer').hide();

            if (typeof warningClose == 'function') {
                warningClose();
                warningClose = undefined;
            }
        });
        $('.pop-up .result .again').on('touchend', function () {
            $('.pop-up').removeClass(allLayer);
            $('#overlayer').hide();

            if (typeof warningClose == 'function') {
                warningClose();
                warningClose = undefined;
            } else {
                draw();
            }
        });
        //不全资料
        $('.pop-up .shortfall .cancel').on('touchend', function () {
            $('.pop-up').removeClass(allLayer);
            $('#overlayer').hide();
        });
        $('.pop-up .shortfall .go').on('touchend', function () {
            $('.pop-up').removeClass(allLayer);
            $('#overlayer').hide();
            goShortFall();
        });
        //触摸提示关闭
        $('.pop-up .warning #close-btn').on('touchend', function () {
            hideWarning();
        });
    };

    init();
});
