/**
 * Created by 沐沐 on 2016-01-27.
 */
'use strict';
define(function (require, exports, module) {
    module.exports=function () {
        if(!App.pageAuth()){
            return false;
        }
        var _this = this;
        var currentPage = 1;
        var size = 15;
        var scroll = null;
        var pullUpFlag = false;
        var loading = false;
        var end = false;
        var templateListItem = new EJS({
            url: '/views/dhy/myInvitationListItem.ejs'
        });

        var loader = function (page, callback, first) {
            loading = true;
            App.getJSON('invitation/list?page=' + page + '&pagesize=' + size, function (res) {
                if (first) {
                    App.render({
                        url: _this.RouterTmpUrl,
                        data: {
                            title: _this.RouterTitle,
                            data: res.data,
                            total: res.total
                        },
                        _this: _this
                    });
                }
                currentPage++;
                if (res.total <= currentPage * size) {
                    end = true;
                    if(res.total > 0){
                        $('#wapper').append('<div class="tip">亲！已经看到最后了！</div>');
                    }
                }

                loading = false;
                pullUpFlag = false;
                $('#pullUpFlag').hide();


                if (callback) {
                    callback(res);
                }
            });
        };

        var renderList = function (res) {
            var html = templateListItem.render(res);
            $('#invitation-list').append(html);

            if(scroll){
                scroll.refresh();
            }
        };

        var positionJudge = function () {
            if (!loading && !end) {
                if (this.y < (this.maxScrollY - 40)) {   //判断上拉
                    $('#pullUpFlag').show();
                    pullUpFlag = true;
                }
            }
        };

        var action = function () {
            if (pullUpFlag && !loading && !end) {
                loader(currentPage + 1, function (res) {
                    renderList(res);
                });
            }
        };

        var initScroll = function (res) {
            scroll = new IScroll($('#invitation-refresh').get(0), {
                probeType: 3,
                useTransform: true,
                tap: true,
                click: true,
                mouseWheel: false,
                fadeScrollbars: false
                //preventDefault: false,
                //preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/ },
                //startY:me.startY
            });

            scroll.on('scroll', positionJudge);
            scroll.on('scrollEnd', action);
        };

        loader(currentPage, function (res) {
            initScroll(res);
            renderList(res);
        }, true);
    };
});
