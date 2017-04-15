/**
 * Created by xiemumu on 16/9/8.
 */
;(function () {
    var confirmTemplate = new EJS({url: '/views/park/confirm.ejs'});
    var recordTemplate = new EJS({url: '/views/park/positionRecord.ejs'});

    var confirmDiolog = function (text, success) {
        var Deferred = $.Deferred();
        var html = $(confirmTemplate.render({
            text: text
        }));
        html.find('.cancel').click(function () {
            html.fadeOut(function () {
                html.remove();
                Deferred.reject();
            });

        });
        html.find('.ok').click(function () {
            html.fadeOut(function () {
                html.remove();
                Deferred.resolve();
            });
        });
        $('body').append(html);
        html.fadeIn();
        return Deferred.promise();
    };

    var getSuggestion = _.debounce(function (q, add, addAysn) {
        $.getJSON('/api/etc/query', {
            query: q,
            parkid: parkid
        }, function (resp) {
            addAysn(resp.data)
        }).fail(function (err) {
            addAysn([]);
        });
    }, 500);

    $(function () {

        $.getJSON('http://' + window.location.host + '/api/weixin/sign?callback=?', {
            url: encodeURIComponent(window.location.href.split('#')[0])
        }).then(function (data) {
            wx.config({
//                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature,// 必填，签名，见附录1
                jsApiList: [
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'hideMenuItems',
                    'scanQRCode'
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        });

        wx.ready(function () {
            wx.hideAllNonBaseMenuItem();
        });

        $('#scan').on('tap', function () {
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var qrcode = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    $.getJSON('/api/etc/positionScan', {
                        parkid: parkid,
                        qrcode: qrcode
                    }).then(function (res) {
                        return getNewRecord();
                    }).then(function (data) {
                        reFreshRecord(data.data);
                    }).fail(function (err) {
                        if (err.responseJSON) {
                            _.warm(err.responseJSON.message)
                        }
                    });
                }
            });
        });

        $('#carInput').typeahead(null, [{
            name: 'car',
            async: true,
            source: getSuggestion,
            limit: 50,
            display: function (data) {
                return data.position_floor + '层,车位号:' + data.position_id;
            },
            templates: {
                notFound: function (data) {
                    return '<div class="tt-suggestion">无相关车位信息</div>';
                },
                suggestion: function (data) {
                    return $('<div class="tt-suggestion">').text(data.position_floor + '层,车位号:' + data.position_id);
                },
                pending: function (data) {
                    // return '<div class="tt-suggestion">查询中...</div>';
                    return '<div class="tt-suggestion"><i class="loading-circle"></i></div>';
                }
            }
        }]).bind('typeahead:select', function (ev, suggestion) {
            saveSuggestion(suggestion);
            $('#carInput').blur();
        });

        var delRecord = function (Id, parkid, parkpositionid, parkpositionfloor) {
            return confirmDiolog('确定要删除“' + parkpositionfloor +
                '层,' + parkpositionid + '号车位”的记录吗？').then(function () {
                return $.getJSON('/api/etc/delPosition', {
                    id: Id,
                    parkid: parkid,
                    parkpositionid: parkpositionid,
                    parkpositionfloor: parkpositionfloor
                }).then(function (data) {
                    return getNewRecord();
                }).then(function (data) {
                    reFreshRecord(data.data);
                }).fail(function (err) {
                    if (err.responseJSON) {
                        _.warm(err.responseJSON.message)
                    }
                });
            });
        };

        var getNewRecord = function () {
            return $.getJSON('/api/etc/positionList', {
                parkid: parkid
            });
        };

        var reFreshRecord = function (list) {
            var html = $(recordTemplate.render({
                positionRecords: list
            }));

            html.find('.btn-del').on('click', function (e) {
                var target = e.currentTarget;
                var Id = $(target).attr('data-id');
                var parkid = $(target).attr('data-parkid');
                var position = $(target).attr('data-position');
                var floor = $(target).attr('data-floor');
                delRecord(Id, parkid, position, floor);
            });

            $('.my-record-body').html(html);
        };

        var saveSuggestion = function (suggestion) {
            $.get('/api/etc/savePosition', {
                parkid: parkid,
                parkpositionid: suggestion.position_id,
                parkpositionfloor: suggestion.position_floor
            }).then(function (data) {
                $('#carInput').typeahead('val', '');
                return getNewRecord();
            }).then(function (data) {
                reFreshRecord(data.data);
            }).fail(function (err) {
                if (err.responseJSON) {
                    _.warm(err.responseJSON.message)
                }
            });
        };

        getNewRecord().then(function(data){
            reFreshRecord(data.data);
        }).fail(function (err) {
            reFreshRecord([]);
        });
    });
})();