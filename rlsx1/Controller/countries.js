var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');
router.get('/', function (req, res) {
    db.executeSql(req,`SELECT CountryID, CountryCode, CountryName, RegionName,
        CurrencyCode,
        CurrencySymbol,
        DollarExchangeRate,
        TeleCode,
        RegionID
        FROM Country WHERE IsActive = 1 Order by CountryName `, function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
            Error.ErrorLog(err, "SELECT CountryID, CountryName FROM Country Order by CountryName", "", req);
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/getCountryNameByID/:CountryID', function (req, res) {
    var countryID = req.params.CountryID;
    db.executeSql(req,"Select CountryName From Country where CountryID=" + countryID, function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
            Error.ErrorLog(err, "Select CountryName From Country where CountryID=" + countryID, "", req);
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});


module.exports = router;