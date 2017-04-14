/**
 * Created by 沐沐 on 2015-09-13.
 */
YunHouSDK.register('sdk.kill.counter', function (timeCounter, fireMan) {
    var timeArray = [];
    var event = new fireMan();
    return {
        init: function (serverTime, times) {
            if ($.isArray(times)) {
                timeArray = [];
                for (var i = 0; i < times.length; i++) {
                    timeArray.push(new timeCounter(serverTime, times[i]));
                }
            }
            return this;
        },
        render: function (num, dd,hh, mm, ss) {
            var time = timeArray[num] && timeArray[num].get();
            if (time && !time.pass) {
                $(dd).html(time.DD);
                $(hh).html(time.HH);
                $(mm).html(time.MM);
                $(ss).html(time.SS);
            }

            event.fire('render', num, time);
            return this;
        },
        onRender: function (callback) {
            event.on('render', callback);
            return this;
        }
    };
}, ['sdk.timeCounter', 'sdk.fire']);