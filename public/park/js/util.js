/**
 * Created by xiemumu on 16/9/13.
 */
//debounce
;(function (global) {
    global._ = global._ || {};

    var now = Date.now || function () {
            return new Date().getTime();
        };

    global._.debounce = function (func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function () {
            var last = now() - timestamp;

            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                }
            }
        };

        return function () {
            context = this;
            args = arguments;
            timestamp = now();
            var callNow = immediate && !timeout;
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }

            return result;
        };
    };
})(window);

//warm
;(function (global) {
    global._ = global._ || {};
    var timer;
    global._.warm = function (text) {
        timer = setTimeout(function () {
            $('.dailog-warm').fadeOut();
            timer = null;
        }, 5000);
        $('.dailog-warm').text(text).fadeIn();
    };
})(window);