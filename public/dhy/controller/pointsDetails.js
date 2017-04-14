/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/4
 * Time: 16:12
 * 礼品订单--详情
 * */
'use strict';
define(function (require, exports, module){
    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        var _type=App.getParam("type");
        var _id=App.getParam("id");
        var _giftcategoryName=decodeURI(App.getParam("giftcategoryName"));
        var _this=this;

        App.getJSON("order/detail?orderid="+_id+"&type=gift",function(res){
            console.log(res);
            if(res.code=="0000"){
                var _data={
                    "giftcategoryName":_giftcategoryName
                };
                $.extend(_data,res.data);
                App.render({
                    url:_this.RouterTmpUrl,
                    data:{title:_this.RouterTitle,data:_data,type:_type},
                    _this:_this
                });
            }
        });

    }
});
