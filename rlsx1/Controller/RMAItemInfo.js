var express = require('express');
var router = express.Router();
var sql = require('mssql');
var dbHelper = require('../shared/DBAccess');
var dbSettings = require('../shared/Settings');
var helper = require('../UtilityLib/BlobHelper');
var multer = require('multer');
var upload = multer({ dest: '../Uploads/' })
var Error = require('../shared/ErrorLog');
//get
router.get('/', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('search', sql.VarChar(2000), request.query.FilterValue);
        sqlRequest.input('StartIndex', sql.Int, request.query.StartIndex);
        sqlRequest.input('PageSize', sql.Int, request.query.PageSize);
        sqlRequest.input('SortCol', sql.VarChar(100), request.query.SortColumn);
        sqlRequest.input('SortOrder', sql.VarChar(4), request.query.SortDirection);
        sqlRequest.input('TypeLookupCode', sql.VarChar(20), request.query.typeLookUpCode);
        sqlRequest.input('PartnerID', sql.Int, request.query.PartnerID);
        sqlRequest.output('TotalCount', sql.Int);

        sqlRequest.execute('usp_GetRMAItemInfowithPaging', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "usp_GetRMAItemInfowithPaging", JSON.stringify(sqlRequest.parameters), request);
            }
            response.send({ recordsets: recordsets, totalcount: sqlRequest.parameters.TotalCount.value })
            console.dir(recordsets);
            connection.close();
        })


    });
});

router.get('/get/:key', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('key', sql.Int, request.params.key);

        sqlRequest.execute('usp_GetRMAItemInfoByKey', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "usp_GetRMAItemInfowithPaging", JSON.stringify(sqlRequest.parameters), request);
            }
            response.send(recordsets);
            console.dir(recordsets);
            connection.close();
        })


    });
});

router.get('/SKUs/:typeCode', function (request, response) {
    var TypeCode = request.params.typeCode;
    var sqlquery = "select sku.ItemMasterID as ItemSKUID, sku.ExtWarrantyDays,sku.ItemNumber as SKUName,m.ModelName,ic.CategoryName,mfr.ManufacturerName from ItemMaster sku inner join ItemModel m on m.ItemModelID = sku.ItemModelID inner join ItemCategory ic  on ic.ItemCategoryId = m.ItemCategoryId inner join  Manufacturer mfr on mfr.ManufacturerId = sku.ManufacturerId inner join ItemMasterTypeMap on sku.ItemMasterID = ItemMasterTypeMap.ItemMasterID";
    if (TypeCode != "null")
        sqlquery += " Where ItemMasterTypeMap.TypeLookUpId = (Select TypeLookUpID from TypeLookUp where TypeCode= '" + TypeCode + "')";
    dbHelper.executeSql(request, sqlquery, function (data, err) {
        if (err) {
            Error.ErrorLog(err, sqlquery,"", request);
            response.writeHead(200, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.write(JSON.stringify(data));
        }
        response.end();

    });
});

router.get('/Customers', function (request, response) {
    dbHelper.executeSql(request,"select CustomerId, FirstName+' '+LastName as 'Customer' from Customer", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "select CustomerId, FirstName+' '+LastName as 'Customer' from Customer", "", request);
            response.writeHead(200, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.write(JSON.stringify(data));
        }
        response.end();

    });
});

router.get('/GetDetails/:SerialNumber', function (request, response) {
    var SerialNumber = request.params.SerialNumber;
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function (error) {
        var sqlRequest = new sql.Request(connection);
        console.dir(JSON.stringify(request.body));
        var chk = JSON.stringify(request.body);
        sqlRequest.input('SerialNumber', sql.NVarChar(50), SerialNumber);
        sqlRequest.execute('[dbo].GetTenantInfoBySerialNumber', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "[dbo].GetTenantInfoBySerialNumber", JSON.stringify(sqlRequest.parameters), request);
                response.send({ error: err });
            }
            else {
                response.send({ recordsets: recordsets });
            }
            response.end();
            connection.close();
        })
    });
   
});

var uUpload = upload.fields([{ name: 'DeviceDocs', maxCount: 1 }])
router.post('/doc', uUpload, function (req, res) {
    helper.uploadFile('consumer-files', req.files['DeviceDocs'][0], function (error1, result1) {
        if (!error1) {
            res.send({ Artifact: result1 });
        }
    });
});
router.post('/', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function (error) {
        var sqlRequest = new sql.Request(connection);
        sqlRequest.input('in_model', sql.NVarChar(sql.MAX), JSON.stringify(request.body));
        sqlRequest.input('token', sql.NVarChar(sql.MAX), request.token);
        sqlRequest.execute('usp_SaveRMAItemInfo', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_SaveRMAItemInfo", JSON.stringify(sqlRequest.parameters), request);
                response.send({ error: err });
            }
            else {
                response.writeHead(200, { "Content-Type": "application/json" });
                response.write(response.statusCode.toString());
            }
            response.end();
            connection.close();
        })
    });
});

module.exports = router;

