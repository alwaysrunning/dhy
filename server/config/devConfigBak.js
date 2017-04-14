/**
 * Created by 沐沐 on 2015-10-22.
 * 开发环境
 */

var conf = require('api').config;

module.exports=conf({
    api: {
        printLog: true,
        printSign: false,//是否打印签名信息
        autoToken: false,//是否用测试token
        testTokens: {
            tokenId: '55cb831071d040d6a6bff00edb03f473',
            secret: 'aab56db4e5b1619d905dd48d3acf23eb'
        },
        webHost: 'bbg.dfkexin.com:8973',//线上域名 bbg.dfkexin.com:8973      bbgwx.dfkexin.com:8973
        useHost: 'bbg.dfkexin.com:8973',//部署域名 bbg.dfkexin.com:8973
        // useHost: '218.76.52.6:8973',//部署域名
        host: '10.200.51.104',//API测试服务器地址 10.200.51.104  mi.yunhou.com 10.200.51.175
        port: 8080,//API测试服务器端口号 8080
        path: '/bubugao-mobile-api/app',//测试服务器普通API请求地址
        authPath: '/bubugao-mobile-api/app/auth',//测试服务器验证API请求地址
        ver: '3.0',
        timeout: 1500000
    },
    weixin: {
        printLog: true,
        AppID: 'wx2482acfbba8f8744',//微信AppID
        AppSecret: 'bbde1f22cfd6abbf141e07cc22cca11d',//微信AppSecret,
        testCode: {
            openid: 'oAmm9wNqPGaY3aq-Zy3PqZV6gGTk',//oAmm9wNqPGaY3aq-Zy3PqZV6gGTk  omFGqjk9Pw8pPVlDPXBtJCwA7INw
            unionid: 'oB8iWjicD_SlyGpSKHWedTrUj4N4'
        },
        ignore:true, //忽略微信，测试时使用 //todo false
        tokenDebug:true//是否在测试阶段使用线上微信票据防止冲突 //todo false
    },
    easy:{
        host:'qa.b.weixin.rongyi.com',
        port:80
    },
    tuju:{
        host:'106.75.7.176',
        port:8082,
        printLog: true
    },
    baidu: {
        ak: '3b7a1d8559213e6f223b7dee604b6246'//百度服务接口key
    }
});