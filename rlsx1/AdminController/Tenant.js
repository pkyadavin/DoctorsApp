var express = require('express');
var router = express.Router();
var sql = require('mssql');
var AdminDBConfig = require('../shared/Settings');
var AdminDB = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');
router.get('/:OrderStatus/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue', function (req, res) {
    var connection = new sql.Connection(AdminDBConfig.AdminConfig);
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('OrderStatus', sql.VarChar(100), req.params.OrderStatus);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.output('TotalCount', sql.Int);
        request.execute('Usp_GetAllTenants', function (err, recordsets, returnValue) {
            if (err) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
                res.end();
            }
            else {
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            }
        })
    });
});

router.delete('/:tenantID', function (req, res) {
    var TenantID = req.params.tenantID;
    AdminDB.executeAdminSql('delete from  '+req.scope+'.Tenant where TenantID=' + TenantID, function (data, err) {
        if (err) {
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

router.get('/getbyid/:tenantID', function (req, res) {
    var TenantID = req.params.tenantID;
    AdminDB.executeAdminSql(`select TenantID, TenantName, TenantCode, ClaimType, EmailId, ValidFrom, ValidTo, NoofUsers, IsApprove, Domain, CPDomain, XMLData, CreatedBy, 
            CreatedDate, ModifiedBy, ModifiedDate, isnull(LogoUrl,'') as LogoUrl
        , IsTenantSignOff, DBServer, DBUserName, DBPassword, DBServerName, isActive, CurrencyID,IsCallCenterSupport, Comment from  ${req.scope}.Tenant where TenantID= ${TenantID} `, function (data, err) {
        if (err) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            var tenantData = data;
            var to_json = require('xmljson').to_json;
            to_json(tenantData[0].XMLData, function (error, result) {
                tenantData[0]['jsondata']=result;
                console.dir(result);
            });

            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(tenantData));

        }
        res.end();


    });
});

router.post('/TenantFTP', function (req, res) {
    var connection = new sql.Connection(AdminDBConfig.AdminConfig);
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        var actionSP = "usp_TenantFTP_Post";
        request.input('TenantID', sql.Int, req.body[0].tenantID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.input('FTPData', sql.NVarChar(sql.MAX), req.body[0].tenantFTP);
        request.input('Tenant', sql.NVarChar(sql.MAX), JSON.stringify(req.body[0].tenant));
        request.execute(actionSP, function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, actionSP, JSON.stringify(request.parameters), req);
                res.send({ error: err });
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

router.post('/UpdateTenantDatabase', function (req, res) {
    var TenantConfig = {
        user: req.body[0].tenant.DBUserName,
        password: req.body[0].tenant.DBPassword,
        server: req.body[0].tenant.DBServerName,
        database: req.body[0].tenant.DBServer,
        requestTimeout: 3000000,
        connectTimeout: 15000000,
        options: {
            encrypt: true, // Use this if you're on Windows Azure
            connectTimeout: 15000000,
            requestTimeout: 3000000,
        }
    }
    var connection = new sql.Connection(TenantConfig);    
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        var actionSP = "usp_UpdateTenant";     
        request.input('isActive', sql.Bit, req.body[0].Tenantrawdata.IsUserActivated);   
        request.input('IsInvoiceGeneration', sql.Bit, req.body[0].tenant.IsInvoiceGeneration);
        request.input('password', sql.VarChar(100), req.body[0].Tenantrawdata.password);
        request.input('username', sql.VarChar(100), req.body[0].Tenantrawdata.username);
        request.execute(actionSP, function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, actionSP, JSON.stringify(request.parameters), req);
                res.send({ error: err });
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

router.post('/approve', function (req, res) {
    var connection = new sql.Connection(AdminDBConfig.AdminConfig);
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        var actionSP = "usp_ApproveTenant";
        request.input('TenantID', sql.Int, req.body[0].tenant.TenantID);
        request.input('Approve', sql.Bit, req.body[0].tenant.IsTenantSignOff == false ? 0 : 1);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.input('Comment', sql.NVarChar(sql.MAX), req.body[0].tenant.Comment);
        request.input('IsPaymentReceive', sql.NVarChar(sql.MAX), req.body[0].tenant.IsPaymentReceive);
        request.execute(actionSP, function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, actionSP, JSON.stringify(request.parameters), req);
                res.send({ error: err });
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
module.exports = router;