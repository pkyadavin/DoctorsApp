var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');
router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:DDIndex', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("ModuleId", sql.Int, req.params.DDIndex);
        request.output('TotalCount', sql.Int);
        request.execute('usp_AllModuleConfig', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_AllModuleConfig', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            }
        })
    });
});

router.get('/getModules', function (req, res) {
    db.executeSql(req,'select * from Module where ParentModuleID = 1098 ', function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'select * from Module where ParentModuleID = 1098 ',"", req);
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

router.get('/getParentModules/:ModuleId', function (req, res) {
    var id = req.params.ModuleId;
    db.executeSql(req,'select ModuleConfigID,ParentModuleConfigID,Code from ModuleConfig where ModuleID ='+ id , function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'select ModuleConfigID,ParentModuleConfigID,Code from ModuleConfig where ModuleID =' + id , "", req);
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
router.get('/getControls', function (req, res) {
    db.executeSql(req,'select * from ModuleControlType', function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'select * from ModuleControlType', "", req);
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
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.VarChar(20));
        request.execute('[usp_SaveModuleConfig]', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, '[usp_SaveModuleConfig]', JSON.stringify(request.parameters), req);
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

router.delete('/DeleteRow/:ID', function (req, res) {
    var id = req.params.ID;
    db.executeSql(req,'delete from ModuleConfig where ModuleConfigID =' + id, function (err, data) {
        if (err) {
            Error.ErrorLog(err, 'delete from ModuleConfig where ModuleConfigID =' + id, "", req);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(data));
        }
        res.end();
    })
});

module.exports = router;