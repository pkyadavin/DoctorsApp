var express = require('express');
var router = express.Router();
var settings = require('../shared/Settings');
/* GET users listing. */
var sql = require('mssql');

var db = require('../shared/DBAccess');
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
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('TotalCount', sql.Int);
        request.execute('GetProSolWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetProSolWithPaging", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
        })
    });
});

router.get('/:ProbSolID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ProbSolID', sql.VarChar(100), req.params.ProbSolID);
        request.execute('GetProSolById', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetProSolById", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
        })
    });
});

router.post('/:ProbSolID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.output('ProbSolIDOutput', sql.Int);
        request.input('ProbSolID', sql.Int, req.params.ProbSolID);
        request.input('Title', sql.VarChar(250), req.body.Title);
        request.input('Description', sql.NVarChar(sql.MAX), req.body.Description);
        request.input('IsActive', sql.Int, ~~(req.body.IsActive));
        request.input('CreatedBy', sql.Int, req.userlogininfo.UserID);
        request.input('ProbMap', sql.NVarChar(sql.MAX), req.body.ProbMap[0].ProbMap);
        request.execute('InsertUpdateProbSol', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "InsertUpdateProbSol", JSON.stringify(request.parameters), req);
                res.send({ recordsets: recordsets, ProbSolID: request.parameters.ProbSolIDOutput.value });
                console.dir(recordsets);
                console.dir(request.parameters.ProbSolIDOutput.value);
            }
            else {
                res.send({ recordsets: recordsets, ProbSolID: request.parameters.ProbSolIDOutput.value });
            }
            connection.close();
        });
    });
});


module.exports = router;