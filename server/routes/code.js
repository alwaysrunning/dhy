/**
 * Created by 沐沐 on 2015-11-16.
 */

var express = require('express');
var router = express.Router();
var codeGenerator = require('bwip-js');

router.get('/qrcode/:code', function (req, res, next) {
    var code = req.params['code'];

    var scale = req.query['scale'] || 3;
    var version = req.query['version'] || 3;
    var eclevel = req.query['eclevel'] || 'M';
    var codeBuffer = new Buffer(code).toString('binary');

    codeGenerator.toBuffer({
        bcid: 'qrcode',
        text: codeBuffer,
        scale: scale,
        version: version,
        eclevel: eclevel
    }, function (err, image) {
        if (err) {
            next(err);
        } else {
            res.type('png');
            res.send(image);
        }
    });
});

router.get('/barcode/:code', function (req, res, next) {
    var code = req.params['code'];

    var width = req.query['width'] || 5;
    var height = req.query['height'] || 2;
    var scale = req.query['scale'] || 1;

    codeGenerator.toBuffer({
        bcid: 'code128',      // Barcode type
        text: code,   // Text to encode
        scale: scale,              // 3x scaling factor
        height: height,
        width: width,
        includetext: true,           // Show human-readable text
        textxalign: 'center',       // Always good to set this
        textfont: 'Inconsolata',  // Use your custom font
        textyoffset: 4,
        textsize: 12              // Font size, in points
    }, function (err, image) {
        if (err) {
            next(err);
        } else {
            res.type('png');
            res.send(image);
        }
    });
});

module.exports = router;