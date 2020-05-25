var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');
router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    var OrderDayWise = req.params.OrderDayWise;
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input('PartnerID', sql.Int, req.params.PartnerID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('TotalCount', sql.Int);
        //request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.execute('usp_RoleType_all', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_RoleType_all", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            }
            connection.close();
        })
    });
});

router.get('/category/:ID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    var OrderDayWise = req.params.OrderDayWise;
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('scope', sql.NVarChar, req.scope);
        request.input('roleTypeId', sql.Int, req.params.ID);        
        request.execute('usp_ModuleRoleWise', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_ModuleRoleWise", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send(recordsets);
            }
            connection.close();
        })
    });
});

router.get('/', function (req, res) {
    db.executeSql(req,"SELECT DashBoardMasterID, DashBoardCode, DashBoardDescription, ListType FROM DashBoardMaster where IsActive = 1", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT DashBoardMasterID, DashBoardCode, DashBoardDescription, ListType FROM DashBoardMaster where IsActive = 1", "", req);
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

router.get('/subcategory/:mID/:rID', function (req, res) {
    db.executeSql(req,` SELECT DISTINCT rmf.RoleModuleFunctionID AS 'ID', mf.ModuleID AS 'ModuleID'
    , mf.FunctionName AS 'Display_Name', mf.FunctionCode AS 'Code', rmf.IsApplicable AS 'IsApplicable'
    FROM Module m 
    INNER JOIN ModuleFunction mf ON m.ModuleID = mf.ModuleID 
    INNER JOIN dbo.SalePlanModule spm ON m.ModuleID = spm.ModuleID
	INNER JOIN dbo.TenantSalePlanMap tsp ON spm.SalePlanID = tsp.SalePlanID
	INNER JOIN dbo.Tenant t ON t.TenantID = tsp.TenantID
    RIGHT JOIN RoleModuleFunction rmf ON mf.ModuleFunctionId = rmf.ModuleFunctionID	
    WHERE m.ModuleID = ${req.params.mID} AND rmf.RoleTypeId =  ${req.params.rID} 
    AND t.Domain='${req.scope}'`
    , function (data, err) {
        if (err) {
            Error.ErrorLog(err, `SELECT DISTINCT rmf.RoleModuleFunctionID AS 'ID', mf.ModuleID AS 'ModuleID'
            , mf.FunctionName AS 'Display_Name', mf.FunctionCode AS 'Code', rmf.IsApplicable AS 'IsApplicable'
            FROM Module m 
            INNER JOIN ModuleFunction mf ON m.ModuleID = mf.ModuleID 
            INNER JOIN dbo.SalePlanModule spm ON m.ModuleID = spm.ModuleID
            INNER JOIN dbo.TenantSalePlanMap tsp ON spm.SalePlanID = tsp.SalePlanID
            INNER JOIN dbo.Tenant t ON t.TenantID = tsp.TenantID
            RIGHT JOIN RoleModuleFunction rmf ON mf.ModuleFunctionId = rmf.ModuleFunctionID	
            WHERE m.ModuleID = ${req.params.mID} AND rmf.RoleTypeId =  ${req.params.rID} 
            AND t.Domain='${req.scope}'`, ""
            , req);
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
        request.input('Role', sql.NVarChar(sql.MAX), req.body[0].r);
        request.input('a', sql.NVarChar(sql.MAX), req.body[0].a);
        request.input('na', sql.NVarChar(sql.MAX), req.body[0].na);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('scope', sql.NVarChar(50), req.scope);
        request.output('returnValue', sql.NVarChar())
        request.execute('usp_Accessrule', function (err, data, returnValue) {
            connection.close();
            if (err) {
                Error.ErrorLog(err, "usp_Accessrule", JSON.stringify(request.parameters), req);
            }
            else {
            res.send({ data: data, result: request.parameters.returnValue.value });
            }
        })
    });
});

router.delete('/:ID', function (req, res) {
    db.executeSql(req,"DELETE FROM RoleType WHERE RoleID Not IN(23,34) AND RoleID =" + req.params.ID, function (data, err) {
        if (err) {
           
            Error.ErrorLog(err, "DELETE FROM RoleType WHERE RoleID Not IN(23,34) AND RoleID =" + req.params.ID, "", req);
            
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Success" }));
        }
        res.end();
    });
});

module.exports = router;