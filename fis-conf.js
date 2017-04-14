/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2016/01/18
 * Time: 9:47
 * */

var now = new Date();
var timeStamp = [now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()].join('');
fis.set('project.charset', 'utf8');
fis.set('timeStamp', timeStamp);

//目录配置
var Config = {
    src: {
        root: "/public/",
        server: "/server/",
        clientView: "/public/views/",
        serverView: "/server/views/"
    },
    ignore: [
        '.git/**',
        '.svn/**',
        '*.bak',
        '*.log',
        '.idea',
        '{*,**/*}.scss',
        '*.rb',
        '*.md',
        '*.log',
        '/sass-cache/**',
        '/bower_components/**',
        //'/node_modules/**',
        //'/server/{*,**/*}',
        'gulpfile.js',
        'fis-conf.js'
    ]
};
/******************排除某些文件**********************/
fis.set('project.ignore', Config.ignore);

fis.match('/server/{*,**/*}', {
    useMap: false,
    useHash: false,
    useCompile: false
});

fis.match('/node_modules/{*,**/*}', {
    useMap: false,
    useHash: false,
    useCompile: false
});

fis.match('./app.js', {
    useMap: false,
    useHash: false,
    useCompile: false
});
/******************静态资源处理**********************/
//只需要编译 html 文件，以及其用到的资源。
//fis.set('project.files', ['*.html', '*.ejs', 'map.json']);

//cmd模块化标识
fis.match(Config.src.root + 'dhy/**.js', {
    isMod: true
});
fis.match(Config.src.root + 'static/js/component/**.js', {
    isMod: true
});

fis.match(Config.src.root + 'static/js/lib/jquery.min.js', {
    isMod: false
});

fis.match(Config.src.root + 'static/js/lib/sea.js', {
    isMod: false
});

fis.match(Config.src.server + '{*,**/*}', {
    isMod: false
});

fis.hook('cmd', {
    baseUrl: '/',
    paths: {
        "$": "public/static/js/lib/zepto.js"
    }
});
//加md5
fis.match(Config.src.root + '**.{otf,eot,svg,ttf,woff,woff2}', {
    useHash: true
});

fis.match(Config.src.root + '{*,**/*}flexible.js', {
    useHash: false
});
//JS
fis.match(Config.src.root + '**.js', {
    query: '?=t' + fis.get('timeStamp'),
    optimizer: fis.plugin('uglify-js')
});

//CSS
fis.match(Config.src.root + '**.css', {
    query: '?=t' + fis.get('timeStamp'),
    useSprite: true,
    postprocessor : fis.plugin("autoprefixer",{
        // https://github.com/ai/browserslist#queries
        "browsers": ['Firefox >= 20', 'Safari >= 6', 'Explorer >= 9', 'Chrome >= 12', "ChromeAndroid >= 4.0"],
        "flexboxfixer": true,
        "gradientfixer": true
    }),
    optimizer: fis.plugin('clean-css')
});

//sass
//fis.match(Config.src.root + '**.{scss,sass}', {
//    rExt: '.css',
//    parser: fis.plugin('node-sass', {
//        include_paths:[Config.src.root +'static/sass']
//    })
//});

//png
fis.match(Config.src.root + '**.png', {
    optimizer: fis.plugin('png-compressor')
});

//ejs
fis.match(Config.src.serverView + '**.ejs', {
    isHtmlLike: true,
    useCompile: true
});
/******************发布到远程服务器**********************/
fis.media('develop').match('*', {
    deploy: fis.plugin('http-push', {
        receiver: 'http://10.201.23.3:8999/receiver',
        to: '/home/dhy/' // 注意这个是指的是测试机器的路径，而非本地机器
    })
});
fis.media('test').match('*', {
    deploy: fis.plugin('http-push', {
        receiver: 'http://10.200.51.175:3000/receiver',
        to: '/node/wxServer/' // 注意这个是指的是测试机器的路径，而非本地机器
    })
});
fis.media('testPre').match('*', {
    deploy: fis.plugin('http-push', {
        receiver: 'http://10.200.51.175:3000/receiver',
        to: '/node/dhyTest/' // 注意这个是指的是测试机器的路径，而非本地机器
    })
});
fis.media('pro').match('*', {
    deploy: fis.plugin('http-push', {
        receiver: 'http://wx.yunhou.com/receiver',
        to: '/home/weixinnode/dhy/' // 注意这个是指的是测试机器的路径，而非本地机器
    })
});
/******************打包阶段插件**********************/

fis.match(Config.src.root + '**.js', {
    optimizer: fis.plugin('uglify-js')
}).match('::packager', {
    packager: fis.plugin('map'),
    spriter: fis.plugin('csssprites'),
    postpackager: fis.plugin('loader', {
        allInOne: {
            includeAsyncs: true,
            css: "./public/pkg/${filepath}_all.css",
            js: "./public/pkg/${filepath}_all.js",
            ignore: [
                Config.src.root + 'static/js/lib/sea.js',
                Config.src.root + 'public/dhy/dhySeaConfig.js',
                Config.src.root + 'static/js/lib/jquery.min.js',
                Config.src.root + 'static/js/extends/ejs.js'
            ]
        },
        processor: {
            '.html': 'html',
            '.ejs': 'html'
        },
        obtainScript:false
    })
});