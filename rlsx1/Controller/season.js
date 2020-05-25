var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
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
        request.output('TotalCount', sql.Int);
        request.output('access_rights', sql.NVarChar(sql.MAX));
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);        
        request.execute('usp_GetAllSeason', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetAllSeason", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value, access_rights: request.parameters.access_rights.value});
            }
            connection.close();
        })
    });
});


router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.input('userID', sql.Int, req.userlogininfo.UserID);
        request.output('result', sql.VarChar(5000));
        request.execute('usp_SaveSeason', function (err, recordsets) {
            if (err) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: request.parameters.result.value }));
            }
            res.end();
            connection.close();
        })
    });
});

module.exports = router;







