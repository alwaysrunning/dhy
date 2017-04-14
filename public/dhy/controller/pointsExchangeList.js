/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2016/2/17
 * Time: 11:05
 * 积分商品列表
 * */
'use strict';
define(function (require, exports, module) {
    module.exports= function(){
        var _this=this;
        var posCity=App.component.storageGet("city")||{"id":"430100000000","name":"长沙市"};
        var _area=posCity["id"];//地区id（测试时使用 430100000000）
        var _category=decodeURIComponent(App.getParam("category")||0);
        var _page=1;
        var _pageSize=10;
        var _order="price"; //order 排序方式 price 价格, sell 销量
        var _orderType="asc";//orderType  排序方式 asc 升序 小到大, desc 降序 大到小
        var _ids=decodeURIComponent(App.getParam("idArr")||"");
        //礼品列表
        App.getJSON("gift/search?area=" + _area + "&category=" + _category + "&page=" + _page + "&pagesize=" + _pageSize + "&order=" + _order + "&ordertype=" + _orderType + "&ids=" + _ids,
            function (res) {
                console.log("礼品列表",res);
                App.render({
                    url: _this.RouterTmpUrl,
                    data: {
                        title: _this.RouterTitle,
                        data: res.data
                    },
                    _this: _this
                });
            });
    };
});