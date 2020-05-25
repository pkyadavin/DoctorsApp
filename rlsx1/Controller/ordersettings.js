var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');
router.get('/:ID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('moduleId', sql.NVarChar(sql.MAX), req.params.ID);
        request.execute('usp_OrderSettings', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_OrderSettings", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send(recordsets);
            }
            connection.close();
        })
    });
});

router.post('/:ID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('Settings', sql.NVarChar(sql.MAX), req.body[0].Settings);
        request.input('moduleId', sql.NVarChar(sql.MAX), req.params.ID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.execute('usp_OrderSettings_Post', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_OrderSettings_Post", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send(recordsets);
            }
            connection.close();
        })
    });
});

module.exports = router;