var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var helper = require('../UtilityLib/BlobHelper');
var multer = require('multer');
var upload = multer({ dest: '../Uploads/' })
var Error = require('../shared/ErrorLog');

var uUpload = upload.fields([{ name: 'userimage', maxCount: 1 }])
router.post('/profileimage', uUpload, function (req, res) {
    console.log(req);    
    helper.uploadFile('consumer-files', req.files['userimage'][0], function (error1, result1) {
        if (!error1) {
            var output = { result: 'Success', FileUrl: result1 };
            res.send(JSON.stringify(output));
        }
        else {
            res.send({ error: err });
        }
    });
});

var filesUpload = upload.fields([{ name: 'UserImage', maxCount: 5 }])
router.post('/files', filesUpload, function (req, res) {
    console.log('sdfsdf');
    console.log(req.files);
    var pendingFile = req.files['UserImage'].length;
    helper.uploadFiles('consumer-files', req.files['UserImage'], function (errors, files) {
        pendingFile--;
        if(pendingFile <= 0){
            var output = { errors: errors, files: files };
            console.log(files);
            res.send(JSON.stringify(output));
        }
    });
});

var cpUpload = upload.fields([{ name: 'UserImage', maxCount: 1 }])
router.post('/UpdateUser', cpUpload, function (req, res) {
     console.dir(req.body.data);
    var savetodb = function () {
         req.body = JSON.parse(req.body.data);
        var connection = new sql.Connection(settings.DBconfig(req));
        connection.connect().then(function () {
            var request = new sql.Request(connection);
            request.input('Alldata', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
            request.input('loggedInUserId', sql.Int, req.userlogininfo.UserID);
            request.input('ImageUrl', sql.NVarChar(500), req.ImageUrl);
            request.output('result', sql.NVarChar(sql.MAX));

            request.execute('usp_User_SaveDetail', function (err, recordsets, returnValue) {
                console.log(request.parameters.result.value);
                if (err) {
                    Error.ErrorLog(err, "usp_User_SaveDetail", JSON.stringify(request.parameters), req);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.write(JSON.stringify({ success: false, message: "Error Occured: " + err }));
                    res.end;
                }
                else {
                    res.send({ result: request.parameters.result.value });
                    console.dir(request.parameters.result.value);
                }
            })
        });
    }

    if (req.files['UserImage'] != undefined) {
        helper.uploadFile('consumer-files', req.files['UserImage'][0], function (error, result) {
            if (error) {
                req.ImageUrl = '';
                console.dir("Error Occured: " + err);
            }
            else {
                req.ImageUrl = result;
                savetodb();
            }
        });
    }
    else {
        req.ImageUrl = '';
        savetodb();
    }
});

module.exports = router;