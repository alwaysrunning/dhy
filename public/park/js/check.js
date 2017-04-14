/**
 * Created by 沐沐 on 2016-01-11.
 */
var checker = {
    store: new App.store(),
    check: function () {
        var self = this;
        var deferred = $.Deferred();
        $.post('/api/check', {
            url: encodeURIComponent(window.location.href)
        }).then(function (res) {
            if (res.code === "9999") {
                window.location.href = res.redirectUrl;
            } else if (res.code === '200010002') {
                self.store.set("LoginBool", false);
                deferred.reject({
                    msg: '您还没有登录',
                    code: res.code
                });
            } else {
                self.store.set("LoginBool", res.code == "0000");
                deferred.resolve();
            }
        });
        return deferred.promise();
    }
};