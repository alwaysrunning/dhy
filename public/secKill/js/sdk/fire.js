/**
 * Created by 沐沐 on 2015-03-20.
 * 事件调用器
 */

YunHouSDK.register('sdk.fire', function () {
    return function () {
        var events = {};
        return {
            fire: function (eventName) {
                var preEvents = events[eventName];
                var results = [];
                var args = Array.prototype.slice.call(arguments, 1);
                if (!preEvents) {
                    return results;
                }
                if($.isArray(preEvents)){
                    for (var i = 0, len = preEvents.length; i < len; i++) {
                        results.push(preEvents[i].apply(null, args));
                    }
                }else if(typeof preEvents === 'function'){
                    results.push( preEvents.apply(null, args));
                }
                return results;
            },
            on: function (eventName, callback, replace) {
                if (replace) {
                    events[eventName] = callback;
                } else {
                    events[eventName] = events[eventName] || [];
                    events[eventName].push(callback);
                }
                return this;
            },
            withEvent: function (dothings) {
                if (typeof dothings == 'function') {
                    dothings(events);
                }
            }
        };
    };
});