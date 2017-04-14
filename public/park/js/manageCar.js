/**
 * Created by 沐沐 on 2016-03-29.
 */
!(function () {
    var template = new EJS({url: '/views/park/carCard.ejs'});
    var confirmTemplate = new EJS({url: '/views/park/confirm.ejs'});
    var scroll = new IScroll($('.car-manage-list').get(0), {
        click: true
    });

    var refreshCarNo = function () {
        return $.getJSON('/api/etc/cars').then(function (data) {
            var html = $(template.render({
                items: data.data,
                parkid: parkid
            }));

            if(data.data.length!=6){
                $("#maxListNum").empty().append("<p>还可绑定<b>"+(6-parseInt(data.data.length))+"</b>个车牌 (最多添加6个车牌)</p>");
            }else{
                $("#maxListNum").empty().append("<p>记录已满，如需绑定新车牌，删除其他</p>");
            }

            html.find('.item-del').click(function () {
                var ele = $(this);
                var carNo = ele.attr('car-no');
                if (!!carNo && !ele.hasClass('deleting')) {
                    ele.addClass('deleting');
                    delNo(carNo).always(function () {
                        ele.removeClass('deleting');
                    });
                }
            });
            html.find('.item-pos').click(function () {
                var ele = $(this);
                var carNo = ele.attr('car-no');
                window.location.href = '/park/location/' + parkid + '/' + carNo
            });
            $('.car-manage-list-scroll').html(html);
            scroll.refresh();
        }).fail(function (err) {
            if (err.responseJSON) {
                _.warm(err.responseJSON.message)
            }
        });
    };

    var bindNo = function (carNo) {
        return $.getJSON('/api/etc/bind', {
            carno: carNo
        }).then(function (data) {
            refreshCarNo();
        }).fail(function (err) {
            if (err.responseJSON) {
                _.warm(err.responseJSON.message)
            }
        });
    };

    var delNo = function (carNo) {
        return confirmDiolog('确定要解除“' + carNo + '”的绑定吗？').then(function () {
            return $.getJSON('/api/etc/del', {
                carno: carNo
            }).then(function (data) {
                refreshCarNo();
            }).fail(function (err) {
                if (err.responseJSON) {
                    _.warm(err.responseJSON.message)
                }
            });
        });
    };

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

    var checkPass = function () {
        return /^[a-z_A-Z_0-9]{5}$/.test(licenceCodeInput.val()) && carSelector.check();
    };

    var licenceCodeBtn = $('#licenceCodeBtn');
    var licenceCodeInput = $('#licenceCodeInput');
    var licenceCodeSubmit = $('#licenceCodeSubmit');

    var carSelector = new carSelect();

    var licenceCode = checker.store.get('licenceCode');
    if (licenceCode) {
        licenceCode = decodeURIComponent(licenceCode.val);
        carSelector.defaultCode(licenceCode);//设置默认编码
    }

    $(carSelector).on('complete', function (e, text) {
        licenceCodeBtn.find('.lecence-text').text(text);
        licenceCodeInput.focus();
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
            bindNo(code).always(function () {
                licenceCodeSubmit.removeClass('disabled');
            });
        }
    });

    licenceCodeBtn.on('tap', function () {
        carSelector.toggle();
    });

    carSelector.init();
    refreshCarNo();

})();