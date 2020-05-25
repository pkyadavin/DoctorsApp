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
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.execute('usp_AreaCode_GetAll', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_AreaCode_GetAll", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
        })
    });
});

router.get('/:AreaCodeID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('AreaCodeID', sql.Int, req.params.CarrierID);
        request.execute('usp_AreaCode_GetByID', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_AreaCode_GetByID', JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
        })
    });
});

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('AreaCodeJson', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.output('result', sql.VarChar(5000));
        request.execute('usp_AreaCode_Save', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'usp_AreaCode_Save', JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});

router.get('/Validate/:code', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input("code", sql.VarChar(10), req.params.code);
        request.execute('usp_areacode_Validate', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_areacode_Validate", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        })
    });

});

router.get('/GetPartners/:code', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input("code", sql.VarChar(10), req.params.code);
        request.execute('usp_areacode_GetASCByZipCode', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_areacode_GetASCByZipCode", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        })
    });

});

router.get('/GetCities/:StateID', function (req, res) {
    db.executeSql(req, "SELECT *from City where StateID=" + req.params.StateID, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT *from City where StateID=" + req.params.StateID, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});



router.delete('/RemoveTemplate/:ID', function (req, res) {
    var id = req.params.ID;

    db.executeSql(req,'delete from MessagingTemplate where ID =' + id, function (err, data) {
        if (err) {
            Error.ErrorLog(err, 'delete from MessagingTemplate where ID =' + id, "", req);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(data));//request.parameters.rid.value
        }
        res.end();
    })
});

module.exports = router;