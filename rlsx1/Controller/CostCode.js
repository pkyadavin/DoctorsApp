var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');
router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input('PartnerId', sql.Int, req.params.PartnerId);
        request.output('TotalCount', sql.Int);
        request.execute('[GetCostCodeLookUpWithPaging]', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "[GetCostCodeLookUpWithPaging]", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
        })
    })
});


router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.VarChar(20));
        request.input('UserId', sql.Int, req.body.UserId);
        request.execute('usp_SaveCostCodeLookUp', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_SaveCostCodeLookUp", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: request.parameters.result.value }));
            }
            connection.close();
            res.end();
        })
    });
});
router.delete('/RemoveCostCode/:ID', function (req, res) {
    var id = req.params.ID;

    db.executeSql(req, 'delete from CostCodeLookup where CostCodeLookupID =' + id, function (err, data) {
        if (err) {
            Error.ErrorLog(err, 'delete from CostCodeLookup where CostCodeLookupID =' + id, "", req);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Deleted" }));
        }
        res.end();
    })
});

module.exports = router;