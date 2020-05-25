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
        request.output('TotalCount', sql.Int);
        request.execute('usp_BoxDimension_GetAll', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_BoxDimension_GetAll', JSON.stringify(request.parameters), req);
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
        request.execute('usp_BoxDimension_GetById', function (err, recordsets, returnValue) {    
            if (err) {
                Error.ErrorLog(err, 'usp_BoxDimension_GetById', JSON.stringify(request.parameters), req);
            }       
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.get('/WeightUOMs/typelookup/:typename/:id', function (req, res) {    
    var typename = req.params.typename;
    var sql = "SELECT  um.UOMName,um.UOMID,um.UOMCode,um.UOMTypeID,tl.TypeLookUpID,tl.[TypeCode],tl.[TypeName],tl.[TypeGroup] FROM [TypeLookUp] tl inner join UOMMaster um on um.UOMTypeID=tl.Typelookupid where tl.IsActive = 1 and tl.Typelookupid=624 and tl.typegroup ='UOMType'";
   
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


router.get('/WHLUOMs/:id', function (req, res) {
    var boxdimensionid = req.params.id;
    var sql = "SELECT  um.UOMName,um.UOMID,um.UOMCode,um.UOMTypeID,tl.TypeLookUpID,tl.[TypeCode],tl.[TypeName],tl.[TypeGroup] FROM [TypeLookUp] tl inner join UOMMaster um on um.UOMTypeID=tl.Typelookupid where tl.IsActive = 1 and tl.Typelookupid=625 and tl.typegroup ='UOMType'";

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

router.post('/:UserId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.input('UserId', sql.Int, req.params.UserId);
        request.output('result', sql.VarChar(20));
        request.execute('usp_BoxDimension_SaveDetail', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_BoxDimension_SaveDetail', JSON.stringify(request.parameters), req);
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

router.delete('/DeleteRow/:BoxDimensonId', function (req, res) {
    var boxdimensionid = req.params.BoxDimensonId;
    var sql = 'DELETE FROM BOXDIMENSION WHERE BOXDIMENSIONID=' + boxdimensionid;
    db.executeSql(req, sql, function (data, err) {
       if (err) {
           Error.ErrorLog(err, 'DELETE FROM BOXDIMENSION WHERE BOXDIMENSIONID=' + req.params.BoxDimensonId + ')', "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

module.exports = router;
