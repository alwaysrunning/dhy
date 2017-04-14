/**
 * Created by 沐沐 on 2016-06-20.
 */

!(function () {
    var confirmTemplate = new EJS({url: '/views/park/confirm.ejs'});
    var recordTemplate = new EJS({url: '/views/park/positionRecord.ejs'});

    var init = function () {

        /**
         * find car
         */
        var licenceCodeInput = $('#licenceCodeInput');
        var historyCars = $('.history');

        var getSuggestion = _.debounce(function (q, add, addAysn) {
            $.getJSON('/api/etc/queryCar', {
                query: q,
                parkid: parkid
            }).then(function (resp) {
                addAysn(resp.data.data);
            }).fail(function () {
                addAysn([]);
            })
        }, 500);

        licenceCodeInput.typeahead(null, [{
            name: 'car',
            async: true,
            source: getSuggestion,
            limit: 50,
            display: function (data) {
                return data.CarCode;
            },
            templates: {
                notFound: function (data) {
                    return '<div class="tt-suggestion">无相关车牌信息</div>';
                },
                suggestion: function (data) {
                    return $('<div class="tt-suggestion">').text(data.ParkingNo + '车位,车牌号:' + data.CarCode);
                },
                pending: function (data) {
                    return '<div class="tt-suggestion">查询中...</div>';
                }
            }
        }]).bind('typeahead:select', function (ev, suggestion) {
            var code = licenceCodeInput.val().toUpperCase();
            window.location.href = parkid + '/' + code;
        });

        historyCars.on('tap', function () {
            var carNo = $(this).attr('data-no');
            window.location.href = parkid + '/' + carNo;
        });

        /**
         * record del
         */

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
            }).then(function (data) {
                return data;
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

        reFreshRecord(JSON.parse(records));
    };

    init();
})();
