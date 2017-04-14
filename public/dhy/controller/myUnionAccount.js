/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/10
 * Time: 16:12
 * 我的银联账户
 * */
'use strict';
define(function (require, exports, module) {
    module.exports= function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        var Store=new App.store();
        var _phone=Store.get("localMobile").val;
        var _ratio=100;//100:1
        if(!_phone){
            window.location.href="#/login";
        }else{
            //获取列表
            App.getJSON('unionpay/cards',function(res){
                if(res.code="0000" && res.data.cardlist.length>0){//test =0
                    App.render({
                        url:_this.RouterTmpUrl,
                        data:{title:_this.RouterTitle,mobile:_phone,ratio:_ratio,typePointName:"银联",data:res.data},
                        _this:_this
                    }).component.formInputChange();
                    var changePoints=$("#changePoints");
                    var changePointHtml=$("#changeRed");
                    //slider
                    $('#slide2').swipeSlide({
                        autoSwipe:false,
                        continuousScroll:false,
                        lazyLoad : true,
                        speed : 3000,
                        transitionType : 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
                        firstCallback : function(i,sum,me){
                            me.siblings('.usm-ft').find('.u-slider-dot').children().first().addClass('u-active');
                            var _bankno=me.find(".u-slider-list li").eq(i).data('bankno');
                            changePoints.data('bankno',_bankno);
                        },
                        callback : function(i,sum,me){
                            me.siblings('.usm-ft').find('.u-slider-dot').children().eq(i).addClass('u-active').siblings().removeClass('u-active');
                            var _bankno=me.find(".u-slider-list li").eq(i).data('bankno');
                            changePoints.data('bankno',_bankno);
                        }
                    });
                    //监听提交按钮
                    App.component.listenSubmitBtn({form:"#exchangePointFrom",inputs:".u-form-input-text-orange",submitBtn:"#exchangeRedFromSubmit",inputCallback:function(){
                        var pointsText=arguments[0].val();
                        var changePoints=pointsText/_ratio;
                        changePointHtml.html(changePoints.toFixed(2));
                    }});
                    //兑换积分
                    $("#exchangeRedFromSubmit").on("tap",function(){
                        var _integral=changePoints.val();
                        var _bankno=changePoints.data('bankno');
                        App.getJSON("unionpay/exchange?bankno="+_bankno+"&integal="+_integral+"&type=1",function(res){
                            if(res.code="0000"){
                                App.Popover.confirm("是否即刻就去礼品中心使用红包兑换礼品？",res.message,"下次再说","现在就去",true,function(){},function(){
                                    window.location.href="#/pointsExchange"
                                });
                            }
                        })
                    });
                }else if(res.code="0000" && res.data.cardlist.length<=0){
                    window.location.href="#/myUnionAddCard";
                }
            });
        }
    };
});
