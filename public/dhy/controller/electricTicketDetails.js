/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/12/3
 * Time: 14:24
 * 电子小票·详情
 * */
'use strict';
define(function (require, exports, module) {
    module.exports= function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        var _id=App.getParam("txnId");
        var _cardno=App.getParam("cardno");
        var _carriercd = App.getParam('carriercd');
        App.getJSON("pos/detail?txnId="+_id+"&cardno="+_cardno+"&carriercd=" + _carriercd,function(res){
            console.log(res);
            App.render({
                url:_this.RouterTmpUrl,
                data:{title:_this.RouterTitle,data:res.data},
                _this:_this
            });
            //计算产品总数和金额
            var totalNum=0;
            $.each($(("#products dd")),function(){
                totalNum += $(this).data("num");
            });
            $("#totalNum").html(totalNum);
        });
    };
});