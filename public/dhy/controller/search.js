/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/30
 * Time: 16:32
 * 搜索结果
 * */
'use strict';
define(function (require, exports, module) {
    module.exports= function(){
        var _this=this;
        var _giftName=App.getParam("giftName")||"";
        App.getJSON("gift/search?giftname="+_giftName+"&page=1&pagesize=10",function(res){
            console.log(res);
            if(res.code=="0000"){
                App.render({
                    url:_this.RouterTmpUrl,
                    data:{title:_this.RouterTitle,data:res.data},
                    _this:_this
                });
            }
        });
    };
});