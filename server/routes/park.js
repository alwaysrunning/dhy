/**
 * Created by 沐沐 on 2015-12-31.
 */

var express = require('express');
var router = express.Router();
var q = require('q');
var _ = require('lodash');
var api = require('api');
var url = require('url');

/**
 * 处理权限拦截
 */
var handleAuth = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];
    if (openid && unionid && openid !== 'undefined' && unionid !== 'undefined') {
        next();
    } else {
        //unionid or openid miss
        var localUrl = 'http://' + api.config().api.useHost + url.parse(req.originalUrl).pathname;
        var openUrl = api.weixin.getOpenUrl('/weixin', {
            url: encodeURIComponent(localUrl)
        });
        res.redirect(openUrl);
    }
};

/**
 * 处理登录拦截
 */
var handleLogin = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];
    var channel = req.query["channel"]||req.cookies["channel"]||"012838";

    var currPathName=req._parsedOriginalUrl.path;
    var localUrl = req.protocol+"://"+req.headers.host+ currPathName;

    api.user.mobile(unionid).then(function () {
        next();
    }).fail(function () {
        //not login
        var loginUrl="";
        if(channel){
            loginUrl = req.protocol+"://"+ req.headers.host + "/#/login?channel="+channel+"&fromUrl=" + encodeURIComponent(localUrl);
        }else{
            loginUrl = req.protocol+"://"+ req.headers.host + "/#/login?fromUrl=" + encodeURIComponent(localUrl);
        }
        res.redirect(loginUrl);
    });

    // api.user.mobile(unionid).then(function () {
    //     next();
    // }).fail(function () {
    //     //not login
    //     var localUrl = 'http://' + api.config().api.useHost + url.parse(req.originalUrl).pathname;
    //     var loginUrl = 'http://' + api.config().api.useHost + '/#/login?channel='+channel+'&fromUrl=' + encodeURIComponent(localUrl);
    //     res.redirect(loginUrl);
    // });
};

/**
 * 停车导航页
 */
router.get('/nav/:shopId', handleAuth, function (req, res, next) {
    var shopId = req.params['shopId'];

    res.render('park/index', {
        title: '停车&找车',
        shopId: shopId
    });
});

/**
 * 查询车费页
 */
router.get('/car',handleAuth,handleLogin,function (req, res, next) {
    res.render('park/myCar', {
        title: '查询停车费'
    });
});

/**
 * 查车位置页 查车牌找车
 */
router.get('/location/:shopId', handleAuth,handleLogin, function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];
    var shopId = req.params['shopId'];

    q.allSettled([
        api.etc.cars(unionid),
        api.etc.positionList(shopId, unionid, openid)
    ]).spread(function (cars, parks) {
        res.render('park/location', {
            title: '查车牌找车',
            data: cars.state === 'fulfilled' ? cars.value.data : [],
            positionRecords: parks.state === 'fulfilled' ? parks.value.data : [],
            shopId: shopId
        });
    });
});

/**
 * 记车位置页
 */
router.get('/memory/:shopId', handleAuth,handleLogin, function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];
    var shopId = req.params['shopId'];

    api.etc.cars(unionid).then(function (cars) {
        res.render('park/memoryCar', {
            title: '记车位',
            shopId: shopId,
            cars:cars
        });
    });


});

/**
 * 车位信息
 */
router.get('/location/:shopId/:carNo', handleAuth,handleLogin, function (req, res, next) {
    var carNo = req.params['carNo'];
    var shopId = req.params['shopId'];
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];

    var renderPage = function (carList, firstCarStatus) {
        res.render('park/locateCar', {
            title: '车位信息',
            carList: carList,
            firstCarStatus: firstCarStatus,
            shopId: shopId
        });
    };

    api.etc.cars(unionid).then(function (data) {
        var carList = data.data.map(function (car) {
            return car.carNo;
        });
        if (carNo != 'null') {
            carList.unshift(carNo);
            carList = _.uniq(carList);
        }
        return carList;
    }, function () {
        if (carNo != 'null') {
            return [carNo];
        } else {
            return renderPage([]);
        }
    }).then(function (carList) {
        if (carList.length === 0) {
            renderPage(carList);
        } else {
            api.etc.carStatus(carList[0], shopId, unionid).then(function (firstCarStatus) {
                renderPage(carList, firstCarStatus);
            });
        }
    });
});

/**
 * 历史停车页
 */
router.get('/history', handleAuth, handleLogin, function (req, res, next) {
    res.render('park/history', {
        title: '历史停车'
    });
});

/**
 * 车牌绑定管理
 */
router.get('/manage/:shopId', handleAuth, handleLogin, function (req, res, next) {
    var shopId = req.params['shopId'];
    res.render('park/manageCar', {
        title: '管理车牌',
        shopId: shopId
    });
});

/**
 * 辅助跳转页
 */
router.get('/jump', function (req, res, next) {
    var shopId = req.query['shop'];
    var unionid = req.cookies['unionid'];

    // api.etc.cars(unionid).then(function (data) {
    //     var plateIds = '';
    //     if (data.data && data.data.length > 0) {
    //         plateIds = data.data.map(function (item) {
    //             return item.carNo
    //         }).join(',');
    //     }
    //     res.redirect('http://www.ipalmap.com/weixin/reverseTrailingCar/?mapId=1101&buildingPoiId=1062035&parkId=1101&plateId=' + encodeURI(plateIds));
    // }).fail(function (err) {
    //     res.redirect('http://www.ipalmap.com/weixin/reverseTrailingCar/?mapId=1101&buildingPoiId=1062035&parkId=1101');
    // });
    res.redirect('/park/nav/' + shopId);
});

/**
 * 停车场列表页
 */
router.get('/parkList',handleAuth, handleLogin, function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];
    var channel= req.query["channel"];//120135 V0101 012838

    if(channel){
        //查询当前频道下停车场优惠券列表
        q.fcall(function () {
            return api.store.exchangeStoreId(channel)
        }).then(function (eData) {
            return api.etc.getParks(channel).then(function (pData) {
                return {
                    pData:pData.data,
                    showShop:eData.data
                }
            })
        }).then(function (data) {

            if(unionid){

                q.all([
                    api.coupons.couponAuthList(unionid,data.showShop,7,3,1,20),
                    api.user.mobile(unionid)
                ]).spread(function (cData) {

                    res.render('park/parkListCoupon', {
                        title: '停车场列表',
                        parks: data.pData,
                        storeId:data.showShop,

                        couponsData:cData.data,
                        couponsTotal:cData.total,
                        isLogin:true,
                        channel:channel
                    });

                }).fail(function (err) {
                    next(err);
                });

            }else{
              //未登录
                q.fcall(function () {
                    return api.coupons.couponList(data.showShop,7,3,1,20)
                }).then(function (cData) {

                    res.render('park/parkListCoupon', {
                        title: '停车场列表',
                        parks: data.pData,
                        storeId:data.showShop,

                        couponsData:cData.data,
                        couponsTotal:cData.total,
                        isLogin:false,
                        channel:channel
                    });

                }).fail(function (err) {
                    next(err);
                });
            }

        }).catch(function (err) {
            next(err)
        }).done();

    }else{
        //查询所有停车场列表
        api.etc.getParks().then(function (data) {
            res.render('park/parkList', {
                title: '停车场列表',
                parks: data.data
            });
        }).fail(function (err) {
            next(err)
        });

    }

});

/**
 * 订单支付页
 */
router.get('/orderPay/:orderCode', function (req, res, next) {
    var orderCode = req.params['orderCode'];
    var unionid = req.cookies['unionid'];

    var getMember = function () {
        return api.user.meberInfo(unionid).then(function (data) {
            return data.data.isSiebel;
        });
    };

    q.all([getMember(), api.etc.findPreOrder(orderCode)]).spread(function (isSiebel, data) {
        res.render('park/orderPay', {
            title: '缴费单',
            order: data.data.order,
            sign: JSON.parse(data.data.payRequestParamJsonstr),
            isSiebel: isSiebel
        });
    }).fail(function (err) {
        next(err);
    });
});

/**
 * 订单状态页
 */
router.get('/status/:orderNo', function (req, res, next) {
    var orderCode = req.params['orderNo'];

    api.etc.orderStatus(orderCode).then(function (data) {
        res.render('park/payStatus', {
            title: '缴费结果',
            status: data.data
        })
    }).fail(function (err) {
        res.render('park/payStatus', {
            title: '缴费失败',
            status: {
                status: 'UNKNOWN',
                msg: '不知原因'
            }
        })
    });
});

/**
 * 地图
 */
router.get('/map/', function (req, res, next) {
    var latitude = req.params['latitude'];//纬度
    var longitude = req.params['longitude'];//经度

    res.render('park/map', {
        title: '地图',
        data:{
            latitude:latitude,
            longitude:longitude
        }
    })
});


/**
 * 地图商铺导航
 */
router.get('/map/parkShopNav', function (req, res, next) {
    var _channel=req.params['channel'];

    res.render('park/parkShopNav', {
        title: '地图',
        data:{
           shopList:[
               {
                   name:"购物中心 (影院、冰场)",
                   x:"112.8628867865",
                   y:"28.2000256673"
               },
               {
                   name:"梅西百货",
                   x:"112.8613150120",
                   y:"28.2009617437"
               },
               {
                   name:"游乐王国",
                   x:"112.8632032871",
                   y:"28.1980683903"
               },
               {
                   name:"飞行体验馆",
                   x:"112.8632032871",
                   y:"28.1980683903"
               },
               {
                   name:"精品超市",
                   x:"112.8632032871",
                   y:"28.1980683903"
               },
               {
                   name:"梅溪书院",
                   x:"112.8632032871",
                   y:"28.1980683903"
               },
               {
                   name:"跨境电商",
                   x:"112.8613150120",
                   y:"28.2009617437"
               },
               {
                   name:"执金珠宝",
                   x:"112.8613150120",
                   y:"28.2009617437"
               },
               {
                   name:"喜来登酒店",
                   x:"112.8627419472",
                   y:"28.1956619305"
               }
           ]
        }
    })
});

/**
 * PC 端查停车费 梅溪新天地停车查询系统 012838
 */
router.get("/pc/query/:channel", function (req, res, next) {
   
    var shopId = req.params['channel'];
    var _tit="";
    switch (shopId){
        case "012838":
            _tit="步步高梅溪新天地·停车查询系统";
            break;
        case "012018":
            _tit="步步高广场湘潭店·停车查询系统";
            break;
        default:
            _tit="本系统不支持当前地区";
    }
    res.render('park/pcQuery', {
        title: _tit,
        shopId: shopId
    });

});
/**
 * PC 车位信息
 */
router.get('/pc/query/:shopId/:carNo', function (req, res, next) {
    var carNo = req.params['carNo'];
    var shopId = req.params['shopId'];
    var _parkName="";

    switch (shopId){
        case "012838":
            _parkName="步步高梅溪新天地";
            break;
        case "012018":
            _parkName="步步高广场湘潭店";
            break;
        default:
            _parkName="本系统不支持当前地区";
    }

    var renderPage = function (carList, firstCarStatus) {
        res.render('park/pcLocateCar', {
            title: '车位信息',
            carList: carList,
            firstCarStatus: firstCarStatus,
            shopId: shopId,
            parkName:_parkName
        });
    };

    //todo pc端接口
    api.etc.pcCarStatus(carNo, shopId).then(function (firstCarStatus) {
        //console.log(firstCarStatus);
        renderPage([carNo], firstCarStatus);
    })

});

/**
 * 完善车牌信息
 */
router.get('/perfectCarInfo/:shopId', handleAuth, handleLogin, function (req, res, next) {
    var shopId = req.params['shopId'];
    res.render('park/perfectCarInfo', {
        title: '完善车牌信息',
        shopId: shopId
    });
});

module.exports = router;