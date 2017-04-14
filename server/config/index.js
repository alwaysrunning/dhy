/**
 * Created by ricopter@qq.com on 2016/10/22.
 */
'use strict';
module.exports = {
    dev: function () {
        require('./devConfig')
    },
    pro: function () {
        require('./apiConfigServer')
    },
    test: function () {
        require('./testConfig')
    },
    testPre:function () {
        require('./testPreConfig')
    },
    out:function () {
        require('./outDevConfig')
    }
};