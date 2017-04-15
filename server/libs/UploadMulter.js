/**
 * Created by ricopter@qq.com on 2017/2/21.
 */
'use strict';
var Q = require('q');
var api = require('api');
//上传配置
var moment = require('moment');
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'server/tmp/uploads');
  },
  filename: function (req, file, cb) {
    var _mimeTypes= file.mimetype.split('/');
    var _num = Math.round(Math.random()*10000 + 1);
    var _fielName=file.fieldname+"_"+ moment().format('YYYYMMDDHHmmss')+"_"+_num+ '.'+_mimeTypes[1];
    cb(null, _fielName);
  }
});
var upload = multer({
  storage: storage ,
  limits:{
    fields:10,
    fieldSize:1024*1024,

    fileSize:5*1024*1024,//2M
    files:6
  },
  fileFilter:function (req, file, cb) {
    var mimeTypes = ['image/jpg', 'image/jpeg', 'image/png','image/gif'];
    if(mimeTypes.indexOf(file.mimetype)>= 0){
      cb(null, true);
    }else{
      cb(new api.error.ApiError('9997', '上传文件类型不支持!'));
    }
  }
});

module.exports.upload=upload;