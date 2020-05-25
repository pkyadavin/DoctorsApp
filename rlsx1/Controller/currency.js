var express = require('express');
var router = express.Router();
var settings = require('../shared/Settings');
/* GET users listing. */
var sql = require('mssql');
var Error = require('../shared/ErrorLog');
var db = require('../shared/DBAccess');

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
        request.execute('GetCurrencyWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetCurrencyWithPaging', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
        })
    });
});


router.get('/:CurrencyID', function (req, res) {
    var currencyId = req.params.CurrencyID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('CurrencyId', sql.Int, currencyId);
        request.execute('GetCurrencyById', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetCurrencyById', JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
        })
    });
});


router.post('/', function (req, res) {
    db.executeSql(req,"insert into Currency (CurrencyCode, CurrencyName, CurrencySymbol, DollarExchangeRate, CountryID, IsActive, CreatedBy, CreatedDate, ModifyBy, ModifyDate) "+
        "values('" + req.body.CurrencyCode + "', '" + req.body.CurrencyName + "', '" + req.body.CurrencySymbol + "', " + req.body.DollarExchangeRate + ", " + req.body.CountryID + ", " + ~~(req.body.IsActive) + ",  " + req.body.CreatedBy + ", GETUTCDATE(), " + req.body.ModifyBy +", GETUTCDATE())", 
        function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write({ data: 0 });
        }
        res.end();
    });
});

router.put('/:CurrencyID', function (req, res) {
    var currencyID = req.params.CurrencyID;
    db.executeSql(req, "update currency set CurrencyCode= '" + req.body.CurrencyCode + "', CurrencyName = '" + req.body.CurrencyName + "', CurrencySymbol = '" + req.body.CurrencySymbol + "', DollarExchangeRate = " + req.body.DollarExchangeRate + ", CountryID =" + req.body.CountryID + ", IsActive =" + ~~(req.body.IsActive) + ", ModifyBy = " + req.body.ModifyBy + ", ModifyDate = GETUTCDATE() " +
        "Where CurrencyID= " + currencyID,
        function (data, err) {
        if (err) {

            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(1);
        }
        res.end();


    });
});

module.exports = router;