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
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('TotalCount', sql.Int);
        request.execute('GetRuleWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetRuleWithPaging", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
        })
    });
});

router.get('/:RuleID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('RuleID', sql.Int, req.params.RuleID);
        request.execute('GetRuleById', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetRuleById', JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
        })
    });
});

router.get('/move/:RuleID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('RuleID', sql.Int, req.params.RuleID);
        request.execute('usp_MoveRuleUP', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_MoveRuleUP', JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            res.send(recordsets);
            console.dir(recordsets);
        })
    });
});

router.post('/:RuleID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.output('RuleIDOutput', sql.Int);
        request.input('RuleID', sql.Int, req.params.RuleID);
        request.input("RuleCode", sql.VarChar(50), req.body.RuleCode);
        request.input("RuleName", sql.VarChar(100), req.body.RuleName);
        request.input("RuleDescription", sql.VarChar(500), req.body.RuleDescription);
        request.input('RuleTypeID', sql.Int, req.body.RuleTypeID);
        request.input("IsActive", sql.Int, ~~(req.body.isActive));
        request.input('UserId', sql.Int, req.userlogininfo.UserID);

        request.execute('InsertUpdateRule', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'InsertUpdateRule', JSON.stringify(request.parameters), req);
                res.send({ recordsets: recordsets, FacilityId: request.parameters.RuleIDOutput.value });
                console.dir(recordsets);
                console.dir(request.parameters.RuleIDOutput.value);
            }
            else {
                res.send({ recordsets: recordsets, FacilityId: request.parameters.RuleIDOutput.value });
            }
            connection.close();
        });
    });
});

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input("Rule", sql.VarChar(sql.MAX), req.body[0].rule);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);

        request.execute('usp_rule_post', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_rule_post', JSON.stringify(request.parameters), req);
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
});

router.delete('/:RuleID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('RuleID', sql.Int, req.params.RuleID);
        request.output('TotalCount', sql.Int);
        request.execute('usp_DeleteRule', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_DeleteRule', '', req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            connection.close();
        })
    });
});

module.exports = router;