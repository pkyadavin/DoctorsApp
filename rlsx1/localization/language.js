var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');
var db = require('../shared/DBAccess');

router.get('/:FormID/:LanguageID/:BrandID', function (req, res) {
    var addressid = req.params.AddressID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
            var request = new sql.Request(connection);
            request.input('FormID', sql.Int, req.params.FormID);
            request.input('LanguageID', sql.Int, req.params.LanguageID);
            request.input('BrandID', sql.Int, req.params.BrandID);
            request.execute('usp_GetLanguageData ', function (err, recordsets, returnValue) {
                connection.close();
                if (err) {
                    Error.ErrorLog(err, "usp_GetLanguageData", JSON.stringify(request.parameters), req);
                    res.status(401).send({error: err});
                }
                else {
                    res.status(200).send({ recordsets: recordsets });
                }
            });
        });
});

router.get('/mapped', function (req, res) {
    db.executeSql(req, `SELECT DISTINCT REPLACE([Language].Code, '-','') Code, [Language].[Name], ISNULL(IsDefault, 0) IsDefault  FROM brand_language_map
    INNER JOIN [Language] ON brand_language_map.LanguageID = [Language].LanguageID
    WHERE IsActive = 1 OR ISNULL(IsDefault, 0) = 1`, function (data, err) {
        if (err) {
            Error.ErrorLog(err, `SELECT DISTINCT REPLACE([Language].Code, '-','') Code, [Language].[Name], ISNULL(IsDefault, 0) IsDefault FROM brand_language_map
            INNER JOIN [Language] ON brand_language_map.LanguageID = [Language].LanguageID
            WHERE IsActive = 1 OR ISNULL(IsDefault, 0) = 1`, JSON.stringify(request.parameters), req);
            res.status(400).send({ error: err });
        }
        else {
            res.status(200).send(data);
        }
    });
});

router.post('/:mode', function (req, res) {
    var addressid = req.params.AddressID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
            var request = new sql.Request(connection);
            request.input('jsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
            request.input('UserID', sql.Int, req.userlogininfo.UserID);
            request.input('mode', sql.Bit, req.params.mode == "true"?1:0);
            request.output('result', sql.NVarChar(sql.MAX));
            request.execute('usp_SaveLanguageData ', function (err, recordsets, returnValue) {
                connection.close();
                if (err) {
                    Error.ErrorLog(err, "usp_SaveLanguageData", JSON.stringify(request.parameters), req);
                    res.status(400).send({error: err});
                }
                else {
                    res.status(200).send({ data: request.parameters.result.value });
                }
            });
        });
});

module.exports = router;