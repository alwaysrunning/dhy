/**
 * Created by 沐沐 on 2016-06-20.
 */

!(function () {

    var init = function () {

        /**
         * find car
         */
        var licenceCodeInput = $('#licenceCodeInput');


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
            var _url= parkid + '/' + code;
            //window.location.href = _url;

            $.get(_url,function (data) {
                  $("#queryResult").empty().append(data)
            },"html");
        });

    };

    init();
})();
