/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2016/4/6
 * Time: 15:10 "$","touch","callbacks","deferred","device","adapter","EJS"
 * */
'use strict';
define(function (require, exports, module){
    //依赖加载
    require("public/static/js/component/zepto.js");
    require("public/static/js/component/callbacks");
    require("public/static/js/component/deferred");
    require("public/static/js/component/device");
    require("public/static/js/component/adapter");
    require("public/static/js/component/touch");
    require("public/static/js/component/ejs");
    require("public/static/js/component/IScroll");
    require("public/static/js/component/timer");
    require("public/static/js/component/swipeSlide");
    require("./app");
    require("./init");
});