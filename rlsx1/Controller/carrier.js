var express = require('express');
var router = express.Router();
var settings = require('../shared/Settings');
/* GET users listing. */
var sql = require('mssql');
var Error = require('../shared/ErrorLog');
var db = require('../shared/DBAccess');

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
        request.execute('GetCarrierWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetCarrierWithPaging", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
        })
    });
});


router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID/:CarrierID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.input("CarrierID", sql.Int, req.params.CarrierID);
        request.output('TotalCount', sql.Int);
        request.execute('GetCarrierLaneWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetCarrierLaneWithPaging", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
        })
    });
});


router.get('/:CarrierID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('CarrierID', sql.Int, req.params.CarrierID);
        request.execute('GetCarrierById', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetCarrierById', JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
        })
    });
});

router.post('/save/:accessorialLoaded/:odPairLoaded/:laneLoaded', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('CarrierJson', sql.NVarChar(sql.MAX), req.body[0].Carrier);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('accessorialLoaded', sql.Int, req.params.accessorialLoaded);
        request.input('odPairLoaded', sql.Int, req.params.odPairLoaded);
        request.input('laneLoaded', sql.Int, req.params.laneLoaded);
        request.output('result', sql.VarChar(5000));
        request.execute('usp_Carrier_SaveDetail', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'usp_Carrier_SaveDetail', JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value, outputResult: request.parameters.result.value });
            connection.close();
        })
    });
});

router.get('/GetCarrierAccessorialByID/:CarrierID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('CarrierID', sql.Int, req.params.CarrierID);
        request.execute('GetCarrierAccessorialByID', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetCarrierAccessorialByID', JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
        })
    });
});


router.get('/GetCarrierODPairById/:CarrierID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('CarrierID', sql.Int, req.params.CarrierID);
        request.execute('GetCarrierODPairById', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetCarrierODPairById', JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
        })
    });
});


router.get('/GetCarrierLaneById/:CarrierID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('CarrierID', sql.Int, req.params.CarrierID);
        request.execute('GetCarrierLaneById', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetCarrierLaneById', JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
        })
    });
});



router.delete('/:CarrierID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('CarrierID', sql.Int, req.params.CarrierID);
        request.output('result', sql.VarChar(5000));
        request.execute('usp_Carrier_DeleteDetail', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'usp_Carrier_DeleteDetail', JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value});
            connection.close();
        })
    });
});

module.exports = router;