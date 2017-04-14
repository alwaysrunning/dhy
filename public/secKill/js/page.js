/**
 * Created by 沐沐 on 2015-09-14.
 */
YunHouSDK.register('sdk.kill.page', function (fire, listLoader, util) {
    return function (template, times) {
        Handlebars.registerHelper('Math', function (exp, option) {
            var template = Handlebars.compile(exp);
            return eval(template(this));
        });
        var templates = Handlebars.compile(template);
        var event = new fire();
        Handlebars.registerHelper("cutString",function (str, len) {
            if(!str){
               return ""
            }
            //length属性读出来的汉字长度为1
            if(str.length*2 <= len) {
                return str;
            }
            var strlen = 0;
            var s = "";
            for(var i = 0;i < str.length; i++) {
                s = s + str.charAt(i);
                if (str.charCodeAt(i) > 128) {
                    strlen = strlen + 2;
                    if(strlen >= len){
                        return s.substring(0,s.length-1) + "...";
                    }
                } else {
                    strlen = strlen + 1;
                    if(strlen >= len){
                        return s.substring(0,s.length-2) + "...";
                    }
                }
            }
            return s;
        });
        Handlebars.registerHelper("isCutString",function (str,len,options) {
            if(str.length*2<=len){
                return options.fn(this);
            }else{
                return options.inverse(this);
            }
        });
        var active = 0;
        var timePoints = $.isArray(times) ? times : [];
        var list = {};

        if ($.isArray(times)) {
            $(times).each(function (i, e) {
                var index = i;
                list[index] = new listLoader('#lists').on('beforeAdd', function (page, pageSize, isEnd) {
                    if (!isEnd) {
                        getData(index, timePoints[index], page, pageSize);
                    }
                });
            })
        }

        var getData = function (index, time, page, pageSize) {
            var params = util.getQuery(window.location.href);
            var activityCode = params['active'];
            //localStorage.removeItem("city");
            //获取当前地理位置
            var localStorageCity=JSON.parse(localStorage.getItem("city"));
            if(!localStorageCity){
                location.href="/#/locationList?fromUrl="+encodeURIComponent(location.hash ? location.hash : location.href);
                return false;
            }
            var cityId = params['cityId'] || localStorageCity.id;
            return $.ajax({
                url: '/secKill/gift/' + activityCode,
                dataType: 'json',
                data: {
                    time: time,
                    page: page,
                    pageSize: pageSize,
                    cityId: cityId
                },
                success: function (data) {
                    var el = $(templates(data.data));
                    list[index].render(page, el, data.total <= data.page * data.pagesize);
                    scroll.refresh();
                    event.fire('data', index, el);
                },
                error: function () {
                    scroll.refresh();
                }
            });
        };

        var scroll = new iScroll('wrapper', {
            hScrollbar: false,
            vScrollbar: false,
            onScrollMove: function () {
                list[active] && list[active].moreState(this.y, this.maxScrollY);
                event.fire('onScrollMove', this.y, this.maxScrollY);
            },
            onScrollEnd: function () {
                list[active] && list[active].addMore();
            }
        });

        return {
            show: function (index) {
                if (list[index]) {
                    active = index;
                    list[index].show();
                    scroll.refresh();
                    event.fire('show');
                }
                return this;
            },
            on: function (name, cb) {
                event.on(name, cb);
                return this;
            }
        }
    }
}, ['sdk.fire', 'sdk.listLoader', 'sdk.util']);