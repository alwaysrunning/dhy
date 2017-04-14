/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2016/3/24
 * Time: 11:29
 * 卡券号积分
 * */
'use strict';
define(function (require, exports, module) {
    module.exports= function(){
        var _this=this;
        App.render({
            url:_this.RouterTmpUrl,
            data:{title:_this.RouterTitle},
            _this:_this
        }).component.formInputChange();
        //监听提交按钮
        App.component.listenSubmitBtn({form: "#cardPointsForm", inputs: "input", submitBtn: "#cardPointsFormBtn"});
        //提交增加积分
        $("#cardPointsFormBtn").on("click",function(){
            var _cardInput=$("#cardInput").val();
            if(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{12}$/.test(_cardInput)){
                App.getJSON("account/pointIncrease?cardno="+_cardInput,function(pa){
                    App.Popover.confirm("",pa.message,"查看明细","马上花掉",true,function(){
                        location.href="#/pointsList"
                    },function(){
                        location.href="#/pointsExchange";
                    });
                })
            }else{
               App.Popover.weak({
                   txt:"兑换码错误，请重新输入",
                   callback:function(){
                       var icoGb=$(".u-form-item .icon-guanbi");
                       icoGb.triggerHandler("tap.gb");
                       icoGb.triggerHandler("click");
                   }
               })
            }
        });
        //扫码付
        App.component.scanCodePay({
            app:App,
            trriger:"#scanPoints",
            callback:function(result){
                var _cardNo = result.split("=")[1];
                location.href="#/scanPoints?cardno="+_cardNo;
            }
        });
    };
});