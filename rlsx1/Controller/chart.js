var Error = require('../shared/ErrorLog');
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
router.get('/:chartType/:moduleName', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('chartType', sql.VarChar(20), req.params.chartType);
        request.input('moduleName', sql.VarChar(100), req.params.moduleName);
        request.input('userId', sql.Int, req.userlogininfo.UserID);
        request.execute('usp_GetChartData', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetChartData", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets});
            connection.close();
        })
    });
});

router.get('/dashbaord/:chartType/:moduleName', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('chartType', sql.VarChar(20), req.params.chartType);
        request.input('moduleName', sql.VarChar(100), req.params.moduleName);
        request.input('userId', sql.Int, req.userlogininfo.UserID);
        request.execute('usp_GetDashboardChartData', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetDashboardChartData", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets });
            connection.close();
        })
    });
});

module.exports = router;







