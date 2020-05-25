var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var helper = require('../UtilityLib/BlobHelper');
var multer = require('multer');
var upload = multer({ dest: '../Uploads/' })
var Error = require('../shared/ErrorLog');

router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:status/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("status", sql.Int, req.params.status);
        request.input("PartnerID", sql.VarChar(1000), req.params.PartnerID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('TotalCount', sql.Int);
        request.execute('GetModelPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetModelPaging', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
        })
    });
});
router.get('/GetModelData/:ModelID', function (req, res) {
    var modelid = req.params.ModelID;
    var connection = new sql.Connection(settings.DBconfig(req));    
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ModelID', sql.Int, modelid);
        request.execute('GetModelByModelId', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetModelByModelId', JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            connection.close();
        })

    });
});

router.get('/GetSKUData/:SKUID', function (req, res) {
    var skuiD = req.params.SKUID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('SKUID', sql.Int, skuiD);
        request.execute('GetSKUBySKUId', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetSKUBySKUId', JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            connection.close();
        })
    });
});


router.get('/GetItemSKUData/:ItemModelID', function (req, res) {
    var itemModelID = req.params.ItemModelID;
    db.executeSql(req,"select im.ItemMasterID,ItemName,ItemDescription, SKUCode,EANCode,ItemDiscountPC,ItemPrice,im.IsActive from ItemMaster im inner join ItemModel " +
        " imb1 on im.ItemModelID=imb1.ItemModelID  where imb1.ItemModelID =" + itemModelID, function (data, err) {

            if (err) {
                Error.ErrorLog(err, "select im.ItemMasterID,ItemName,ItemDescription, SKUCode,EANCode,ItemDiscountPC,ItemPrice,im.IsActive from ItemMaster im inner join ItemModel " +
                    " imb1 on im.ItemModelID=imb1.ItemModelID  where imb1.ItemModelID =" + itemModelID, "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {

                res.write(JSON.stringify(data));
            }
            res.end();
          

        });
});


router.get('/GetItemAccessories/:ItemModelID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('ItemModelID', sql.VarChar(20), req.params.ItemModelID);
        request.execute('usp_GetItemModelAccessory', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetItemModelAccessory", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            connection.close();
        })
    });
});

router.get('/GetModelDamaged/:ItemModelID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('ItemModelID', sql.VarChar(20), req.params.ItemModelID);
        request.execute('usp_GetItemModelDamaged', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetItemModelDamaged", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            connection.close();
        })
    });
});

router.get('/GetAllSKUs/:ModelID', function (req, res) {
    var modelID = req.params.ModelID;

    db.executeSql(req,"select ItemSKUID as SKUID,ModelID, SKUName,SKUDescription,Price,IsActive from ItemSKU  where ModelID=" + modelID, function (data, err) {

        if (err) {
            Error.ErrorLog(err, "select ItemSKUID as SKUID,ModelID, SKUName,SKUDescription,Price,IsActive from ItemSKU  where ModelID=" + modelID, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();

    });
});


router.get('/AllCategory', function (req, res) {
    db.executeSql(req,"select ItemCategoryID as CategoryID ,CategoryName  from ItemCategory", function (data, err) {

        if (err) {
            Error.ErrorLog(err, "select ItemCategoryID as CategoryID ,CategoryName  from ItemCategory", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();

    });
});

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    var str = JSON.stringify(req.body);
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_SaveModel', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'usp_SaveModel', JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});

router.post('/CreateSKU', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_SaveSKU', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'usp_SaveSKU', JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});



router.put('/:ModelID', function (req, res) {
    var modelId = req.params.ModelID;
    var str = JSON.stringify(req.body);
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ModelID', sql.Int, modelId);
        request.input('Alldata', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_UpdateModelByModelId', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'usp_UpdateModelByModelId', JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});

var uUpload = upload.fields([{ name: 'SRODocs', maxCount: 1 }])
router.post('/doc', uUpload, function (req, res) {
    helper.uploadFile('sro-files', req.files['SRODocs'][0], function (error1, result1) {
        if (!error1) {
            var output = { result: 'Success', FileName: req.files['SRODocs'][0].originalname, FileUrl: result1, SystemGenName: result1.substring(result1.lastIndexOf('/')) };
            res.send(JSON.stringify(output));
        }
        else {
            res.send({ error: err });
        }
    });
});

router.put('/UpdateSKU/:SKUID', function (req, res) {
    var skuID = req.params.SKUID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('SKUID', sql.Int, skuID);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_UpdateSKUBySKUId', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'usp_UpdateSKUBySKUId', JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});


router.delete('/:skuid', function (req, res) {
    var skuid = req.params.skuid;
    db.executeSql(req,'delete from  ItemSKU where ItemSKUID=' + skuid, function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'delete from  ItemSKU where ItemSKUID=' + skuid,"", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/ReasonRule/:ItemModelId', function (req, res) {
    var ItemModelId = req.params.ItemModelId;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ItemModelID', sql.Int, ItemModelId);
        request.execute('usp_ItemModel_ReasonRuleMapping', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_ItemModel_ReasonRuleMapping", JSON.stringify(request.parameters), req);
                res.write(JSON.stringify({ recordsets: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets });
            }
            res.end();
            connection.close();
        });
    });
});

router.get('/GetModuleControlValue', function (req, res) {    
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);        
        request.execute('usp_GetModuleControlValue', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_GetModuleControlValue', JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            connection.close();
        })
    });
});

router.delete('/RemoveModel/:ID', function (req, res) {
    var id = req.params.ID;

    db.executeSql(req, 'delete from ItemModel where ItemModelID =' + id, function (err, data) {
        if (err) {
            Error.ErrorLog(err, 'delete from ItemModel where ItemModelID =' + id, req);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else if (data == undefined) {

            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Deleted" }));//request.parameters.rid.value

        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Reference" }));//request.parameters.rid.value
        }
        res.end();
    })
});


module.exports = router;







