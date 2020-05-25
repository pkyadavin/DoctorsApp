var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');
router.post('/:templateId/:userId/:parentId', function (req, res) {
    var templateId = req.params.templateId;
    var userId = req.params.userId;
    var parentId = req.params.parentId;

    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);

        var sendData = req.body[0].SendData;

        request.input('JsonData', sql.NVarChar(sql.MAX), sendData);
        request.input('TemplateId', sql.Int, templateId);
        request.input('UserID', sql.Int, userId);
        request.input('PartnerID', sql.Int, parentId);
        request.output('result', sql.NVarChar(500));
        request.execute('usp_RbomUpload_Save', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_RbomUpload_Insert", JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});


router.get('/:templateId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('TemplateId', sql.Int, req.params.templateId);
        request.execute('usp_RBOM_GetTemplateById', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_RBOM_GetTemplateById', JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
        })
    });
});

router.get('/remove/:templateId', function (req, res) {
    db.executeSql(req, 'delete from ExcelUploadTemplate where TemplateTypeID =' + req.params.templateId, function (err, data) {
        if (err) {
            Error.ErrorLog(err, 'delete from ExcelUploadTemplate where TemplateTypeID =' + req.params.templateId, req);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else if (data == undefined) {

            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Deleted" }));//request.parameters.rid.value

        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Reference" }));//request.parameters.rid.value
        }
        res.end();
    })
});

router.post('/save', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('CarrierJson', sql.NVarChar(sql.MAX), req.body[0].Carrier);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
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

module.exports = router;