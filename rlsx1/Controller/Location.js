var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');

router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
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
            request.execute('usp_GetPartnerLocations', function (err, recordsets, returnValue) {
                if (err) {
                    Error.ErrorLog(err, "usp_GetPartnerLocations", JSON.stringify(request.parameters), req);
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

router.get('/ByID/:PartnerLocationID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {        
        var request = new sql.Request(connection);
        request.input("PartnerLocationID", sql.Int, req.params.PartnerLocationID);        
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);        
        request.execute('usp_LocationStructure', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetPartnerLocations", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets[0][0].result });
            }
            connection.close();
        })
    });
});

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.input('userID', sql.Int, req.body.UserID);
        request.output('result', sql.VarChar(20));
            request.execute('usp_SavePartnerLocation', function (err, recordsets, returnValue) {
                if (err) {
                Error.ErrorLog(err, "usp_SavePartnerLocation", JSON.stringify(request.parameters), req);
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

router.post('/AddLocations/:lid/:r/:c/:f', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('LocationID', req.params.lid);
        request.input('Rows', sql.Int, req.params.r);
        request.input('Columns', sql.Int, req.params.c);
        request.input('FrameID', sql.Int, req.params.f);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.execute('usp_AddPartnerLocations', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_AddPartnerLocations", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: 'success' }));
            }
            res.end();
            connection.close();
        })
    });
});

router.post('/RenameLocation/:lid/:n/:TenantCode', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('LocationID', req.params.lid);
        request.input('Name', sql.NVarChar(100), req.params.n);
        request.input('TenantCode', sql.NVarChar(200), req.params.TenantCode);
        request.output('result', sql.VarChar(200));
        request.execute('usp_RenamePartnerLocations', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_RenamePartnerLocations", JSON.stringify(request.parameters), req);
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

router.delete('/RemoveLocation/:ID', function (req, res) {
    var id = req.params.ID;

    db.executeSql(req,'delete from PartnerLocation where PartnerLocationID =' + id, function (err, data) {
        if (err) {
            Error.ErrorLog(err, 'delete from PartnerLocation where PartnerLocationID =' + id, "", req);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Deleted" }));
        }
        res.end();
    })
});

module.exports = router;