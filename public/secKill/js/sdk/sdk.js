/**
 * Created by 沐沐 on 2015-03-20.
 * 模块加载注册
 */

if (YunHouSDK) {
} else {
    var YunHouSDK = function () {
        var namespace = {}, sdk = 'sdk';
        namespace[sdk] = {};
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
            if ($.isArray(require)) {
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
            if ($.isArray(module)) {
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
