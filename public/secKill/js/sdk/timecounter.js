/**
 * Created by 沐沐 on 2015-09-13.
 */
YunHouSDK.register('sdk.timeCounter', function () {
    return function (serverTime, aimTime) {
        var _serverTime = serverTime;
        var _aimTime = new Date(aimTime.replace(/-/g, '/')).getTime();
        var timeDiff = Date.now() - _serverTime;

        return {
            get: function () {
                var now = Date.now() - timeDiff;
                var timeLeft = parseInt((_aimTime - now) / 1000);
                if (timeLeft >= 0) {
                    var DD = Math.floor(timeLeft / (60 * 60 * 24));
                    var HH = Math.floor((timeLeft - DD * (60 * 60 * 24)) / (60 * 60 ));
                    var MM = Math.floor((timeLeft - DD * (60 * 60 * 24) - HH * (60 * 60)) / 60);
                    var SS = Math.floor(timeLeft - DD * (60 * 60 * 24) - HH * (60 * 60) - MM * 60);

                    return {
                        DD: DD < 10 ? '0' + DD : DD,
                        HH: HH < 10 ? '0' + HH : HH,
                        MM: MM < 10 ? '0' + MM : MM,
                        SS: SS < 10 ? '0' + SS : SS
                    }
                } else {
                    return {
                        DD: '00',
                        HH: '00',
                        MM: '00',
                        SS: '00'
                    }
                }
            }

        }
    };
});