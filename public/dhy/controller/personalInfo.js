/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/10/22
 * Time: 9:49
 * 完善个人信息 #/personalInfo?mobile=14789997615
 * */
'use strict';
define(function (require, exports, module) {
    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        var mobile=App.getParam("mobile") || App.component.storageGet("localMobile").val;
        var fromUrl=App.getParam("fromUrl");
        var withUser = App.getParam('withUser');
        App.render({
            url:this.RouterTmpUrl,
            data:{title:this.RouterTitle,mobile:mobile},
            _this:this
        }).component.formInputChange();

        //console.log(encodeURIComponent("#/pointsExchangeDetails?id=1101"));
        //console.log(decodeURIComponent(formUrl));

        var personalInfoFormSubmit=$("#personalInfoFormSubmit");
        var mobileInput=$("#mobile");
        var nameInput=$("#name");
        var idInput=$("#idNo");
        //监听提交按钮
        App.component.listenSubmitBtn({form:"#personalInfoForm",inputs:".u-listen-input",submitBtn:"#personalInfoFormSubmit"});
        personalInfoFormSubmit.on("click",function(){
            App.postJSON("account/sync",{
                mobile:mobileInput.val(),
                name:nameInput.val(),
                id:idInput.val()
            },function(res){
                if(res.code=="0000") {
                    App.Popover.weak({txt:res.message,
                        callback:function(){
                            if(fromUrl && fromUrl.length>0){
                                if (withUser === '1') {
                                    location.href = 'http://' + window.location.host + '/easy/jump?url=' + fromUrl;
                                }else{
                                    location.href = decodeURIComponent(fromUrl)
                                }
                            }else{
                                window.location.href="#/memberCenter"
                            }
                        }
                    });
                }
            })
        });
    };
});
