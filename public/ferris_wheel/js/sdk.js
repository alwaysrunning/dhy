/**
 * Created by 沐沐 on 2015-03-20.
 * 模块加载注册
 */

if (YunHouSDK) {
} else {
    var YunHouSDK = function () {
        var namespace = {}, sdk = 'sdk';
        namespace[sdk] = {
            tools: {
                isArray: function (mayBeArray) {
                    return toString.apply(mayBeArray) === '[object Array]';
                },
                randomBetween: function (n, m) {
                    var w = m - n;
                    return Math.round(Math.random() * w + n);
                },
                getQuery: function (url) {
                    // spliting the url and query string using question mark
                    var splitUrl = url.split("?");

                    // again spliting the data which will have & symbol
                    var strUrl = (splitUrl.length > 1) ? splitUrl[1].split("&") : 0;

                    var i = 0;
                    var iLen = strUrl.length;

                    var str = '';
                    var obj = {};

                    // iterator to assign key pair values into obj variable
                    for (i = 0; i < iLen; i++) {
                        str = strUrl[i].split("=");
                        obj[str[0]] = str[1];
                    }

                    // returning the value
                    return Array.prototype.sort.call(obj);
                },
                sortObjectByKey: function (obj) {
                    var keys = [];
                    var sorted_obj = {};

                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            keys.push(key);
                        }
                    }

                    // sort keys
                    keys.sort();

                    // create new array based on Sorted Keys
                    jQuery.each(keys, function (i, key) {
                        sorted_obj[key] = obj[key];
                    });

                    return sorted_obj;
                }
            }
        };
        var func = namespace[sdk];
        var getModule = function (module) {
            namespace['modules'] || (namespace['modules'] = {});
            var topModule = namespace['modules'],
                moduleNames = module.split('.'), tempModule = topModule, i = null;
            while (i = moduleNames.shift())
                if (moduleNames.length) {
                    try {
                        tempModule = tempModule[i];
                    } catch (e) {
                        setTimeout(function () {
                            console.warn('在已注册的模块中没有找到名为' + module + '的模块');
                        }, 0);
                        return tempModule;
                    }
                } else {
                    return tempModule[i];
                }
        };

        func.register = function (module, fn, require) {
            var theSdk = this;
            //加载依赖的模块
            var requiredModule = [];
            if (theSdk.tools.isArray(require)) {
                requiredModule = require.map(function (requiredModule) {
                    return getModule(requiredModule);
                });
            }
            //注册模块
            namespace['modules'] || (namespace['modules'] = {});
            var topModule = namespace['modules'],
                moduleNames = module.split('.'), tempModule = topModule, i = null;
            while (i = moduleNames.shift())
                if (moduleNames.length) {
                    tempModule[i] === undefined && (tempModule[i] = {});
                    tempModule = tempModule[i];
                } else if (tempModule[i] === undefined) {
                    try {
                        tempModule[i] = fn.apply(namespace[sdk], requiredModule);
                        return true;
                    }
                    catch (e) {
                        setTimeout(function () {
                            console.log(e)
                        }, 0);
                    }
                }
            return false;
        };

        func.use = function (module, fn) {
            var theSdk = this;
            var requiredModule = [];
            if (typeof module === 'string') {
                module = module.split(',');
            }
            if (theSdk.tools.isArray(module)) {
                requiredModule = module.map(function (moduleName) {
                    return getModule(moduleName);
                });
            }
            try {
                fn.apply(namespace[sdk], requiredModule);
            } catch (e) {
                setTimeout(function () {
                    console.log(e)
                }, 0);
            }
        };

        return func;
    }();
}
