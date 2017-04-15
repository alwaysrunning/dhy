var serverDir = "./server/";//服务端目录
var clientDir = "./public";//客户端目录

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var helmet = require('helmet');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });

var routes = require(serverDir + 'routes/index');//大会员
var apiRoutes = require(serverDir + 'routes/api');
var codeRoutes = require(serverDir + 'routes/code');
var ferrisRoutes = require(serverDir + 'routes/ferris');//摩天轮
var invitationRoutes = require(serverDir + 'routes/invitation');
var parkRoutes = require(serverDir + 'routes/park');//停车缴费
var secKillRoutes = require(serverDir + 'routes/secKill');//星品汇爆款抢购
var activityRoutes = require(serverDir + 'routes/activity');//专题活动路由
var storeInfoRoutes = require(serverDir + 'routes/storeInfo');//门店信息
var dhyRoutes =require(serverDir + 'routes/dhyRoutes');//大会员服务端路由表
var dhySafeRoutes =require(serverDir + 'routes/dhySafeRoutes');//大会员服务端CSRF路由表
//配置本地配置文件
var Config=require(serverDir + 'config/index');
var logs = require("logs").logs;
//静态资源服务端配置
var compression = require('compression');
var staticConfig = {
    maxAge: '3600000'
};
var app = express();

// view engine setup
//app.set('env','developmentPre');
app.set('env','development');//* 这个很重要，涉及客户端配置文件
//app.set('env','testPre');//* 这个很重要，涉及客户端配置文件
//app.set('env','test');
//app.set('env','out');
//app.set('env','production');

switch (app.get('env')) {
    case 'production'://正式环境
        process.env.dev=false;
        Config.pro();
        app.use(compression());
        logs.configure();
        app.use(logs.useLog());
        app.use(logs.useLog("INFO", "serverResInfo"));
        break;
    case 'test'://测试联调开发环境 3000
        process.env.dev=false;
        Config.test();
        app.use(compression());
        logs.configure();
        app.use(logs.useLog());
        app.use(logs.useLog("INFO", "serverResInfo"));
        //app.use(logger('dev'));
        break;
    case 'testPre'://测试正式预览环境 3003
        process.env.dev=false;
        process.env.PORT=3003;
        Config.testPre();
        app.use(compression());
        logs.configure();
        app.use(logs.useLog());
        app.use(logs.useLog("INFO", "serverResInfo"));
        //app.use(logger('dev'));
        break;
    case 'out'://外包开发环境
        process.env.dev=true;
        process.env.devStyle="out";
        process.env.PORT=3001;
        Config.out();
        //app.use(compression());
        logs.configure();
        app.use(logs.useLog());
        app.use(logs.useLog("INFO", "serverResInfo"));
        //app.use(logger('dev'));
        break;
    //开发正式域名环境
    case 'developmentPre':
        process.env.dev=true;
        Config.test();
        app.use(compression());
        logs.configure();
        app.use(logs.useLog());
        app.use(logs.useLog("INFO", "serverResInfo"));
        break;
    //开发环境
    case 'development':
        process.env.dev=true;
        //process.env.PORT=3001;
        Config.dev();
        app.use(compression());
        logs.configure();
        app.use(logs.useLog());
        app.use(logs.useLog("INFO", "serverResInfo"));
        //app.use(logger('dev'));
        break;
    default :
        console.log("日志环境不存在!...");
}
app.set('views', path.join(__dirname, serverDir + 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));
app.use(parseForm);
app.use(cookieParser());

app.use(express.static(path.join(__dirname, clientDir)));
app.use('/public', express.static(path.join(__dirname, clientDir)));

app.use(helmet());

//外包开发环境使用设置跨域访问
if(process.env.devStyle=="out"){
    app.all('/api/*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://www.dhy.com");
        res.header("Access-Control-Allow-Credentials", true);
        res.header("Access-Control-Allow-Headers", 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With,token,secret,shopId,divId,deptId');
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", ' 3.2.1');
        res.header("Content-Type", "application/json;charset=utf-8");
        if (req.method == 'OPTIONS') {
            res.send(200); //让options请求快速返回
        } else {
            next();
        }
    });
}

app.use('/', routes);
app.use('/api', apiRoutes);
app.use('/code', codeRoutes);
app.use('/ferris', ferrisRoutes);
app.use('/park', parkRoutes);
app.use('/secKill', secKillRoutes);
app.use('/invitation', invitationRoutes);
app.use('/activity', activityRoutes);
app.use('/storeInfo', storeInfoRoutes);
app.use('/dhy',dhyRoutes);
app.use('/dhySafe',csrfProtection,dhySafeRoutes);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('师傅！大师兄被妖怪抓走啦！');
    err.status = 404;
    next(err);
});

// error handlers
app.use(function (err, req, res, next) {
    if (req.url.indexOf('/api') >= 0 || req.url.indexOf('/dhySafe') >= 0) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            code: err.code || err.status || 500,
            type: err.type || 'other',
            data: err.data || null
        });
    } else {
        next(err);
    }
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
