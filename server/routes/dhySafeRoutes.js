/**
 * Created by ricopter@qq.com on 2017/2/21.
 */
'use strict';
var express = require('express');
var Q = require('q');
var router = express.Router();
var AuthWareCtrl=require("../libs/AuthWare");
var QuickFile=require("../libs/QuickFile");
var api = require('api');
var SpringDoctorCtrl=require("../controllers/dhy/springDoctorCtrl");
var UploadMulter =require("../libs/UploadMulter");


//春雨医生
router.get("/doctorConsult",AuthWareCtrl.checkLogin,SpringDoctorCtrl.consult);

router.get("/doctorAsk",AuthWareCtrl.checkLogin,SpringDoctorCtrl.ask);

router.get("/doctorReply",AuthWareCtrl.checkLogin,SpringDoctorCtrl.reply);

router.get("/doctorAssess",AuthWareCtrl.checkLogin,SpringDoctorCtrl.assess);

//春雨医生 api
router.post("/doctorCreateAsk",AuthWareCtrl.authLoginWare,UploadMulter.upload.array('photo', 6),SpringDoctorCtrl.CreateAsk);

router.post("/doctorAddQuestion",AuthWareCtrl.authLoginWare,UploadMulter.upload.array('photo', 6),SpringDoctorCtrl.addQuestion);

router.post("/doctorLookReplayQuestion",AuthWareCtrl.authLoginWare,SpringDoctorCtrl.lookReplayQuestion);

router.post("/doctorCloseQuestion",AuthWareCtrl.authLoginWare,SpringDoctorCtrl.closeQuestion);

router.post("/doctorEvaluateQuestion",AuthWareCtrl.authLoginWare,SpringDoctorCtrl.evaluateQuestion);

router.post("/doctorConsultList",AuthWareCtrl.authLoginWare,SpringDoctorCtrl.consultList);


// router.get('/testUpload',function (req, res, next) {
//   res.render('test/testUpload', {title: 'testUpload', dev: process.env.dev,csrfToken:req.csrfToken()});
// });

module.exports = router;