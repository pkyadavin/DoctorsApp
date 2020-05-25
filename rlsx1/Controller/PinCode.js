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
        request.execute('usp_All_PinCodes', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_All_PinCodes", JSON.stringify(request.parameters), req);
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

router.get('/getCarrier', function (req, res) {
    db.executeSql(req,'select CarrierID,CarrierName,CarrierCode from Carrier', function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'select CarrierID,CarrierName,CarrierCode from Carrier', "", req);
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

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.input('json', sql.NVarChar(sql.MAX), req.body[0].Template);
        request.output('returnValue', sql.VarChar(20));
        request.execute('usp_MessageTemplateSave1', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_MessageTemplateSave1", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
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