/**
 * Created by ricopter@qq.com on 2017/2/21.
 * 春雨医生控制器
 */
'use strict';
var api = require('api');
var q = require('q');
var QuickFile=require("../../libs/QuickFile");
/**
 * 我的咨询列表
 * @param req
 * @param res
 * @param next
 */
module.exports.consult=function (req, res, next) {
  var openid = req.cookies['openid'];
  var unionid = req.cookies['unionid'];
  var channel = req.query["channel"]||req.cookies['channel']||'V0115';

  var page=req.query["page"]||1,
    pageSize=req.query["pageSize"]||15,
    status=req.query["status"]||undefined;

  api.thirdParty.springDoctorQueryQuestionList(unionid,page,pageSize,status).then(function (data) {

    res.render('dhy/doctor/consult', {title: '在线医生',csrfToken:req.csrfToken(),data:data,status:status,channel:channel});
  }).fail(function (err) {
    next(err);
  });
};

/**
 * 我要提问
 * @param req
 * @param res
 * @param next
 */
module.exports.ask=function (req, res, next) {
  var channel = req.query["channel"]||req.cookies['channel']||'V0115';

  res.render('dhy/doctor/ask', {title: '我要提问',csrfToken:req.csrfToken(),channel:channel});
};

/**
 * 问题详情
 * @param req
 * @param res
 * @param next
 */
module.exports.reply=function (req, res, next) {
  var openid = req.cookies['openid'];
  var unionid = req.cookies['unionid'];
  var questionID = req.query["id"];
  var questStatus= req.query["questStatus"];
  var evaluation= req.query["evaluation"]||"";
  var channel = req.query["channel"]||req.cookies['channel']||'V0115';

  if(questionID){
    api.thirdParty.springDoctorReplyQuestion(unionid,questionID).then(function () {
     return api.thirdParty.springDoctorQueryQuestionRecord(unionid,questionID)
    })
    .then(function(rData){

      res.render('dhy/doctor/reply', {
        title: '问题详情',
        questionID:questionID,
        recordData:rData.data,
        questStatus:questStatus||rData.data.status,
        evaluation:evaluation,
        csrfToken:req.csrfToken(),
        channel:channel
      });

    }).fail(function(err){
      next(err);
    });
  }else{
    next(new api.error.ApiError('999', '缺少问题详情参数'));
  }
};

/**
 * 评价问题
 * @param req
 * @param res
 * @param next
 */
module.exports.assess=function (req, res, next) {
  var openid = req.cookies['openid'];
  var unionid = req.cookies['unionid'];
  var questionID = req.query["id"];
  var channel = req.query["channel"]||req.cookies['channel']||'V0115';

  if(questionID){

    api.thirdParty.springDoctorQueryQuestionRecord(unionid,questionID).then(function(data){

      res.render('dhy/doctor/assess', {
        title: '医生评价',
        id:questionID,
        recordData:data.data,
        csrfToken:req.csrfToken(),
        channel:channel
      });

    }).fail(function(err){
      next(err);
    });
  }else{
    next(new api.error.ApiError('999', '缺少评价问题参数'));
  }
};

/**
 * api 创建问题
 * @param req
 * @param res
 * @param next
 * @constructor
 */
module.exports.CreateAsk=function (req, res, next) {
  var openid = req.cookies['openid'];
  var unionid = req.cookies['unionid'];
  var contentText = req.body["contentText"];
  var sex = req.body["sex"];
  var birthday = req.body["birthday"];

  if(!contentText || !sex || !birthday){
    res.status(999);
    res.json(new api.error.NodeApiError('999', '内容不能为空!'));
    return
  }

  if(req.files.length>0){
    var _photoArr=[];
    var _photoPathArr=[];
    var _receivePhotoArr=[];//返回上传后的图片路径
    var _questResId="";

    req.files.forEach(function (item) {
      _photoPathArr.push(item.path);
      _photoArr.push({
        file:item.path,
        content_type:item.mimetype
      });
    });

    console.log("==_photoArr==",_photoArr);

    //上传多张图片photo:_photoArr
    api.thirdParty.springDoctorFileUpLoad(unionid,"image",{
      file:_photoArr
    }).then(function (data) {
      console.log("====",data);
      _receivePhotoArr=data.data;
      //删除本地缓存
      QuickFile.removeArr(_photoPathArr);
      //创建问题
      return api.thirdParty.springDoctorCreateQuestion(unionid,"text",contentText,sex,birthday)
    }).then(function (questRes) {
      console.log("==创建问题==",questRes);
      _questResId=questRes.data;
      //追加图片
      if(_photoPathArr.length>0){
        console.log("==追加图片图片==",_photoPathArr);
        return _receivePhotoArr.forEach(function (item) {
          api.thirdParty.springDoctorAskingQuestion(unionid,_questResId,"IMG",item.file).fail(function (err) {
            console.error("==追加图片图片err==",err);
            next(err);
          });
        });
      }
    }).then(function () {
      res.json({
        data:_questResId,
        code:"0000"
      });
    }).fail(function (err) {
      console.error("==err==",err);
      //删除本地缓存
      QuickFile.removeArr(_photoPathArr);
      next(err);
    });

  }else{
    //创建问题
    return api.thirdParty.springDoctorCreateQuestion(unionid,"image",contentText,sex,birthday).then(function (questRes) {
      res.json(questRes);
    }).fail(function (err) {
      next(err);
    });
  }

};

/**
 * api 追加问题
 * @param req
 * @param res
 * @param next
 */
module.exports.addQuestion=function (req, res, next) {
  var openid = req.cookies['openid'];
  var unionid = req.cookies['unionid'];
  var questionID = req.body["questionID"];
  var contentText = req.body["contentText"]||"IMG";

  if(questionID){
    if(req.files.length>0){

      var _photoArr=[];
      var _photoPathArr=[];
      var _receivePhotoArr=[];//返回上传后的图片路径
      req.files.forEach(function (item) {
        _photoPathArr.push(item.path);
        _photoArr.push({
          file:item.path,
          content_type:item.mimetype
        });
      });
      console.log("==聊天上传图片==",_photoArr);

      //发送聊天图片  photo:_photoArr
      api.thirdParty.springDoctorFileUpLoad(unionid,"image",{
        file:_photoArr
      }).then(function (data) {
        _receivePhotoArr=data.data;
        console.log(_receivePhotoArr,"==追加图片图片==",_photoPathArr);
        //追加图片
        if(_photoPathArr.length>0){

          _receivePhotoArr.forEach(function (item) {

            api.thirdParty.springDoctorAskingQuestion(unionid,questionID,"IMG",item.file).then(function (qData) {

            }).fail(function(err){
              next(err);
            });

          });

          res.json(data);
        }else{
          res.json(data);
        }

      }).fail(function (err) {
        next(err);
      });

    }else{

      api.thirdParty.springDoctorAskingQuestion(unionid,questionID,contentText).then(function (data) {
        res.json(data);
      }).fail(function(err){
        next(err);
      });

    }
  }else{
    next(new api.error.ApiError('999', '缺少追加问题参数'));
  }
};

/**
 * api 查询回复
 * @param req
 * @param res
 * @param next
 */
module.exports.lookReplayQuestion=function (req, res, next) {
  var openid = req.cookies['openid'];
  var unionid = req.cookies['unionid'];
  var questionID = req.body["questionID"];

  if(questionID){
    api.thirdParty.springDoctorReplyQuestion(unionid,questionID).then(function (data) {
      res.json(data);
    }).fail(function(err){
      next(err);
    });
  }else{
    next(new api.error.ApiError('999', '缺少追加问题参数'));
  }
};

/**
 * api 关闭问题
 * @param req
 * @param res
 * @param next
 */
module.exports.closeQuestion=function (req, res, next) {
  var openid = req.cookies['openid'];
  var unionid = req.cookies['unionid'];
  var questionID = req.body["questionID"];
  var closeReason = req.body["closeReason"]||"用户关闭问题";
  if(questionID){
    api.thirdParty.springDoctorCloseQuestion(unionid,questionID,closeReason).then(function (data) {
      res.json(data);
    }).fail(function(err){
      next(err);
    });
  }else{
    next(new api.error.ApiError('999', '缺少追加问题参数'));
  }
};

/**
 * api 评价问题
 * @param req
 * @param res
 * @param next
 */
module.exports.evaluateQuestion=function (req, res, next) {
  var openid = req.cookies['openid'];
  var unionid = req.cookies['unionid'];
  var questionID = req.body["questionID"];
  var evaluation = req.body["evaluation"];
  var content = req.body["content"]||undefined;

  if(questionID && evaluation){
    api.thirdParty.springDoctorEvaluateQuestion(unionid,questionID,evaluation,content).then(function (data) {
      res.json(data);
    }).fail(function(err){
      next(err);
    });
  }else{
    next(new api.error.ApiError('999', '缺少追加问题参数'));
  }
};


/**
 * api 我的咨询列表
 * @param req
 * @param res
 * @param next
 */
module.exports.consultList=function (req, res, next) {
  var openid = req.cookies['openid'];
  var unionid = req.cookies['unionid'];
  var page=req.body["page"]||1,
    pageSize=req.body["pageSize"]||15,
    status=req.body["status"]||undefined;

  api.thirdParty.springDoctorQueryQuestionList(unionid,page,pageSize,status).then(function (data) {
    res.json(data);
  }).fail(function (err) {
    next(err);
  });
};
