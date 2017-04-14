/**
 * Created by 沐沐 on 2015-12-01.
 */
var api = require('api');
var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
    res.render('ferriswheel');
});

module.exports = router;