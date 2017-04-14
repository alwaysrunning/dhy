/**
 * Created with WebStorm.
 * User: rico ricopter@qq.com
 * Date: 2015/11/4
 * Time: 16:12
 * 我的会员卡
 * */
'use strict';
define(function (require, exports, module) {
    module.exports= function () {
        if(!App.pageAuth()){
            return false;
        }
        var _this = this;
        var channel = App.getParam('channel');
        var queryUrl='account/mycard';
        var muYin=false;
        if(channel && channel=="V0115"){
            queryUrl='account/myBabyCards';
            muYin=true;
        }
        App.getJSON(queryUrl, function (res) {
            var _moblie = App.component.storageGet("localMobile").val;
            App.render({
                url: _this.RouterTmpUrl,
                data: {
                    title: _this.RouterTitle,
                    tier: res.member.grade,
                    code: res.cards.cardNo,
                    invitation:res.invitation,
                    moblie: _moblie,
                    muYin:muYin
                },
                _this: _this
            });
        });
    };
});
