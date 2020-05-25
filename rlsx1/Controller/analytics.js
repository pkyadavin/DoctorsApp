var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');

router.post('/webreport/:code', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);       
        request.input('report', sql.NVarChar(50), req.params.code);
        request.input('report_filter', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.input('user_id', sql.Int, req.userlogininfo.UserID);
        request.input('language', sql.Int, req.userlogininfo.languageid);
        request.output('cd', sql.NVarChar(sql.MAX));
        request.output('total_count', sql.Int);
        request.execute('usp_Analytics', function (err, recordsets, returnValue) {
            connection.close();
            if (err) {
                Error.ErrorLog(err, "usp_Analytics", JSON.stringify(request.parameters), req);
                res.status(400).send({ error: err });
            }
            else {
                res.send({data: recordsets[0], columns: request.parameters.cd.value, total_count: request.parameters.total_count.value });
            }
        })
    });
});

router.get('/webreport/statitics/:StartDate/:EndDate', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);    
        request.input('StartDate', sql.NVarChar(50), req.params.StartDate);   
        request.input('EndDate', sql.NVarChar(50), req.params.EndDate);       
        request.execute('usp_GetAllRMACountConditionWise', function (err, recordsets, returnValue) {
            connection.close();
            if (err) {
                Error.ErrorLog(err, "usp_GetAllRMACountConditionWise", JSON.stringify(request.parameters), req);
                res.status(400).send({ error: err });
            }
            else {
                res.send({data: recordsets});
            }
        })
    });
});
router.post('/graphical', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('filter', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.execute('usp_graphical', function (err, recordsets, returnValue) {
            connection.close();
            if (err) {
                Error.ErrorLog(err, "usp_graphical", JSON.stringify(request.parameters), req);
                res.status(400).send({ error: err });
            }
            else {
                res.status(200).send({ data: recordsets });
            }
        })
    });
});

router.post('/export/:code', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);       
        request.input('report', sql.NVarChar(50), req.params.code);
        request.input('report_filter', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.input('user_id', sql.Int, req.userlogininfo.UserID);
        request.input('language', sql.Int, req.userlogininfo.languageid);
        request.output('cd', sql.NVarChar(sql.MAX));
        request.output('total_count', sql.Int);
        request.execute('usp_Analytics', function (err, recordsets, returnValue) {
            connection.close();
            if (err) {
                Error.ErrorLog(err, "usp_Analytics", JSON.stringify(request.parameters), req);
                res.status(400).send({ error: err });
            }
            else {
                
                res.send({data: recordsets[0], columns: request.parameters.cd.value, total_count: request.parameters.total_count.value });
            }
        })
    });
});
module.exports = router;