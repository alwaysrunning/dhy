/**
 * Created by 沐沐 on 2016-01-05.
 */

var api = require('api');

/**
 * 查询绑定的车
 */
module.exports.cars = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var tokenid = req.cookies['tokenid'] ||'';

    api.etc.cars(unionid, tokenid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

/**
 * 停车信息
 */
module.exports.info = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var carNo = req.query['carno'];
    var shopId = req.query['shopid'];//*******
    var tokenid = req.cookies['tokenid'] || '';

    api.request.getTokens(unionid).then(function (tokens) {
        return api.etc.carInfo(tokens, carNo, shopId, tokenid).then(function (info) {
            return api.etc.calcPos(tokens, carNo, info.data.shopId,tokenid).then(function (pos) {
                return {
                    info: info.data,
                    pos: pos.data
                };
            })
        });
    }).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

/**
 * 绑定消费小票
 */
module.exports.bindPos = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var parkNo = req.query['parkno'];
    var shopId = req.query['shopid'];
    var carNo = req.query['carno'];
    var tokenid = req.cookies['tokenid'] || '';

    api.etc.bindPos(unionid, shopId, parkNo, carNo, tokenid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

/**
 * 计算消费小票减免
 */
module.exports.calcPos = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var carNo = req.query['carno'];
    var shopId = req.query['shopid'];

    api.etc.calcPos(unionid, carNo, shopId).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

/**
 * 查询绑定的消费小票
 */
module.exports.pos = function (req, res, next) {
    var parkNo = req.query['parkno'];
    var shopid = req.query['shopid'];

    api.etc.getPos(shopid, parkNo).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

/**
 * 查询停车历史
 */
module.exports.history = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var page = req.query['page'];
    var pageSize = req.query['pagesize'];
    var tokenid = req.cookies['tokenid'] || '';

    api.etc.orders(unionid, page, pageSize, tokenid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

/**
 * 删除车牌绑定
 */
module.exports.del = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var carNo = req.query['carno'];
    var tokenid = req.cookies['tokenid'] || '';

    api.etc.carDel(unionid, carNo, tokenid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

/**
 * 清除所有车牌绑定
 */
module.exports.clear = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var tokenid = req.cookies['tokenid'] || '';

    api.etc.carClear(unionid,tokenid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

/**
 * 绑定车牌
 */
module.exports.bind = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var carNo = req.query['carno'];
    var tokenid = req.cookies['tokenid'] || '';

    api.etc.bindCar(unionid, carNo, tokenid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

/**
 * 订单确认
 */
module.exports.orderComfirm = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];
    var carNo = req.body['carNo'];
    var money = req.body['money'];
    var shopId = req.body['shopId'];//*****
    var posMoney = req.body['posMoney'];
    var weixinMoney = req.body['weixinMoney'];

    api.etc.orderConfirmV2(unionid, carNo, shopId, money, posMoney, weixinMoney, openid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    });
};

/**
 * 模糊查询车位
 */
module.exports.carQuery = function (req, res, next) {
    var qString = req.query['query'];
    var parkid = req.query['parkid'];

    api.etc.positionQuery(qString, parkid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

/**
 * 模糊按车牌查找
 */
module.exports.carQueryByCar = function (req, res, next) {
    var qString = req.query['query'];
    var parkid = req.query['parkid'];

    api.etc.carParkInfo(qString, parkid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

/**
 * 保存车位信息
 */
module.exports.savePosition = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];

    var parkid = req.query['parkid'];
    var parkpositionid = req.query['parkpositionid'];
    var parkpositionfloor = req.query['parkpositionfloor'];

    api.etc.savePosition(parkid, parkpositionid, parkpositionfloor, unionid, openid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    })

};

/**
 * 删除车位记录
 */
module.exports.delPosition = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var opendid = req.cookies['openid'];
    var parkid = req.query['parkid'];
    var Id = req.query['id'];
    var parkpositionid = req.query['parkpositionid'];
    var parkpositionfloor = req.query['parkpositionfloor'];

    api.etc.delPosition(parkid, Id, unionid, opendid, parkpositionid, parkpositionfloor).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

/**
 * 4个最近的车位记录
 */
module.exports.positionList = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var opendid = req.cookies['openid'];
    var parkid = req.query['parkid'];

    api.etc.positionList(parkid, unionid, opendid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    })
};

/**
 * 车牌状态查询
 */
module.exports.carStatus = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var carNo = req.query['carno'];
    var shopId = req.query['shopid'];

    api.etc.carStatus(carNo, shopId, unionid).then(function (carStatus) {
        res.json({
            carStatus: carStatus
        });
    });
};

/**
 * 扫码记车牌
 */
module.exports.scanToRememberPosition = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];
    var shopId = req.query['parkid'];
    var qrcode = req.query['qrcode'];

    api.etc.positionScan(shopId, qrcode, unionid, openid).then(function (body) {
        res.json(body);
    }).fail(function (err) {
        next(err);
    })
};