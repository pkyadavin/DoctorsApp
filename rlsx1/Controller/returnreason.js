var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');
router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID/:Scope', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('TotalCount', sql.Int);
        request.input('Scope', sql.VarChar(50), req.params.Scope);
        request.output('access_rights', sql.NVarChar(sql.MAX));
        request.execute('GetReturnReasonWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetReturnReasonWithPaging", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value, access_rights: request.parameters.access_rights.value });
                connection.close();
                console.dir(recordsets);
                console.dir(request.parameters.TotalCount.value);
            }
            res.end();
            connection.close();
        })
    });
});

router.get('/GetFullfillmentFlag', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);        
        request.execute('usp_GetFullfillmentFlag', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_GetFullfillmentFlag", "", req);
                res.send({ error: err });
            }
            else {
                res.send(recordsets);
                connection.close();                
            }
            res.end();
            connection.close();
        })
    });
});

router.get('/:RMAActionCodeID/:TypeCode', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('RMAActionCodeID', sql.Int, req.params.RMAActionCodeID);
        request.input('TypeCode', sql.NVarChar(20), req.params.TypeCode);
        request.execute('GetReturnResonById', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetReturnResonById", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send(recordsets);
                console.dir(recordsets);
            }
            res.end();
            connection.close();
        })

    });
});

router.post('/:RMAActionCodeID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.output('RMAActionCodeIDOutput', sql.Int);
        request.input('RMAActionCodeID', sql.Int, req.params.RMAActionCodeID);
        request.input('RMAActionCode', sql.VarChar(50), req.body.RMAActionCode);
        request.input('RMAActionName', sql.VarChar(sql.MAX), JSON.stringify(req.body.RMAActionName));
        request.input('IsActive', sql.Int, ~~(req.body.isActive));
        request.input('CreatedBy', sql.Int, req.body.CreatedBy);
        request.input('ModifyBy', sql.Int, req.body.ModifyBy);

        request.input('RequiredonCustomerPortal', sql.Int, ~~(req.body.RequiredonCustomerPortal));
        request.input('RequiredonBackOffice', sql.Int, ~~(req.body.RequiredonBackOffice));
        request.input('FileUploadRequired', sql.Int, ~~(req.body.FileUploadRequired));
        request.input('CommentRequired', sql.Int, ~~(req.body.CommentRequired));
        request.input('ApprovalRequired', sql.Int, ~~(req.body.ApprovalRequired));

        request.input('ReturnReasonRuleMap', sql.NVarChar(sql.MAX), req.body.ReturnReasonRuleMapList[0].ReturnReasonRuleMap);
        request.input('ReturnTypeMap', sql.NVarChar(sql.MAX), req.body.ReturnReasonRuleMapList[0].fulfilmentmap);
        request.input('Scope', sql.VarChar(50), req.body.Scope);
        request.input('TenantReturnReasonCode', sql.VarChar(50), req.body.TenantReturnReasonCode);
        request.input('ParentId', sql.Int, req.body.ParentId);

        request.execute('InsertUpdateReturnReason', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "InsertUpdateReturnReason", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ recordsets: recordsets, RMAActionCodeID: request.parameters.RMAActionCodeIDOutput.value });
            }
            res.end();
            connection.close();
        });
    });
});

router.delete('/:RMAActionCodeID', function (req, res) {
    var RMAActionCodeID = req.params.RMAActionCodeID;
    var sqlquery = "Delete From RMAActionCode Where RMAActionCodeID=" + RMAActionCodeID + ";Delete From RMAActionCode Where RMAActionCodeID=" + RMAActionCodeID;
    db.executeSql(req, sqlquery, function (data, err) {
        if (err) {
            Error.ErrorLog(err, sqlquery, "", req);
            res.send({ error: err });
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: 'deleted' }));
        }
        res.end();
    });
});


module.exports = router;