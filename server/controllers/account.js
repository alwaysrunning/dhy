/**
 * Created by 沐沐 on 2015-10-22.
 */

var api = require('api');
var q = require('q');
var _cipherKey = undefined;

//个人中心数据
module.exports.center = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];
    api.user.center(unionid, openid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

module.exports.cards = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    api.user.myCard(unionid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//账户数据
module.exports.accountInfo = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var openid = req.cookies['openid'];
    q.all([
        api.user.meberInfo(unionid),
        api.weixin.access_token().then(function (accessToken) {
            return api.weixin.user_info(accessToken.access_token, openid);
        })
    ]).spread(function (meber, weixin) {
        res.json({
            meber: meber.data,
            weixin: weixin
        });
    }).fail(function (err) {
        next(err);
    });

};

//
module.exports.card = function (req, res, next) {
    var unionid = req.cookies['unionid'];

    api.user.cards(unionid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

module.exports.myBabyCards = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    api.user.myBabyCards(unionid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

module.exports.user_account = function (req, res, next) {
    var unionid = req.cookies['unionid'];

    api.user.user_account(unionid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//收货地址
module.exports.address = function (req, res, next) {
    var unionid = req.cookies['unionid'];

    api.account.address(unionid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//积分
module.exports.integration = function (req, res, next) {
    var unionid = req.cookies['unionid'];

    api.user.integration(unionid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//积分列表
module.exports.integrationList = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var page = req.query['page'];
    var pageSize = req.query['pagesize'];

    api.user.integrationList(unionid, page, pageSize).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};
//积分规则
module.exports.integrationLicenses = function (req, res, next) {
    api.login.licenses().then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};
//积分转红包
module.exports.transferIntegration = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var int = req.query['int'];

    api.user.transferIntegration(unionid, int).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err)
    })
};

//红包
module.exports.reward = function (req, res, next) {
    var unionid = req.cookies['unionid'];

    api.user.reward(unionid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//红包列表
module.exports.rewardList = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var type = req.query['type'];
    var page = req.query['page'];
    var pageSize = req.query['pagesize'];

    api.user.rewardList(unionid, type, page, pageSize, '0').then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//按类型查询红包列表
module.exports.rewardListByType = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var type = req.query['type'];
    var page = req.query['page'];
    var pageSize = req.query['pagesize'];

    api.user.rewardListByType(unionid, type, page, pageSize, '0').then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//券码转红包
module.exports.hongbao = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var code = req.query['code'];

    api.user.hongbaoExchange(unionid, code).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

var base64toBuffer = function (base64) {
    var base64Buffer = null;
    if (base64) {
        base64 = base64.split(",")[1];
        if (base64) {
            base64Buffer = new Buffer(base64, 'base64');
        }
    }
    return base64Buffer;
};

//手机号码申述
module.exports.userAppealPhone = function (req, res, next) {
    var origPhone, newPhone, identificationNum, image1, image2, filename1, filename2, smscode;
    origPhone = req.body['origPhone'];
    newPhone = req.body['newPhone'];
    identificationNum = req.body['identificationNum'];

    //filename1 = req.body['filename1'];
    //image1 = {
    //    buffer: base64toBuffer(req.body['image1']),
    //    filename: filename1,
    //    content_type: req.body['content1']
    //};
    //filename2 = req.body['filename2'];
    //image2 = {
    //    buffer: base64toBuffer(req.body['image2']),
    //    filename: filename2,
    //    content_type: req.body['content2']
    //};

    smscode = req.body['smscode'];

    api.account.userAppealPhone(origPhone, newPhone, identificationNum, undefined, undefined, undefined, undefined, smscode).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

module.exports.userAppealPayPass = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var payPwd, cipherKey, identificationNum, image1, image2, image3, filename1, filename2, filename3, smscode;
    payPwd = req.body['payPwd'];
    identificationNum = req.body['identificationNum'];

    //filename1 = req.body['filename1'];
    //image1 = {
    //    buffer: base64toBuffer(req.body['image1']),
    //    filename: filename1,
    //    content_type: req.body['content1']
    //};
    //
    //filename2 = req.body['filename2'];
    //image2 = {
    //    buffer: base64toBuffer(req.body['image2']),
    //    filename: filename2,
    //    content_type: req.body['content2']
    //};
    //
    //filename3 = req.body['filename3'];
    //image3 = {
    //    buffer: base64toBuffer(req.body['image3']),
    //    filename: filename3,
    //    content_type: req.body['content3']
    //};

    cipherKey = _cipherKey;
    smscode = req.body['smscode'];


    api.account.userAppealPayPass(unionid, payPwd, cipherKey, identificationNum, undefined, undefined, undefined, undefined, undefined, undefined, smscode).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//查询是否申述支付密码
module.exports.userAppealPayPassStatus = function (req, res, next) {
    var unionid = req.cookies['unionid'];

    api.account.userAppealPayPassStatus(unionid).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//重置手机号码
module.exports.updateMobile = function (req, res, next) {
    var mobile = req.query['mobile'];
    var captcha = req.query['captcha'];
    var captchaOld = req.query['captchaOld'];
    var unionid = req.cookies['unionid'];

    if (mobile && captcha && captchaOld) {
        api.account.updateMobile(unionid, captcha, captchaOld, mobile).then(function (data) {
            res.json(data);
        }).fail(function (err) {
            next(err);
        });
    } else {
        next(new api.error.ApiError('9001', '缺少参数'));
    }
};

/**
 * 设置支付密码
 */
module.exports.setPayPass = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var payPass = req.body['paypass'];
    var mobile = req.body['mobile'];
    var captcha = req.body['captcha'];
    var cipherKey = _cipherKey;

    api.account.smsVerify(captcha, mobile, 'update_pay_password').then(function () {
        return api.account.setPayPass(unionid, cipherKey, payPass);
    }).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

/**
 * 更新支付密码
 */
module.exports.updatePayPass = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var payPass = req.body['paypass'];
    var oriPayPass = req.body['oripaypass'];
    var captcha = req.body['captcha'];
    var phone = req.body['phone'];
    var cipherKey = _cipherKey;
    var orCipherKey = _cipherKey;

    api.account.updatePayPass(unionid, cipherKey, orCipherKey, payPass, oriPayPass, captcha, phone).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//短信验证码验证 类型可为：login|warning|pay|mobile|update_mobile|update_pay_password|update_mobile_complaint
module.exports.verifySms = function (req, res, next) {
    var mobile = req.query['mobile'];
    var captcha = req.query['captcha'];
    var type = req.query['type'];

    if (mobile && captcha && type) {
        api.account.smsVerify(captcha, mobile, type).then(function (data) {
            res.json(data);
        }).fail(function (err) {
            next(err);
        });
    } else {
        next(new api.error.ApiError('9001', '缺少参数'));
    }
};

//短信验证码
// 类型可为：
// login【登录】|
// warning【警告】|
// pay【支付】|
// mobile|
// update_mobile【重置手机号】|
// update_pay_password【重置支付密码】|
// update_mobile_complaint【重置手机号码申述】|
// update_paypass_complaint【重置支付密码申述】
module.exports.sms = function (req, res, next) {
    var mobile = req.query['mobile'];
    var type = req.query['type'];
    if (mobile && type) {
        api.account.sms(mobile, type).then(function (data) {
            res.json(data);
        }).fail(function (err) {
            next(err);
        });
    } else {
        next(new api.error.ApiError('9001', '缺少参数'));
    }
};

//完善个人信息
module.exports.sync = function (req, res, next) {
    var unionid = req.cookies['unionid'];
    var mobile = req.body['mobile'];
    var memberName = req.body['name'];
    var idNo = req.body['id'];

    api.user.sync(unionid, mobile, idNo, memberName).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//扫码后增加积分接口
module.exports.pointIncrease = function(req,res,next){
    var unionid = req.cookies['unionid'];
    var cardNo = req.query['cardno'];

    api.account.pointIncrease(unionid,cardNo).then(function (data) {
        res.json(data);
    }).fail(function (err) {
        next(err);
    });
};

//支付签名加密url
module.exports.paySignParam = function(req,res,next){
    var unionid = req.cookies['unionid'];
    var cardNo = req.query['cardno'];

    api.paySign.getUrlSignParam(unionid).then(function (data) {
        res.json({
            data:{
                paySignParam:data
            }
        });
    }).fail(function (err) {
        next(err);
    });
};
