/**
 * Created by 沐沐 on 2015-09-09.
 */
YunHouSDK.register('sdk.util', function () {
    var tool = {
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
        queryString: function (a) {
            var s = [], add = function (key, value) {
                value = typeof value === 'function' ? null : ( value == null ? "" : value );
                if(value){
                    s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
                }
            };
            if (typeof a === 'object' && !tool.isArray(a)) {
                Object.keys(a).map(function (key) {
                    add(key, a[key]);
                });
            }
            return s.join("&").replace('r20', "+");
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
    };
    return tool;
});