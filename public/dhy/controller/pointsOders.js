/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/4
 * Time: 16:12
 * 礼品订单列表
 * */
'use strict';
define(function (require, exports, module){
    module.exports= function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        $.when(
            App.getPromise("order/search?page=1&pagesize=10&status=0&type=gift"),
            App.getPromise("order/search?page=1&pagesize=10&status=1&type=gift"),
            App.getPromise("order/search?page=1&pagesize=10&status=2&type=gift")
        ).then(function (res1,res2,res3) {
            //console.log(res1,res2,res3,res4);
            //渲染视图
            App.render({
                url:_this.RouterTmpUrl,
                data:{title:_this.RouterTitle,data:{
                    "all":res1.data,
                    "shipped":res2.data,
                    "receipt":res3.data
                }},
                _this:_this
            });
            //待发货
            if(res2.data && res2.total>0){
                var _r2Total=res2.total;
                if(_r2Total>99){
                    _r2Total="99+";
                }
                $("#fhi").removeClass("u-hidden").html(_r2Total);
            }
            //待收货
            if(res3.data && res3.total>0){
                var _r3Total=res3.total;
                if(_r3Total>99){
                    _r3Total="99+";
                }
                $("#shi").removeClass("u-hidden").html(_r3Total);
            }
        });
    };
});