/**
 * Created by 沐沐 on 2015-09-15.
 */
YunHouSDK.register('sdk.listLoader', function (fire) {
    return function (container, opt) {
        var defaultOpt = $.extend({
            boxCls: 'list-box',
            listCls: 'list',
            moreCls: 'more',
            pageSize: 8
        }, opt);
        var content = $('<div></div>').addClass(defaultOpt.boxCls);
        var list = $('<div></div>').addClass(defaultOpt.listCls);
        var more = $('<div></div>').addClass(defaultOpt.moreCls);
        content.append(list).append(more);

        var page = 0;
        var isEnd = false;
        var loaded = false;
        var event = new fire();


        $(container).append(content);
        return {
            show: function () {
                $(container).find('.' + defaultOpt.boxCls).hide();
                content.show();
                if (!loaded) {
                    this.addMore();
                }
            },
            moreState: function (y, maxY) {
                if (!isEnd) {
                    var moreHeight = more.height();
                    if (y < (maxY - moreHeight) && !more.hasClass('flip')) {
                        more.addClass('flip').html('释放加载更多');
                    } else if (y > (maxY - moreHeight) && more.hasClass('flip')) {
                        more.removeClass('flip').html('拖拽加载更多');
                    }
                }
            },
            addMore: function () {
                if (!isEnd) {
                    if (!loaded || more.hasClass('flip') && !list.hasClass('loading')) {
                        list.addClass('loading');
                        more.removeClass('flip').html('加载中');
                        event.fire('beforeAdd', page + 1, defaultOpt.pageSize, isEnd);
                    }
                }
            },
            render: function (index, html, end) {
                page = index;
                isEnd = end;
                list.append(html);
                loaded = true;
                if (isEnd) {
                    more.removeClass('flip').html('没有更多了');
                } else {
                    more.removeClass('flip').html('拖拽加载更多');
                }
                list.removeClass('loading');
                return this;
            },
            on: function (name, cb) {
                event.on(name, cb);
                return this;
            }
        };
    };
}, ['sdk.fire']);