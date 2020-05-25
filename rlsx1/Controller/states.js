var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');
router.get('/:countryID', function (req, res) {
    var countryId = req.params.countryID;
    db.executeSql(req,"Select StateID, StateName from State Where CountryID=" + countryId+" And IsActive=1 ORDER BY StateName ", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "Select StateID, StateName from State Where CountryID=" + countryId + " And IsActive=1", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/getStateNameByID/:StateID', function (req, res) {
    var stateID = req.params.StateID;
    db.executeSql(req,"Select StateName From State where StateID=" + stateID, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "Select StateName From State where StateID=" + stateID, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

module.exports = router;