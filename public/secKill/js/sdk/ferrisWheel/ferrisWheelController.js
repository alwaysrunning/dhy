/**
 * 摩天轮控制器
 * Created by 沐沐 on 2015-04-24.
 */
YunHouSDK.register('sdk.ferrisWheel.controller', function (fire) {
    var fireMan = new fire();
    var sending = false;


    //处理返回结果
    var handleResult = function (result, success, error) {
        if (result.code === '0000') {
            if (typeof success == 'function') {
                success(result);
            }
        } else if (result.code === '9999') {
            var stopWarning = false;//是否阻止弹出信息
            if (typeof error == 'function') {
                stopWarning = error(result) || stopWarning;
            }
            if (!stopWarning) {
                fireMan.fire('showWarning', result.message);
            }
        } else {
            fireMan.fire('showSysWarning', result.message);
            console.warn(result.code + ':' + result.message);
        }
    };

    var sendRequest = function (url, data, headerParams, success, error) {
        if (!sending || !headerParams) {

            sending = true;

            //打印请求地址
            //BBGMobile.log('url:' + url);
            $('#spinner').show();

            if(headerParams){
                if(headerParams['cityId'])data['cityId'] = headerParams['cityId'];
                headerParams['appId'] = '1';

                //打印header参数
                //$.each(headerParams,function(key,value){
                //    BBGMobile.log( 'headerParams:' + key + '-' + value);
                //});
            }
            var setting = {
                url: url,
                data: data,
                complete:function(){
                    //sending = false;
                    $('#spinner').hide();
                },
                success: function (query) {
                    sending = false;
                    handleResult(query, function () {
                        if (typeof success == 'function') {
                            success(query);
                        }
                    }, function (query) {
                        if (typeof error == 'function') {
                            return error(query);
                        }
                    });
                },
                error: function () {
                    sending = false;
                    fireMan.fire('showWarning', '亲，网络堵车了！');
                }
            };

            //打印query参数
            //$.each(data,function(key,value){
            //    BBGMobile.log( 'data:' + key + '-' + value);
            //});

            if(headerParams){
                setting['headers'] = headerParams;
            }
            $.ajax(setting);
        }
    };

    return {
        send: function (url, data, headerParams, success, error) {
            sendRequest(url, data, headerParams, success, error);
        },
        on: function (name, callback) {
            fireMan.on(name, callback);
        }
    }
}, ['sdk.fire']);