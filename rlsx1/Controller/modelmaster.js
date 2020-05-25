var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
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
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('TotalCount', sql.Int);
        request.execute('GetModelMasterPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetModelMasterPaging', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            connection.close();
        })
    });
});

router.get('/GetModelData/:ItemMasterId', function (req, res) {
    var itemmasterid = req.params.ItemMasterId;
    var connection = new sql.Connection(settings.DBconfig(req));    
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ItemMasterId', sql.Int, itemmasterid);
        request.execute('GetModelMasterByItemMasterId', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetModelMasterByItemMasterId', JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            connection.close();
        })

    });
});

router.get('/AllManufacturer', function (req, res) {
    db.executeSql(req,"select ManufacturerID,ManufacturerName from Manufacturer  where IsActive=1", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "select ManufacturerID,ManufacturerName from Manufacturer  where IsActive=1","", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();

    });
});

router.post('/', function (req, res) {
    var itemmasterId = req.params.ItemMasterID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_SaveModelMaster', function (err, recordsets) {
            if (err) {
                alert(err);
                alert(JSON.stringify(request.parameters));
                alert(req);
                Error.ErrorLog(err, 'usp_SaveModelMaster', JSON.stringify(request.parameters), req);
            }            
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});

router.post('/itemImage', function (req, res) {    
    var itemmasterId = req.params.ItemMasterID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);  
        request.input('UserId', sql.Int, req.userlogininfo.UserID);     
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_SaveModelMasterImage', function (err, recordsets) {
            if (err) {
                alert(err);
                alert(JSON.stringify(request.parameters));
                alert(req);
                Error.ErrorLog(err, 'usp_SaveModelMasterImage', JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});

router.put('/:ItemMasterID', function (req, res) {
    var itemmasterId = req.params.ItemMasterID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ItemMasterId', sql.Int, req.body.ItemMasterID);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_UpdateModelMasterByItemMasterId', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'usp_UpdateModelMasterByItemMasterId', JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});

router.put('/UpdateImage/:ItemArtifactID/:ItemMasterID/:IsDefault', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ItemArtifactID', sql.Int, req.params.ItemArtifactID);
        request.input('ItemMasterID', sql.Int, req.params.ItemMasterID);
        request.input('IsDefault', sql.VarChar(50), req.params.IsDefault);
        request.output('result', sql.VarChar(5000));        
        request.execute('usp_UpdateItemImage', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'usp_UpdateItemImage', JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});

router.put('/DeleteItemImage/:ItemMasterID/:ItemArtifactID', function (req, res) {
   
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ItemMasterID', sql.Int, req.params.ItemMasterID);
        request.input('ItemArtifactID', sql.Int, req.params.ItemArtifactID);         
        request.output('result', sql.VarChar(5000));
        request.execute('usp_DeleteItemImage', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'usp_DeleteItemImage', JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});

router.post('/import/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));

    var jsonData = req.body;

    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(jsonData));
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LoginPartnerID', sql.Int, 4);
        request.output('result', sql.NVarChar(500));
        request.execute('usp_import_ItemMaster', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_import_ItemMaster", JSON.stringify(request.parameters), req);
            }
            console.dir(request.parameters.result.value);
            res.send({ result: request.parameters.result.value });
            connection.close();
        });
    });
});

router.get('/AllColors', function (req, res) {
    db.executeSql(req,"select ColorID,ColorName from color  where IsActive=1", function (data, err) {

        if (err) {
            Error.ErrorLog(err, "select ColorID,ColorName from color  where IsActive=1", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();

    });
});

router.get('/AllReceiveType', function (req, res) {
    db.executeSql(req,"select TypelookUpId as ItemReceiveTypeID,TypeName from TypelookUp  where typegroup='ItemReceiveType' ", function (data, err) {

        if (err) {
            Error.ErrorLog(err, "select TypelookUpId as ItemReceiveTypeID,TypeName from TypelookUp  where typegroup='ItemReceiveType' ", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();

    });
});

router.get('/AllReturnType', function (req, res) {
    db.executeSql(req, "select TypelookUpId as ItemReturnTypeID,TypeName from TypelookUp  where typegroup='ItemReturnType' ", function (data, err) {

        if (err) {
            Error.ErrorLog(err, "select TypelookUpId as ItemReturnTypeID,TypeName from TypelookUp  where typegroup='ItemReturnType' ", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();

    });
});

router.get('/AllModels', function (req, res) {
    db.executeSql(req,"select ItemModelID,ModelName from ItemModel  where IsActive=1", function (data, err) {

        if (err) {
            Error.ErrorLog(err, "select ItemModelID,ModelName from ItemModel  where IsActive=1", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();

    });
});



router.get('/AllUnits', function (req, res) {
    db.executeSql(req,"select UOMID,UOMName  from UOMMaster  where IsActive=1", function (data, err) {

        if (err) {
            Error.ErrorLog(err, "select UOMID,UOMName  from UOMMaster  where IsActive=1", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();

    });
});
router.get('/AllSKU', function (req, res) {
    var itemmasterid = req.params.ItemMasterId;
    db.executeSql(req,"select ItemSKUID,SKUName, SKUDescription ,Price  from ItemSKU ", function (data, err) {

            if (err) {
                Error.ErrorLog(err, "select ItemSKUID,SKUName, SKUDescription ,Price  from ItemSKU ", "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {

                res.write(JSON.stringify(data));
            }
            res.end();

        });
});

router.get('/AllSKUs/:ItemMasterId', function (req, res) {
    var itemmasterid = req.params.ItemMasterId;
    db.executeSql(req,"select ItemSKUID,SKUName, SKUDescription ,Price  from ItemSKU "
        + "  where ItemSKUID not in (Select SKUID from ItemMasterSKU  where ItemMasterId=" + itemmasterid +" )", function (data, err) {

        if (err) {
            Error.ErrorLog(err, "select ItemSKUID,SKUName, SKUDescription ,Price  from ItemSKU "
                + "  where ItemSKUID not in (Select SKUID from ItemMasterSKU  where ItemMasterId=" + itemmasterid + " )", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();

    });
});


router.get('/GetItemSKUData/:ItemMasterId', function (req, res) {
    var itemmasterid = req.params.ItemMasterId;

    db.executeSql(req,"select im.ItemMasterID,ItemName,ItemDescription, SKUCode,EANCode,ItemDiscountPC,ItemPrice,im.IsActive,imb1.Quantity from ItemMaster im inner join ItemMasterBOM " +
        " imb1 on im.ItemMasterID=imb1.ItemMasterID  where imb1.ParentMasterID =" + itemmasterid, function (data, err) {

            if (err) {
                Error.ErrorLog(err, "select im.ItemMasterID,ItemName,ItemDescription, SKUCode,EANCode,ItemDiscountPC,ItemPrice,im.IsActive,imb1.Quantity from ItemMaster im inner join ItemMasterBOM " +
                    " imb1 on im.ItemMasterID=imb1.ItemMasterID  where imb1.ParentMasterID =" + itemmasterid, "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {

                res.write(JSON.stringify(data));
            }
            res.end();

        });
});


router.get('/GetItemImageData/:ItemMasterId', function (req, res) {
    var itemmasterid = req.params.ItemMasterId;

    db.executeSql(req, "SELECT I.ItemArtifactID, A.FileName, A.ArtifactURL AS 'FileUrl', CASE WHEN I.isDefault= 1 THEN 'True' ELSE 'False' END AS 'isDefault', REVERSE(LEFT(REVERSE(A.FileName),CHARINDEX('.',REVERSE(A.FileName))-1)) AS 'FileType' FROM ItemArtifactMap I INNER JOIN Artifact A ON I.ArtifactID = A.ArtifactID WHERE I.ItemMasterID = " + itemmasterid +" ORDER BY FileName", function (data, err) {

            if (err) {
                Error.ErrorLog(err, "SELECT I.ItemArtifactID, A.FileName, A.ArtifactURL AS 'FileUrl', CASE WHEN I.isDefault= 1 THEN 'True' ELSE 'False' END AS 'isDefault', REVERSE(LEFT(REVERSE(A.FileName),CHARINDEX('.',REVERSE(A.FileName))-1)) AS 'FileType' FROM ItemArtifactMap I INNER JOIN Artifact A ON I.ArtifactID = A.ArtifactID WHERE I.ItemMasterID = " + itemmasterid +" ORDER BY FileName", "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {

                res.write(JSON.stringify(data));
            }
            res.end();

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

router.get('/GetItemMasterTypeData/:ItemMasterId', function (req, res) {
    var itemmasterid = req.params.ItemMasterId;
    db.executeSql(req,"Select itm.ItemMasterTypeMapID,itm.TypeLookUpID, tl.TypeCode,tl.TypeName,itm.SafetyStockQty from ItemMasterTypeMap " +
        "itm inner join TypeLookUp tl on tl.TypeLookUpID = itm.TypeLookUpID where ItemMasterID="
        + itemmasterid, function (data, err) {

            if (err) {
                Error.ErrorLog(err, "Select itm.ItemMasterTypeMapID,itm.TypeLookUpID, tl.TypeCode,tl.TypeName,itm.SafetyStockQty from ItemMasterTypeMap " +
                    "itm inner join TypeLookUp tl on tl.TypeLookUpID = itm.TypeLookUpID where ItemMasterID="
                    + itemmasterid, "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {

                res.write(JSON.stringify(data));
            }
            res.end();

        });
});

router.get('/AllTypeLookUps/:ItemMasterId', function (req, res) {
    var itemmasterid = req.params.ItemMasterId;
    db.executeSql(req,"select TypeLookUpID , TypeCode, TypeName,'0' SafetyStockQty   from TypeLookUp "
        + "  where TypeGroup='ItemMaster' and TypeLookUpID not in (Select TypeLookUpID from ItemMasterTypeMap  where ItemMasterId=" + itemmasterid + " )", function (data, err) {

            if (err) {
                Error.ErrorLog(err, "select TypeLookUpID , TypeCode, TypeName,'0' SafetyStockQty   from TypeLookUp "
                    + "  where TypeGroup='ItemMaster' and TypeLookUpID not in (Select TypeLookUpID from ItemMasterTypeMap  where ItemMasterId=" + itemmasterid + " )", "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {

                res.write(JSON.stringify(data));
            }
            res.end();

        });
});
router.get('/AllTypeLookUp', function (req, res) {
    db.executeSql(req,"select TypeLookUpID ,TypeCode, TypeName,'0' SafetyStockQty   from TypeLookUp "
        + "  where TypeGroup='ItemMaster'", function (data, err) {

        if (err) {
            Error.ErrorLog(err, "select TypeLookUpID ,TypeCode, TypeName,'0' SafetyStockQty   from TypeLookUp "
                + "  where TypeGroup='ItemMaster'", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();

    });
});


router.get('/GetItemInfoBySerialNumber/:SNo', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('SerialNumber',sql.VarChar(20), req.params.SNo);
        request.execute('GetItemInfoBySerialNumber', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetItemInfoBySerialNumber", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            connection.close();
        })
    });
});

router.delete('/:ID', function (req, res) {
    db.executeSql(req, "DELETE FROM ItemMaster WHERE ItemMasterID =" + req.params.ID, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "DELETE FROM ItemMaster WHERE ItemMasterID =" + req.params.ID, "", req);
            res.send({ error: err });
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(res.statusCode.toString());
        }
        res.end();
    });
});

module.exports = router;







