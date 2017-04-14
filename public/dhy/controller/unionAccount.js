/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/10
 * Time: 16:12
 * 我的联通账户
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
             //TODO 联通身份验证
             App.getJSON("unicom/validate?phone="+_phone,function(res){
                 console.log(res,"+++");
             });
             //TODO 积分获取
             App.getJSON("unicom/integral?phone="+_phone,function(res){
                 console.log(res,"---");
             });

             App.render({
                 url:_this.RouterTmpUrl,
                 data:{title:_this.RouterTitle,ratio:_ratio,typePointName:"联通"},
                 _this:_this
             });
             var changePoints=$("#changePoints");
             var changePointHtml=$("#changeRed");
             //监听提交按钮
             App.component.listenSubmitBtn({form:"#exchangePointFrom",inputs:".u-form-input-text-orange",submitBtn:"#exchangeRedFromSubmit",inputCallback:function(){
                 var pointsText=arguments[0].val();
                 var changePoints=pointsText/_ratio;
                 changePointHtml.html(changePoints.toFixed(2));
             }});
             //兑换积分 //TODO 兑换积分
             $("#exchangeRedFromSubmit").on("tap",function(){
                 var _integral=changePoints.val();
                 App.getJSON("unicom/exchange?phone="+_phone+"&integral="+_integral,function(res){
                     console.log(res);
                 })
             });
         }
     };
});
