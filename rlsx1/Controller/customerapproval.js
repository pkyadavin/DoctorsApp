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
        request.input("PartnerID", sql.VarChar(1000), req.params.PartnerID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('TotalCount', sql.Int);
        request.execute('usp_CustomerApproval_GetAll', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_CustomerApproval_GetAll', JSON.stringify(request.parameters), req);
            }        
        res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
        console.dir(recordsets);
        console.dir(request.parameters.TotalCount.value);
        connection.close();
        })
    });
});



router.get('/:customerid', function (req, res) {  
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('CPCustomerId', sql.Int, req.params.customerid);
        request.execute('usp_CustomerApproval_GetById', function (err, recordsets, returnValue) {    
            if (err) {
                Error.ErrorLog(err, 'usp_CustomerApproval_GetById', JSON.stringify(request.parameters), req);
            }       
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});



router.get('/typelookupDeliveryMethod/:typename', function (req, res) {
    var typename = req.params.typename;    
    var sql = "SELECT TypeLookUpID ,[TypeCode] ,[TypeName], [TypeGroup] FROM [TypeLookUp] where IsActive = 1 and typegroup = '" + typename + "'";
    db.executeSql(req,sql, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT TypeLookUpID ,[TypeCode] ,[TypeName], [TypeGroup] FROM [TypeLookUp] where IsActive = 1 and typegroup = '" + typename + "'","", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/typelookupContactMethod/:typename', function (req, res) {
    var typename = req.params.typename;
    var sql = "SELECT TypeLookUpID ,[TypeCode] ,[TypeName], [TypeGroup] FROM [TypeLookUp] where IsActive = 1 and typegroup = '" + typename + "'";
    db.executeSql(req, sql, function (data, err) {
        if (err) {
            Error.ErrorLog(err, sql, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/countries/:id', function (req, res) {
    var id = req.params.id;
    var sql = "Select cn.CountryID,cn.CountryCode,cn.CountryName,st.StateID from Country cn inner join  State st on st.CountryID=cn.CountryID inner join  cpcustomer cpc on cpc.StateID=st.StateID where cpc.CustomerID=" + id;

    db.executeSql(req, sql, function (data, err) {
        if (err) {
            Error.ErrorLog(err, sql, "", req);
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

router.get('/states/:id', function (req, res) {
    var id = req.params.id;
    var sql = "select st.StateID,st.StateName,st.StateCode,st.CountryID from State st inner join CPCustomer cpc on cpc.StateID=st.StateID where cpc.CustomerID=" + id;

    db.executeSql(req, sql, function (data, err) {
        if (err) {
            Error.ErrorLog(err, sql, "", req);
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


router.get('/partners/:id', function (req, res) {
    var id = req.params.id;
    var sql = "select PartnerID,PartnerCode,PartnerName from Partners where IsActive=1 and PartnerTypeID = 542";

    db.executeSql(req, sql, function (data, err) {
        if (err) {
            Error.ErrorLog(err, sql, "", req);
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
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.VarChar(20));
        request.execute('usp_CustomerApproval_SaveDetail', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_CustomerApproval_SaveDetail', JSON.stringify(request.parameters), req);
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

router.post('/Rejected', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.VarChar(20));
        request.execute('usp_CustomerRejected', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_CustomerRejected', JSON.stringify(request.parameters), req);
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
