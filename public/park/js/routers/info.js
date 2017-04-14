/**
 * Created by 沐沐 on 2016-01-07.
 */
var infoRouteGroup = function (router) {
    var routerGroup = new prouter.RouteGroup();
    //var posCal = new posCalculator();
    var gInfo = null;
    var gDiscount = null;
    var gShopId = null;
    var scoller;
    var templates = {
        loading: new EJS({
            url: '/views/park/loading.ejs'
        }),
        order: new EJS({
            url: '/views/park/order.ejs'
        })
    };

    var getOrder = function () {
        return {
            info: gInfo,
            discount: gDiscount,
            canDiscount: gInfo.money >= gDiscount.money ? gDiscount.money : gInfo.money
        };
    };

    var getParam = function () {
        var order = getOrder();
        return {
            carNo: gInfo.carNo,
            money: gInfo.money,
            posMoney: order.canDiscount,
            weixinMoney: gInfo.money - order.canDiscount,
            shopId: gShopId
        };
    };

    var reRenderCala = function () {
        var order = getOrder();

        $('#discountMoney').text(' ¥ ' + (order.discount.money / 100));
        $('#discountLeft').text(' ¥ ' + order.discount.syje);
        $('#totalDiscount').text(' ¥ ' + (order.canDiscount / 100));
        $('#needPay').text(' ¥ ' + ((order.info.money - order.canDiscount) / 100));

    };

    var renderLoading = function (req, next) {
        var html = $(templates.loading.render({
            carno: decodeURIComponent(req.params.carno)
        }));

        $('.viewport').append(html);
        html.fadeIn(function () {
            $('.bg').not(html).remove();
            next();
        });
    };

    var toggleDialog = function () {
        $('.dark-layer').fadeToggle();
        $('.pos-input-dailog').fadeToggle();
    };

    //var bindDel = function (el) {
    //    el.find('.icon-shanchu').on('tap', function () {
    //        var parkno = $(this).parents('.discount-list-item').attr('data-pos-id');
    //        delPos(parkno);
    //    });
    //};

    //var resetPos = function (pos) {
    //    var hasPos = posCal.hasPos();
    //    $('.discount-list .origin').toggle(!hasPos);
    //    $('.list-body .discount-total').toggle(hasPos);
    //
    //    if (typeof pos !== 'object') {
    //        $('.discount-list').find('[data-pos-id=' + pos + ']').remove();
    //    } else {
    //        var el = $('<div class="discount-list-item" data-pos-id="' + pos.parkno + '">' +
    //            '<span class="iconfont-park icon-shanchu"></span>' +
    //            '<div class="fl list-text">' + pos.parkno + '</div>' +
    //            '<div class="list-text"><span class="orange">¥ ' + pos.xsje + '</span></div>' +
    //            '</div>');
    //        $('.discount-list').append(el);
    //        bindDel(el);
    //    }
    //
    //    var discount = posCal.cal();
    //    $('.float-nav .need .orange').html('¥ ' + (posCal.real() - discount) / 100);
    //    $('.list-body .discount-total .green').html('¥ ' + discount / 100);
    //    if (scoller) {
    //        scoller.refresh();
    //    }
    //};

    var addPos = function (shopid, parkno, carno) {
        return $.getJSON('/api/etc/bindPos', {
            parkno: parkno,
            shopid: shopid,
            carno: carno
        }).then(function (data) {
            gDiscount = data.data;
            reRenderCala();
            warm(data.message);
            //if (!posCal.samePos(pos)) {
            //    posCal.add(pos);
            //} else {
            //    warm('这张小票已经添加，请勿重复添加！');
            //}
        }).fail(function (err) {
            if (err.responseJSON) {
                warm(err.responseJSON.message);
            }
        });
    };

    //$(posCal).on('added', function (e, posItem) {
    //    resetPos(posItem);
    //});

    //$(posCal).on('deled', function (e, posItem) {
    //    resetPos(posItem.parkno);
    //});

    //var delPos = function (pos) {
    //    posCal.del(pos);
    //};

    var orderConfirm = function () {
        //var param = posCal.getParam(order.carNo);
        var param = getParam();
        return $.post('/api/etc/orderComfirm', param).then(function (data) {
            switch (data.data.weixinPay) {
                case '0':
                    window.location.href = '/park/status/' + data.data.orderNo;
                    break;
                case '1':
                    window.location.href = '/park/orderPay/' + data.data.orderNo;
                    break;
            }
        }).fail(function (err) {
            if (err.responseJSON) {
                if (!!err.responseJSON.data && err.responseJSON.data.refresh === '1') {
                    warm(err.responseJSON.message, function () {
                        window.location.reload();
                    });
                } else {
                    warm(err.responseJSON.message);
                }
            }
            console.error(err);
        });
    };

    var renderOrder = function (req) {
        var html = $(templates.order.render(getOrder(gInfo, gDiscount)));


        html.find('.add-pos').on('tap', function () {
            $('.pos-input-dailog .dailog-content input').val('');
            toggleDialog();
        });

        html.find('.pos-input-dailog .cancel').on('tap', function () {
            toggleDialog();
        });

        html.find('.pos-input-dailog .ok').on('tap', function () {
            var pos = $('.pos-input-dailog .dailog-content input').val();
            if (pos) {
                addPos(gInfo.shopId, pos, gInfo.carNo).always(function () {
                    toggleDialog();
                });
            }
        });

        html.find('.float-nav .confirm').on('tap', function () {
            var my = $(this);
            if (!my.hasClass('disabled')) {
                my.addClass('disabled');
                orderConfirm().always(function () {
                    my.removeClass('disabled');
                });
            }
        });

        //bindDel(html.find('.discount-list-item'));

        $('.viewport').html(html);
        scoller = new IScroll('.order-list');

        //html.fadeIn(function () {
        //    $('.bg').not(html).remove();
        //    scoller = new IScroll('.order-list');
        //});
    };


    var getInfo = function (req, next) {
        gShopId = req.params.shop;
        if (gShopId) {
            $.getJSON('/api/etc/info', {
                carno: decodeURIComponent(req.params.carno),
                shopid: gShopId
            }).then(function (data) {
                gInfo = data.info;
                gDiscount = data.pos;

                //posCal.init(order.carPoss, order.rules, order.limitMoney, order.money);
                next();
            }).fail(function (err) {
                if (err.responseJSON) {
                    warm(err.responseJSON.message);
                }
                router.navigate('/car/' + gShopId);
            });
        }
    };

    routerGroup.use(renderLoading).use(getInfo).use(renderOrder);
    return routerGroup;
};