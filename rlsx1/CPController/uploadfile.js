var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var helper = require('../UtilityLib/BlobHelper');
var multer = require('multer');
var upload = multer({ dest: '../Uploads/' });


var cpUpload = upload.fields([{ name: 'SRODocs', maxCount: 1 }, { name: 'SNScan', maxCount: 1 }])
router.post('/uploadFileWithBase64', cpUpload, function (req, res) {

    helper.uploadFileWithBase64('sro-files', "", req.body.ImageString, function (error1, result1) {
        if (!error1) {

            var output = { result: 'Success', FileName: result1.FileName, FileUrl: result1.FileURL, SystemGenName: result1.FileURL.substring(result1.FileURL.lastIndexOf('/')) };
            res.send(JSON.stringify(output));
        }
        else {
            res.send({ error: err });
        }
    });

});

module.exports = router;