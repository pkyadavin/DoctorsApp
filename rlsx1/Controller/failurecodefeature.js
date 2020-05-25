
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');
router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.output('TotalCount', sql.Int);
        request.execute('usp_FailureCodeFeature_GetAll', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_FailureCodeFeature_GetAll', JSON.stringify(request.parameters), req);
            }
        res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
        console.dir(recordsets);
        console.dir(request.parameters.TotalCount.value);
        connection.close();
        })
    });
});


router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.VarChar(20));
        request.execute('[usp_FailureCodeFeature_SaveDetail]', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, '[usp_FailureCodeFeature_SaveDetail]', JSON.stringify(request.parameters), req);
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

router.get('/failurecodefeaturegroups', function (req, res) {
    db.executeSql(req,'select FailureCodeFeatureGroupID,FailureCodeFeatureGroupCode,FailureCodeFeatureGroupName from [failurecodefeaturegroup]  where isActive = 1 ', function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'select FailureCodeFeatureGroupID,FailureCodeFeatureGroupCode,FailureCodeFeatureGroupName from [failurecodefeaturegroup]  where isActive = 1 ', "", req);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(data));
        }
        res.end();
    });

});

module.exports = router;