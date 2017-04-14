/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/4
 * Time: 16:12
 * 支付付款 二维码
 * */
'use strict';
define(function (require, exports, module) {
    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        var _code=App.getParam("code");
        App.render({
            url:_this.RouterTmpUrl,
            data:{title:_this.RouterTitle,code:_code},
            _this:_this
        });
        //轮回查询 STATUS 0=创建 1=已交易 2=已取消 9=已失效
        var interBool=true;
        var $body=$('body');
        $body.everyTime('5s',"A",function(){
            console.log("looking...");
            if(interBool){
                App.ajaxJSON({
                    url: "paypass/barcodestatus?barcode=" + _code,
                    beforeSend:function(){},
                    complete:function(){},
                    success: function (res){
                        interBool = true;
                        if (res.data.STATUS == "0") {

                        } else if (res.data.STATUS == "1") {

                            App.Popover.weak({
                                txt: "已交易!", callback: function () {
                                    window.clearInterval(interval);
                                    window.location.href = "#/redList";
                                }
                            });

                        } else if (res.data.STATUS == "2") {
                            App.Popover.weak({
                                txt: "已取消!", callback: function () {
                                    window.clearInterval(interval);
                                    window.location.href = "#/orderPayment?type=0";
                                }
                            });

                        } else if (res.data.STATUS == "9") {
                            App.Popover.weak({
                                txt: "已失效!", callback: function () {
                                    window.clearInterval(interval);
                                    window.location.href = "#/orderPayment?type=0";
                                }
                            });
                        }
                    }
                });
            }
            interBool=false;
        });
        //计时
        var timesOut=$("#timesOut");
        var count=600;//600秒=10分钟
        $body.everyTime('1s',"B",function(){
            if (count > 0) {
                count--;
            } else {
                count = 0;
                $body.stopTime();
                App.Popover.weak({
                    txt:"操作超时,请重新生成!",
                    callback:function(){
                        window.location.href="#/orderPayment?type=0";
                    }
                });
            }
            timesOut.html(App.formatSeconds(count));
        });

    };
});
