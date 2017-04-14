/**
 * Created by 沐沐 on 2015-09-13.
 */
YunHouSDK.register('sdk.kill.tabs', function (fireman) {
    return function (serverTime, template, times) {
        var event = new fireman();
        var templates = Handlebars.compile(template);
        var timeDiff = Date.now() - serverTime;
        var active = 0;

        var timePoints = $.isArray(times) ? times : [];
        var tabs = null;
        var states = {};
        var data = [];

        var timeFormat = function(timeString){
            return timeString.replace(/-/g, '/');
        };
        var getData = function (firest) {
            return $.isArray(timePoints) ? timePoints.map(function (e, i) {
                e = timeFormat(e);
                //alert(Date.now());
                var time = new Date(e);
                var nextTime = i < timePoints.length - 1 ? new Date(timeFormat(timePoints[i + 1])).getTime() : (new Date('2015/09/30 23:59:59')).getTime();
                var now = Date.now() - timeDiff;
                var day = time.getDate();
                var month= time.getMonth()+1;
                var hours = time.getHours();
                var minutes = time.getMinutes();
                hours = parseInt(hours) < 10 ? "0" + hours : hours;
                minutes = parseInt(minutes) < 10 ? "0" + minutes : minutes;

                if (now < time.getTime()) {
                    states[i] = {
                        state:'before',
                        text:'即将开始'
                    };
                } else if (now >= time.getTime() && now < nextTime) {
                    states[i] = {
                        state:'in',
                        text:'进行中'
                    };
                    active = firest ? i : active;
                } else if (now >= nextTime) {
                    states[i] = {
                        state:'pass',
                        text:'已开抢'
                    };
                }

                return {
                    time: month + "月" +  day+ "日" + hours + ':' + minutes,
                    state: states[i]
                }
            }) : [];
        };

        var switchTo = function (index) {
            if (tabs) {
                tabs.removeClass('active');
                tabs.eq(index).addClass('active');
                active = index;
                event.fire('switch', active);
            }
        };
        return {
            render: function (container) {
                if ($.isArray(timePoints) && timePoints.length > 0) {
                    data = getData(true);
                    console.log(data);
                    tabs = $(templates(data)).filter('.tab');
                    tabs.on('touchend', function () {
                        switchTo($(this).index());
                    });
                    switchTo(active);
                    $(container).html(tabs);
                    event.fire('render',data);
                    return this;
                }
            },
            update: function () {
                var perData = getData();
                var isChange = false;
                $(data).each(function (i, e) {
                    if (perData[i] && perData[i].state.state != e.state.state) {
                        tabs.eq(i).find('.state').html(perData[i].state.text);
                        isChange = true;
                        event.fire('stateChange',i,perData[i], e.state);
                    }
                });
                if (isChange) {
                    data = perData;
                }
                return this;
            },
            getState:function(index){
                return states[index];
            },
            getActive: function () {
                return active;
            },
            on: function (eventName, callback) {
                event.on(eventName, callback);
                return this;
            }
        }
    };
}, ['sdk.fire']);