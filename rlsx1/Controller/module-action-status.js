var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');
var db = require('../shared/DBAccess');
router.get('/:type/:module/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('type', sql.VarChar(100), req.params.type);
        request.input('module', sql.VarChar(100), req.params.module);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.output('TotalCount', sql.Int);
        request.execute('GetModuleActionStatusMapWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetModuleActionStatusMapWithPaging', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
                res.end();
            }
            else {
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            }
            connection.close();
        })
    }).catch(function (err) {
        var k = err;
    });

});
router.get('/status', function (req, res) {

    var sqlquery = "SELECT StatusID  ,[StatusName], [StatusCode], [Description], IsActive FROM [Statuses] where IsActive = 1 Order By StatusName";
    var con = new sql.Connection(settings.DBconfig(req));
    con.connect().then(function () {
        var reqest = new sql.Request(con);
        reqest.query(sqlquery).then(function (data) {
            res.write(JSON.stringify(data));
            res.end();
            con.close();
        })
            .catch(function (err) {
                Error.ErrorLog(err, "SELECT StatusID  ,[StatusName], [StatusCode], [Description], IsActive FROM [Statuses] where IsActive = 1 Order By StatusName", "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
                res.end();
                con.close();
            });

    })
});

router.get('/actions', function (req, res) {
    var sqlquery = "SELECT ActionID  ,[ActionName], [ActionCode], [Description], IsActive FROM [Actions] where IsActive = 1 Order By ActionName";
    var con = new sql.Connection(settings.DBconfig(req));
    con.connect().then(function () {
        var reqest = new sql.Request(con);
        reqest.query(sqlquery).then(function (data) {
            res.write(JSON.stringify(data));
            res.end();
            con.close();
        })
            .catch(function (err) {
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
                res.end();
                con.close();
            });
        
    })
});

router.get('/rules', function (req, res) {
    var sqlquery = "SELECT RuleID  ,[RuleName], [RuleCode], RuleDescription as [Description], isActive FROM [Rules] where IsActive = 1 and RuleTypeID in (select TypeLookUpID from TypeLookUp where TypeName = 'WrokFlow' and TypeGroup = 'RuleType') Order By RuleName";
    var con = new sql.Connection(settings.DBconfig(req));
    con.connect().then(function () {
        var reqest = new sql.Request(con);
        reqest.query(sqlquery).then(function (data) {
            res.write(JSON.stringify(data));
            res.end();
            con.close();
        })
            .catch(function (err) {
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
                res.end();
                con.close();
            });

    })
});


router.get('/functions/:moduleID', function (req, res) {
    var sqlquery = "select ModuleFunctionId as FunctionID, FunctionName from ModuleFunction Where ModuleID = " + req.params.moduleID +"  Order By FunctionName";
    var con = new sql.Connection(settings.DBconfig(req));
    con.connect().then(function () {
        var reqest = new sql.Request(con);
        reqest.query(sqlquery).then(function (data) {
            res.write(JSON.stringify(data));
            res.end();
            con.close();
        })
            .catch(function (err) {
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
                res.end();
                con.close();
            });

    })
});
module.exports = router;