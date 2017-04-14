/**
 * Created by Ray on 2016/2/2.
 */

var q = require('q');
var api = require('api');
module.exports.init = function (req, res, next) {
    var code = req.query['code'];
    var render = function(data){
        var fans=function(grade){
            var list=[
                '步步高小粉丝',
                '商品捕猎者',
                '采购小能手',
                '剁手大侠',
                '酷炫购物狂',
                '称霸天下的无敌买手'
            ];
            return list.indexOf(grade)+1;
        };
        if(data){
            data.regTime = data.regTime.split(" ")[0];
            data.saleTotalGrade=fans(data.saleTotalGrade);
        }
        res.render('activity/2016/memberData/index', {
            title:'这一年,我在步步高的幸福指数',
            data:data
        });
    };
    if (code) {
        q.all([
            api.weixin.access_token(),
            api.weixin.open_id(code)
        ]).spread(function (access, openid) {
            return api.weixin.user_info(access.access_token, openid.openid);
        }).then(function (data) {
            return api.user.totalAccount(data.unionid);
        }).then(function (data) {
            if(data.data){
                render(data.data);
            }else{
                render(null);
            }

        }).fail(function (err) {
            if(err.code === '200010002'){
                res.redirect('/#/login?fromUrl='+ encodeURIComponent(api.weixin.getOpenUrl('/activity/memberData2016')));
            }else if(err.type === 'wechat' && err.code === 40029){
                res.redirect(api.weixin.refresh(req));
            }else {
                render(null);
            }
            console.error(err);
        });
    } else {
        res.redirect(api.weixin.refresh(req));
    }

};