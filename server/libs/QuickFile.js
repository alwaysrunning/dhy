/**
 * Created by ricopter@qq.com on 2017/2/21.
 */
'use strict';
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var Q = require('q');

var removeFile=function (fileUrl) {
  var deferred = Q.defer();
  var _fileUrl=path.normalize(fileUrl);
  fse.remove(_fileUrl, function (err) {
    if (err) return deferred.reject(err);
    deferred.resolve({code:"000",msg:"ok",data:fileUrl});
  });
  return deferred.promise;
};

module.exports.ensureFile=function (fileUrl) {
  var deferred = Q.defer();
  var _fileUrl=path.normalize(fileUrl);
  fse.ensureFile(_fileUrl, function (err) {
    if (err) return deferred.reject(err);
    deferred.resolve({code:"000",msg:"ok",data:fileUrl});
  });
  return deferred.promise;
};

module.exports.remove=removeFile;

module.exports.removeArr=function (fileArr) {
  var deferred = Q.defer();
  fileArr.forEach(function (item) {
     return removeFile(item).then(function () {
       deferred.resolve({code:"000",msg:"remove file Arr ok",data:item});
     }).fail(function (err) {
       deferred.reject(err);
     });
  });
  return deferred.promise;
};