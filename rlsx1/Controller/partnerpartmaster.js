
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("PartnerId", sql.VarChar(1000), req.params.PartnerId);
        request.output('TotalCount', sql.Int);
        request.execute('GetPartnerPartMasterPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetPartnerPartMasterPaging", JSON.stringify(request.parameters), req);
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
        request.execute('GetPartnerPartMasterByItemMasterId', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetPartnerPartMasterByItemMasterId", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
            connection.close();
        })

    });
});

router.put('/:ItemMasterPartnerMapID', function (req, res) {
    var itemmasterId = req.params.ItemMasterPartnerMapID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        var chk = JSON.stringify(req.body);
        request.input('ItemMasterId', sql.Int, req.body.ItemMasterID);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_UpdatePartnerMasterByItemMasterId', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_UpdatePartnerMasterByItemMasterId", JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});




router.post('/', function (req, res) {
    var itemmasterId = req.params.ItemMasterID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_SaveModelMaster', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_SaveModelMaster", JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});

router.get('/AllManufacturer', function (req, res) {
    db.executeSql(req,"select ManufacturerID,ManufacturerName from Manufacturer", function (data, err) {

        if (err) {
            Error.ErrorLog(err, "select ManufacturerID,ManufacturerName from Manufacturer", JSON.stringify(request.parameters), req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();

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
                Error.ErrorLog(err, "usp_UpdateModelMasterByItemMasterId", "", req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});

router.get('/AllColors', function (req, res) {
    db.executeSql(req,"select ColorID,ColorName from color", function (data, err) {

        if (err) {
            Error.ErrorLog(err, "select ColorID,ColorName from color", "", req);
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

router.get('/AllUnits', function (req, res) {
    db.executeSql(req,"select UOMID,UOMName  from UOMMaster", function (data, err) {

        if (err) {
            Error.ErrorLog(err, "select UOMID,UOMName  from UOMMaster", "", req);
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
    db.executeSql(req,"select itm.SKUID,SKUName,Price, SKUDescription  from ItemMasterSKU itm inner join ItemSKU sk" +
" on sk.ItemSKUID = itm.SKUID  where itm.ItemMasterID =" + itemmasterid, function (data, err) {

            if (err) {
                Error.ErrorLog(err, "select itm.SKUID,SKUName,Price, SKUDescription  from ItemMasterSKU itm inner join ItemSKU sk" +
                    " on sk.ItemSKUID = itm.SKUID  where itm.ItemMasterID =" + itemmasterid, "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {

                res.write(JSON.stringify(data));
            }
            res.end();

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

router.delete('/RemovePartnerPart/:ID', function (req, res) {
    var id = req.params.ID;

    db.executeSql(req, 'delete from ItemMasterPartnerMap where ItemMasterPartnerMapID =' + id, function (err, data) {
        if (err) {
            Error.ErrorLog(err, 'delete from ItemMasterPartnerMap where ItemMasterPartnerMapID =' + id, "", req);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else if (data == undefined) {

            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Deleted" }));

        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Reference" }));
        }
        res.end();
    })
});








module.exports = router;







