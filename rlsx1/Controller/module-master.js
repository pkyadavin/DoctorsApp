var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');
router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("PartnerID", sql.VarChar(1000), req.params.PartnerID);
        request.output('TotalCount', sql.Int);
        request.execute('GetModuleMasterWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetModuleMasterWithPaging', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            }
            connection.close();
        })
    });
});
router.get('/parent', function (req, res) {

    db.executeSql(req,"SELECT ModuleID  ,[Module] FROM [Module] Order by [Module]", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT ModuleID  ,[Module] FROM [Module] Order by [Module]", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();



    });
});
router.post('/:action', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('action', sql.VarChar(20), req.params.action);
        request.input('ModuleData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.output('result', sql.VarChar(sql.MAX));
        request.execute('usp_Module_SaveDetail', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_Module_SaveDetail", JSON.stringify(request.parameters), req);
                var error = err;
            }
            else {
                res.send({ result: request.parameters.result.value });
            }
            connection.close();
        })
    });
});
router.get('/GetPermissionByModule/:UserId/:PartnerId/:Module', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('UserId', sql.Int, req.params.UserId);
        request.input('PartnerId', sql.Int, req.params.PartnerId);
        request.input("Module", sql.VarChar(1000), req.params.Module);
        request.execute('GetPermissionByModule', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetPermissionByModule", JSON.stringify(request.parameters), req);
               
            }
            res.send(recordsets);
            connection.close();
        })
    });
})
module.exports = router;