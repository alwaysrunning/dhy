/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/4
 * Time: 16:12
 * 优惠券列表 type=1商城 2门店 3联盟  siebel 门店 member联盟 mall商城
 * */
'use strict';
define(function (require, exports, module) {
    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        var _type=App.getParam("type");
        var queryType=[{name:"云猴网·优惠券",value:"mall"},{name:"门店·优惠券",value:"siebel"},{name:"联盟·优惠券",value:"member"}];
        var CouponData={
            mall:{},
            siebel:{},
            member:{}
        };

        if(_type=="2"){
            //步步高门店
            $.when(
                App.getPromise("coupon/list?page=1&pagesize=10&status="+"可用"+"&type=siebel"),
                App.getPromise("coupon/list?page=1&pagesize=10&status="+"已应用"+"&type=siebel"),
                App.getPromise("coupon/list?page=1&pagesize=10&status="+"过期的"+"&type=siebel")
            ).then(function (res1,res2,res3) {
                //console.log(res1,res2,res3,res4);
                App.render({
                    url: _this.RouterTmpUrl,
                    data: {
                        title:queryType[_type-1]["name"],
                        type: _type,
                        data: {
                            "usable":res1,
                            "apply":res2,
                            "expire":res3
                        }
                    },
                    _this: _this
                });
                $("head title").empty().html(queryType[_type-1]["name"]);
            });
        }

    };
});
