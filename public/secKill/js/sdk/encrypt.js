/**
 * 测试用加密器
 * Created by 沐沐 on 2015-04-23.
 */
YunHouSDK.register('sdk.encrypt', function (util) {
    var sdk = this;
    var getParams = function (params) {
        var paramsString = '';
        $.each(params, function (key, value) {
            paramsString += key + value;
        });

        return paramsString;
    };
    return {
        encrypt: function (params, secret, timestamp) {
            var paramsString = getParams(util.sortObjectByKey(params));
            console.log('params:' + paramsString);
            return md5(secret + timestamp + md5(paramsString) + secret);
        }
    };
}, ['sdk.util']);