var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');
router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("Paramdata", sql.VarChar(1000), req.params.Paramdata);
        request.output('TotalCount', sql.Int);
        request.execute('GetItemMasterByPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetItemMasterByPaging", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
        })
    });
});

router.get('/GetPartnerData/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("PartnerId", sql.VarChar(1000), req.params.PartnerId);
        request.output('TotalCount', sql.Int);
        request.execute('GetItemMasterByPagingoriginal', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetItemMasterByPagingoriginal", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });

            connection.close();
        })
    });
});




router.post('/', function (req, res) {
    var itemmasterId = req.params.ItemMasterID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_SavePartnerPartMaster', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_SavePartnerPartMaster", JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});

module.exports = router;