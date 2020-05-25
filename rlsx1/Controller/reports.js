var express = require('express');
var router = express.Router();
var settings = require('../shared/Settings');
/* GET users listing. */
var sql = require('mssql');

var db = require('../shared/DBAccess');

var Error = require('../shared/ErrorLog');
router.get('/GetItems/:partnerID/:modelID/:ItemID/:NodeID/:LocationID/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);

        request.input('partnerID', sql.VarChar(10), req.params.partnerID);
        request.input('modelID', sql.VarChar(10), req.params.modelID);
        request.input('itemNumberID', sql.VarChar(10), req.params.ItemID);
        request.input('NodeID', sql.VarChar(10), req.params.NodeID);
        request.input('LocationID', sql.VarChar(10), req.params.LocationID);

        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("searchCriteria", sql.VarChar(100), req.params.FilterValue);
        request.output('TotalCount', sql.Int);

        request.execute('usp_GetInventories_All', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetInventories_All", JSON.stringify(request.parameters), req);
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

router.get('/GetItemSerials/:partnerID/:modelID/:ItemID/:NodeID/:LocationID/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);

        request.input('partnerID', sql.VarChar(10), req.params.partnerID);
        request.input('modelID', sql.VarChar(10), req.params.modelID);
        request.input('itemNumberID', sql.VarChar(10), req.params.ItemID);
        request.input('NodeID', sql.VarChar(10), req.params.NodeID);
        request.input('LocationID', sql.VarChar(10), req.params.LocationID);

        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("searchCriteria", sql.VarChar(100), req.params.FilterValue);
        request.output('TotalCount', sql.Int);

        request.execute('usp_GetItemInventories_All', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetItemInventories_All", JSON.stringify(request.parameters), req);
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



router.get('/GetItemSerials1/:partnerID/:modelID/:ItemID/:NodeID/:LocationID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('partnerID', sql.VarChar(10), req.params.partnerID);
        request.input('modelID', sql.VarChar(10), req.params.modelID);
        request.input('itemNumberID', sql.VarChar(10), req.params.ItemID);
        request.input('NodeID', sql.VarChar(10), req.params.NodeID);
        request.input('LocationID', sql.VarChar(10), req.params.LocationID);

       

        request.execute('usp_GetPopUpItemInventories_All', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetPopUpItemInventories_All", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
           else {
               res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount });
           }
            connection.close();
        })
    });
});

router.get('/GetItemContextHistory/:partnerID/:ItemID/:startDate/:endDate/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);

        request.input('partnerID', sql.VarChar(10), req.params.partnerID);
        request.input('itemmasterID', sql.VarChar(10), req.params.ItemID);
        request.input('startDate', sql.VarChar(20), req.params.startDate);
        request.input('endDate', sql.VarChar(20), req.params.endDate);

        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("searchCriteria", sql.VarChar(100), req.params.FilterValue);
        request.output('TotalCount', sql.Int);

        request.execute('spGetItemContextHistory', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "spGetItemContextHistory", JSON.stringify(request.parameters), req);
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


router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('fromDate', sql.VarChar(20), req.body.fromDate);
        request.input('toDate', sql.VarChar(20), req.body.toDate);
     
        request.execute('usp_AgingReport', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_AgingReport", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets });
            connection.close();
            console.dir(recordsets);

        })
    });
});

router.post('/:HdrId/:UserId/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {

        var request = new sql.Request(connection);
        request.input('JsonData', sql.VarChar(sql.MAX), JSON.stringify(req.body));
        var para = req.params.HdrId;
        if (para != 'undefined') {
            request.input("InventoryReconcileHdrID", sql.Int, para);
        }
        else {
            request.input("InventoryReconcileHdrID", sql.Int, 0);
        }
        request.input('InventoryReconcileHdrID', para);
        request.input('UserId', sql.Int, req.body.UserId);
        request.input('PartnerID', sql.Int, req.body.PartnerID);
        request.execute('usp_Inventory_SaveDetail', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_Inventory_SaveDetail", JSON.stringify(request.parameters), req);
            }         
            res.send(recordsets);           
        })
    });
});


router.get('/:codeid', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.execute('usp_RMAActionCode_GetById', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_Inventory_SaveDetail", JSON.stringify(request.parameters), req);
            } 
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.get('/GetItemContextHistory1/:partnerID/:ItemID/:startDate/:endDate/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);

        request.input('partnerID', sql.VarChar(10), req.params.partnerID);
        request.input('itemmasterID', sql.VarChar(10), req.params.ItemID);
        request.output('TotalCount', sql.Int);

        request.execute('spGetItemContextHistory', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "spGetItemContextHistory", JSON.stringify(request.parameters), req);
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


module.exports = router;