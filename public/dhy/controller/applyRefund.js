/**
 * Created by Ray on 2016/3/25.
 */
'use strict';
define(function (require, exports, module) {
    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        var money=App.getParam("money");
        money="200.00";
        var _this=this;
        App.render({
            url:_this.RouterTmpUrl,
            data:{title:_this.RouterTitle,money:money},
            _this:_this
        });
        //radio模拟
        var $refundTypeList=$("#refundType label");
        var typeList=$refundTypeList.find("input").map(function () {
            return this.value;
        });
        var typeIndex=0;
        $refundTypeList.find("input").change(function (event) {
            var index=parseInt($(event.target).parent().data("index"));
            $($refundTypeList[index]).addClass("chosen");
            $($refundTypeList[1^index]).removeClass("chosen");
            typeIndex=index;
        });
        //图片上传
        var $certificate=$("#certificate");
        var $imgUploader=$certificate.find("#imgUploader");
        var localImgSrcs=[];
        $imgUploader.on("tap",function () {
            var imgCount=$certificate.children("img").length;
            wx.chooseImage({
                count: 3-imgCount, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    localImgSrcs.push(localIds);
                    var imgs="";
                    $.each(localIds,function (i,src) {
                        imgs+=('<img class="item" src="'+src+'">');
                    });
                    var $imgs=$(imgs);
                    $imgUploader.before($imgs);
                    imgCount=$certificate.children("img").length;
                    if(imgCount === 3){
                        $imgUploader.hide();
                    }
                }
            });
        });
        //切换图片
        $certificate.on("tap","img",function () {
            var _this=this;
            var index=$(_this).index();
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    _this.src=localIds[0];
                    localImgSrcs[index]=localIds;
                }
            });
        });
        //提交
        $("#submit").on("tap",function () {
            wx.uploadImage({
                localId: localImgSrcs, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: function (res) {
                    var serverId = res.serverId; // 返回图片的服务器端ID
                    var data={
                        money:money,
                        type:typeList[typeIndex],
                        remark:$.trim($("#remark").val()),
                        images:serverId
                    }
                    App.postJSON("/order/cancel",data,function () {
                        location.hash=""
                    })
                }
            });
            
        })
    };
});