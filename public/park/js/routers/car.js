/**
 * Created by 沐沐 on 2016-01-07.
 */
var carRouteGroup = function (router) {
    var routerGroup = new prouter.RouteGroup();
    var carData = [];
    var template = new EJS({url: '/views/park/car.ejs'});

    var getCars = function (req, next) {
        var setCar = function (cars) {
            carData = cars;
            next();
        };

        $.getJSON('/api/etc/cars').then(function (data) {
            setCar(data.data);
        }).fail(function (err) {
            setCar([]);
        });
    };

    var renderMyCar = function (req) {
        var shopId = req.params.shop;
        var selector = $(template.render({
            data: carData,
            shopId:shopId
        }));

        var carSelector = new carSelect({
            target: selector.find('.dailog-select')
        });

        var checkPass = function () {
            return /^[a-z_A-Z_0-9]{5}$/.test(licenceCodeInput.val()) && carSelector.check();
        };

        var saveLicenceCode = function (licenceCode) {
            var code = carSelect.decode(licenceCode);
            checker.store.set('licenceCode', encodeURIComponent(code));
        };

        var licenceCode = checker.store.get('licenceCode');
        if (licenceCode) {
            licenceCode = decodeURIComponent(licenceCode.val);
            carSelector.defaultCode(licenceCode);//设置默认编码
        }


        var licenceCodeBtn = selector.find('#licenceCodeBtn');
        var licenceCodeInput = selector.find('#licenceCodeInput');
        var licenceCodeSubmit = selector.find('#licenceCodeSubmit');
        var historyCars = selector.find('.history');
        //var historyClear = selector.find('.clear-history');

        $(carSelector).on('complete', function (e, text) {
            licenceCodeBtn.find('.lecence-text').text(text);
            licenceCodeInput.focus();
        });

        licenceCodeBtn.on('tap', function () {
            carSelector.toggle();
        });

        licenceCodeInput.on('input propertychange', function () {
            var pass = checkPass();
            if (pass) {
                licenceCodeInput.blur();
            }
            licenceCodeSubmit.toggleClass('disabled', !pass);
        });

        licenceCodeSubmit.on('tap', function () {
            if (!licenceCodeSubmit.hasClass('disabled')) {
                licenceCodeSubmit.addClass('disabled');
                var code = carSelector.result() + licenceCodeInput.val().toUpperCase();
                saveLicenceCode(code);
                if (shopId) {
                    router.navigate('/info/' + shopId + '/' + encodeURIComponent(code));
                }
            }
        });

        historyCars.on('tap', function () {
            var carNo = $(this).attr('data-no');
            saveLicenceCode(carNo);
            if (shopId) {
                router.navigate('/info/' + shopId + '/' + encodeURIComponent(carNo));
            }
        });

        //historyClear.on('tap', function () {
        //    $.getJSON('/api/etc/clear').then(function (data) {
        //        $('#history-box').empty().html('<div class="list-item">' +
        //            ' 暂无历史车牌' +
        //            '</div>');
        //    }).fail(function (err) {
        //        if (err.responseJSON) {
        //            warm(err.responseJSON.message)
        //        }
        //    });
        //});

        carSelector.init();

        $('.viewport').html(selector);

        //selector.fadeIn(function () {
        //    $('.bg').not(selector).remove();
        //});
    };

    routerGroup.use(getCars).use(renderMyCar);

    return routerGroup;
};