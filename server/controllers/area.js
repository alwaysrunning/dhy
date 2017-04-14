/**
 * Created by 沐沐 on 2015-11-05.
 */

var api = require('api');

//定位
module.exports.location = function (req, res, next) {
    var lat = req.query['lat'];
    var lng = req.query['lng'];
    api.area.location(lat, lng).then(function (data) {
        res.json(data)
    }).fail(function (err) {
        next(err);
    })
};

//已开放城市列表
module.exports.areas = function (req, res, next) {
    api.area.area().then(function (data) {
        res.json(data)
    }).fail(function (err) {
        next(err)
    });
};

//根据地理代码查询城市
module.exports.getRegionByCode=function (req, res, next) {
    var _parentId=req.query["parentId"]||0;
    var _tree=req.query["tree"]||4;
    api.area.getRegionByCode(_parentId,_tree).then(function (data) {
        res.json(data)
    }).fail(function (err) {
        next(err)
    });
};
//查询城市所有
module.exports.getRegionAll=function (req, res, next) {
    api.area.getRegionAll().then(function (data) {
        res.json(data)
    }).fail(function (err) {
        next(err)
    });
};

