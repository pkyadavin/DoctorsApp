
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
        request.output('TotalCount', sql.Int);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.execute('GetUOMWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetUOMWithPaging", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            connection.close();
        })
    });
});
router.get('/GetUOMData/:UOMID', function (req, res) {
    var uomid = req.params.UOMID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('UOMID', sql.Int, uomid);
        request.execute('GetUOMByUOMID', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetUOMByUOMID", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
            connection.close();
        })

    });
});

//Save

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {        
        var request = new sql.Request(connection);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_SaveUOM', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_SaveUOM", JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});

//Update
router.put('/:UOMID', function (req, res) {
    var uomId = req.params.UOMID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('UOMID', sql.Int, uomId);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_UpdateUOMByUOMID', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_UpdateUOMByUOMID", JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});

router.get('/UOMTypes/:id', function (req, res) {
    db.executeSql(req, 'select tl.typelookupid ,uo.UOMID,uo.UOMCode,uo.UOMName,uo.UOMTypeID from uommaster uo inner join typelookup tl on uo.UOMTypeID=tl.typelookupid where uo.UOMID=' + req.params.id + ')', function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'select tl.typelookupid ,uo.UOMID,uo.UOMCode,uo.UOMName,uo.UOMTypeID from uommaster uo inner join typelookup tl on uo.UOMTypeID=tl.typelookupid where uo.UOMID=' + req.params.id + ')', "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});


module.exports = router;







