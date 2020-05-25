var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var helper = require('../UtilityLib/BlobHelper');
var multer = require('multer');
var upload = multer({ dest: '../Uploads/' })
var Error = require('../shared/ErrorLog');
router.get('/:PartnerID/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:Scope', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input('PartnerID', sql.Int, req.params.PartnerID);
        request.input('Scope', sql.VarChar(50), req.params.Scope);
        request.output('TotalCount', sql.Int);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.execute('usp_RmaActionCode_All', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_RmaActionCode_All", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            }
            connection.close();
        })
    });
});

router.get('/:ID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ID', sql.Int, req.params.ID);
        request.execute('usp_RMAActionCode_Get', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_RMAActionCode_Get", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        })
    });
});

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        var actionSP = "usp_ReturnType_Post";
        request.input('returntype', sql.NVarChar(sql.MAX), req.body[0].returntype);
        request.input('Scope', sql.NVarChar(sql.MAX), req.body[0].Scope);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);        
        request.execute(actionSP, function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, actionSP, JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.status(200).send();
            }
            connection.close();
            res.end();
        })
    });
});

router.delete('/:ID', function (req, res) {
    db.executeSql(req, "DELETE FROM RMAActionCode WHERE RMAActionCodeID =" + req.params.ID, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "DELETE FROM RMAActionCode WHERE RMAActionCodeID =" + req.params.ID, "", req);
            res.send({ error: err });
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(res.statusCode.toString());
        }
        res.end();
        connection.close();
    });
});
router.get('/returnreason/:Category', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('CategoryCode', sql.NVarChar(100), req.params.Category);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);

        request.execute('getCategoryWiseReturnResons', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "getCategoryWiseReturnResons", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        })
    });
});
module.exports = router;