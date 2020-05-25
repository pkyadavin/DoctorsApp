var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var helper = require('../UtilityLib/BlobHelper');
var multer = require('multer');
var upload = multer({ dest: '../Uploads/' })
var Error = require('../shared/ErrorLog');

router.get('/LoadOtherSetup/:StartIndex/:PageSize/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.input("PartnerID", sql.VarChar(1000), req.params.PartnerID);
        request.execute('usp_GetOtherSetup', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_GetOtherSetup', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        })
    });
});

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var str = JSON.stringify(req.body);
        var request = new sql.Request(connection);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.VarChar(20));
        
        request.execute('usp_UpdateOtherSetup', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_UpdateOtherSetup', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: request.parameters.result.value }));
            }
            res.end();
            connection.close();
        })
    });
});

var uUpload = upload.fields([{ name: 'SRODocs', maxCount: 1 }])
router.post('/doc', uUpload, function (req, res) {
    helper.uploadFile('sro-files', req.files['SRODocs'][0], function (error1, result1) {
        if (!error1) {
            var output = { result: 'Success', FileName: req.files['SRODocs'][0].originalname, FileUrl: result1, SystemGenName: result1.substring(result1.lastIndexOf('/')) };
            res.send(JSON.stringify(output));
        }
        else {
            res.send({ error: err });
        }
    });
});

module.exports = router;