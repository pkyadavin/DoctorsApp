var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var helper = require('../UtilityLib/BlobHelper');
var multer = require('multer');
var upload = multer({ dest: '../Uploads/' })
var Error = require('../shared/ErrorLog');
router.get('/:Status/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('Status', sql.VarChar(100), req.params.Status);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('TotalCount', sql.Int);
        request.execute('GetShipmentOrderByPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetShipmentOrderByPaging", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
        })
    });
});

router.get('/GetSROHeaderByShippingNumber/:UserId/:ShippingNumber/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('UserId', sql.Int, req.params.UserId);
        request.input('ShippingNumber', sql.VarChar(100), req.params.ShippingNumber);
        request.input('PartnerID', sql.Int, req.params.PartnerID);
        request.execute('GetSalesReturnOrderByShippingNumber', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetSalesReturnOrderByShippingNumber", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })
    });
});

router.get('/allshippedorders/:Status/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID/:ShippingNumber/:RMADetailID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('Status', sql.VarChar(100), req.params.Status);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.input("ShippingNumber", sql.VarChar(100), req.params.ShippingNumber);
        request.input("RMADetailID", sql.VarChar(100), req.params.RMADetailID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('TotalCount', sql.Int);
        request.execute('GetShippedSalesReturnOrderByPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetShippedSalesReturnOrderByPaging", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
        })
    });
});

router.get('/TrackShipping/:SalesReturnOrderDetailID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('SalesReturnOrderDetailID', sql.Int, req.params.SalesReturnOrderDetailID);
        request.execute('usp_RMATrackShipping', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_RMATrackShipping", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })
    });
});

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('Order', sql.VarChar(5000), JSON.stringify(req.body));
        request.execute('usp_ShipRMAOrder_Post', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_ShipRMAOrder_Post", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(res.statusCode.toString());
            }
            res.end();
            connection.close();
        })
    });
});

module.exports = router;