/**
 * Created by Ray on 2016/3/29.
 */
'use strict';
define(function (require, exports, module) {
    module.exports=function(){
        if(!App.pageAuth()){
            return false;
        }
        var _this=this;
        App.render({
            url:_this.RouterTmpUrl,
            data:{title:_this.RouterTitle},
            _this:_this
        });
        var $zoom=$("#zoom")
        // $("#search").on("input",function () {
        //     if($(this).val().length){
        //         $zoom.hide();
        //     }else {
        //         $zoom.show();
        //     }
        // })
    };
});
