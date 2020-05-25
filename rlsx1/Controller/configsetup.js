var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
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
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.output('TotalCount', sql.Int);
        request.execute('usp_ConfigSetup_GetAll', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_ConfigSetup_GetAll", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            connection.close();
        })
    });
});

router.get('/:Id', function (req, res) {

    db.executeSql(req,"SELECT ConfigSetupID as ID , [Code] , [Name], [Value], [Remarks], [IsActive] FROM [ConfigSetup] where ConfigSetupID=" + req.params.Id, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT ConfigSetupID as ID , [Code] , [Name], [Value], [Remarks], [IsActive] FROM [ConfigSetup] where ConfigSetupID=" + req.params.Id,"", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();



    });
});

router.post('/:ID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ConfigSetup', sql.NVarChar(sql.MAX), req.body[0].ConfigSetup);
        request.input('ConfigID', sql.Int, req.params.ID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.execute('usp_ConfigSetup_Post', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_ConfigSetup_Post", JSON.stringify(request.parameters), req);
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

router.delete('/:ConfigSetupID', function (req, res) {
    db.executeSql(req,"delete from [ConfigSetup] where ConfigSetupId=" + req.params.ConfigSetupID, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "delete from [ConfigSetup] where ConfigSetupId=" + req.params.ConfigSetupID, req);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(res.statusCode.toString());
        }
        res.end();
    });
});
module.exports = router;