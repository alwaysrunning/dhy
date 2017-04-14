/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/4
 * Time: 16:12
 * 积分换礼
 * */
'use strict';
define(function (require, exports, module) {

    module.exports= function(){
        var _this=this;
        var posCity=App.component.storageGet("city")||{"id":"430100000000","name":"长沙市"};
        var _area=posCity["id"];//地区id（测试时使用 430100000000）
        var _category=0;// gift/category接口获得的分类
        var _page=1;
        var _pageSize=10;
        var _order="price"; //order 排序方式 price 价格, sell 销量
        var _orderType="asc";//orderType  排序方式 asc 升序 小到大, desc 降序 大到小
        var _ids="";
        var _storesId="120135";
        var channel = App.getParam('channel')||"V0101"; //王府 120135
        var _searchQueryUrl="gift/search?area=" + _area + "&category=" + _category + "&page=" + _page + "&pagesize=" + _pageSize + "&order=" + _order + "&ordertype=" + _orderType + "&ids=" + _ids;
        if(channel==_storesId){
            _searchQueryUrl="gift/search?storesid="+_storesId + "&category=" + _category + "&page=" + _page + "&pagesize=" + _pageSize + "&order=" + _order + "&ordertype=" + _orderType + "&ids=" + _ids;
        }

        $.when(
            App.getPromise("gift/category"), //礼品分类
            App.getPromise("store/advert?zomeid=108"), //广告
            App.getPromise(_searchQueryUrl) //产品列表
        ).then(function (shopRes,adRes,res) {
            console.log("礼品分类",shopRes);
            console.log("广告",adRes);
            console.log("产品列表",res);

            var _curCity = posCity;
            if (!_curCity) {
                _curCity = {"id": "430100000000", "name": "长沙市"}
            }

            App.render({
                url: _this.RouterTmpUrl,
                data: {
                    title: _this.RouterTitle,
                    data: res.data,
                    curCity: _curCity,
                    sortGoods: shopRes.data,
                    adList:adRes.data,
                    channel:channel
                },
                _this: _this
            });
        });

    };
});