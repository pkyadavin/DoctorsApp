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
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('TotalCount', sql.Int);
        request.execute('usp_RMAActionCode_GetAll', function (err, recordsets, returnValue) {     
            if (err) {
                Error.ErrorLog(err, "usp_RMAActionCode_GetAll", JSON.stringify(request.parameters), req);
            }    
        res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
        console.dir(recordsets);
        console.dir(request.parameters.TotalCount.value);
        connection.close();
        })
    });
});



router.get('/:rmaactioncodeid', function (req, res) {  
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('RMAActionCodeId', sql.Int, req.params.rmaactioncodeid);
        request.execute('usp_RMAActionCode_GetById', function (err, recordsets, returnValue) {   
            if (err) {
                Error.ErrorLog(err, "usp_RMAActionCode_GetById", JSON.stringify(request.parameters), req);
            }          
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});
router.post('/:UserId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);     
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.input('UserId', sql.Int, req.params.UserId);
        request.output('result', sql.VarChar(20));
        request.execute('usp_RMAActionCode_SaveDetail', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_RMAActionCode_SaveDetail", JSON.stringify(request.parameters), req);
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

router.get('/AllTypeLookUp/:rmaactioncodeId', function (req, res) {
    db.executeSql(req,"select TypeLookUpID,TypeCode,TypeName from TypeLookUp", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "select TypeLookUpID,TypeCode,TypeName from TypeLookUp", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/loadByRMAItemRMATypeID/:id', function (req, res) {   
    db.executeSql(req,'select RMAActionCodeID,RMAActionCode,RMAActionName from rmaactioncode where rmaactioncodeid in (select rmaactioncodeid from RMAActionCodeMap where ParentActionCodeID=' + req.params.id + ')', function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'select RMAActionCodeID,RMAActionCode,RMAActionName from rmaactioncode where rmaactioncodeid in (select rmaactioncodeid from RMAActionCodeMap where ParentActionCodeID=' + req.params.id + ')', "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});


router.get('/loadByRMATypeID/:id', function (req, res) {
    db.executeSql(req,'select RMAActionTypeID from RMAActionCode where RMAActionCodeID in (select ParentActionCodeID from RMAActionCodeMap where ParentActionCodeID =( select RMAActionCodeID from RMAActionCode where RMAActionCodeID= ' + req.params.id +') )', function (data, err) {

        if (err) {
            Error.ErrorLog(err, 'select RMAActionTypeID from RMAActionCode where RMAActionCodeID in (select ParentActionCodeID from RMAActionCodeMap where ParentActionCodeID =( select RMAActionCodeID from RMAActionCode where RMAActionCodeID= ' + req.params.id + ') )', "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});



router.get('/AvailableRMATab/:Id/:rid', function (req, res) {
    var sql = 'select RMAActionCodeID,RMAActionCode,RMAActionName from rmaactioncode where rmaactiontypeid = ' + req.params.Id + 'and RMAActionCodeID not in (select RMAActionCodeID from rmaactioncode where rmaactioncodeid in (select rmaactioncodeid from RMAActionCodeMap where ParentActionCodeID=' + req.params.rid + ') )';
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

//for sku grid 
router.get('/AllSKU', function (req, res) {
    var itemmasterid = req.params.ItemMasterId;
    db.executeSql(req, "select ItemSKUID,SKUName,SKUNumber,SKUDescription ,Price  from ItemSKU ", function (data, err) {

        if (err) {
            Error.ErrorLog(err, "select ItemSKUID,SKUName,SKUNumber,SKUDescription ,Price  from ItemSKU ", "", req);
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
 
    var sql = "select im.ItemMasterID, ItemName, ItemDescription, SKUCode, EANCode, ItemDiscountPC, ItemPrice, im.IsActive, imb1.RMAActionModelMapID from ItemMaster im inner join rmaactionmodelmap imb1 on imb1.SKUItemMasterID = im.ItemMasterID where imb1.RMAActionCodeID = " + itemmasterid;
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


router.get('/sku/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:Paramdata', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
       
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
     
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        var para = req.params.Paramdata;
        if (para != 'undefined') {
            request.input("Paramdata", sql.VarChar(1000), para);
        }
        else {
            request.input("Paramdata", sql.VarChar(1000), 'null');
        }
        request.output('TotalCount', sql.Int);
        request.execute('GetSKUItemMasterByPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetSKUItemMasterByPaging", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
        })
    });
});

module.exports = router;
