/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2016/4/6
 * Time: 15:57
 * */
'use strict';
(function () {
    var Ver = '201601115';
    seajs.config({
        // 基础路径
        base: '/',
        // 别名配置
        alias: {
            "$": "public/static/js/lib/zepto.js",
            "Zepto":"public/static/js/lib/zepto.js"
        },
        // 调试模式
        debug: true,
        // 文件编码
        charset: 'utf-8',
        //文件映射 可配置版本号
        map: [
            ['.css', '.css?v=' + Ver],
            ['.js', '.js?v=' + Ver]
        ]
    });
})();