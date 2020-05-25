var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');





router.get('/itemtype', function (req, res) {

    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('type', sql.NVarChar(100), 'itemtype');
        request.execute('usp_GetProblemCategory', function (err, recordsets) {
            if (err) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ success: false, message: "Error Occured: " + err }));
                res.end;
            }
            else {
                res.send({ success: true, recordsets: recordsets });
                connection.close();
            }
            connection.close();
        });
    });
});

router.get('/probcategories/:id', function (req, res) {
    var categoryid = req.params.id; 
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('type', sql.NVarChar(100), 'probcategories');
        request.input('ParentCategoryID', sql.Int, categoryid);
        request.execute('usp_GetProblemCategory', function (err, recordsets) {
            if (err) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ success: false, message: "Error Occured: " + err }));
                res.end;
            }
            else {
                res.send({ success: true, recordsets: recordsets });
                connection.close();
            }
            connection.close();
        });
    });
});

router.get('/solutions/:id', function (req, res) {
    var categoryid = req.params.id;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('type', sql.NVarChar(100), 'solutions');
        request.input('ParentCategoryID', sql.Int, categoryid);
        request.execute('usp_GetProblemCategory', function (err, recordsets) {
            if (err) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ success: false, message: "Error Occured: " + err }));
                res.end;
            }
            else {
                res.send({ success: true, recordsets: recordsets });
                connection.close();
            }
            connection.close();
        });
    });
});

module.exports = router;