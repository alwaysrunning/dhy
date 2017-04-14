/**
 * Created by 沐沐 on 2015-10-22.
 * 正式环境
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

        webHost: 'wx.yunhou.com',//线上域名
        useHost:'wx.yunhou.com',//部署域名

        //host: '10.200.51.104',//API测试服务器地址
        //port: 8080,//API测试服务器端口号
        //host: '10.201.25.93',//API测试服务器地址
        //port: 8080,//API测试服务器端口号
        //path: '/bubugao-mobile-api/app',//测试服务器普通API请求地址
        //authPath: '/bubugao-mobile-api/app/auth',//测试服务器验证API请求地址

        host: 'mi.bubugao-inc.com',//线上主机地址
        port: 80,//线上主机端口
        path: '/yunhou-mi/app',//线上普通API请求地址
        authPath: '/yunhou-mi/app/auth',//线上验证API请求地址

        ver: '2.7',

        timeout: 15000
    },
    weixin: {
        printLog: true,
        AppID: 'wxa0d11eaadd8cd30b',//微信AppID
        AppSecret: '35f0e4beae7a21154b34af84df2f85f3',//微信AppSecret,
        testCode:{
            openid:'omFGqjk9Pw8pPVlDPXBtJCwA7INw',
            unionid:'oB8iWjicD_SlyGpSKHWedTrUj4N4'
        },
        ignore: false, //忽略微信，测试时使用
        tokenDebug: false//是否在测试阶段使用线上微信票据防止冲突
    },
    easy:{
        host:'manage.wx.rongyi.com',
        port:80
    },
    baidu: {
        ak: '3b7a1d8559213e6f223b7dee604b6246'//百度服务接口key
    }
});