var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');

router.get('/user/:email', function (req, res) {
    console.log(req);
    db.executeSql(req, `SELECT TOP 1 TRIM(UserName) as Email FROM Users Where UserName = '${req.params.email}' AND IsActive = 1`, function (data, err) {
        if (err) {
            Error.ErrorLog(err, `SELECT Email FROM Users Where Email = '${req.params.email}' AND IsActive = 1`, req.params.email, req);
            res.status(400).send({ error: err });
        }
        else {
            res.status(200).send(data);
        }
    });
}); 

router.get('/languages/:brand/:lang', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('brandcode', sql.NVarChar(sql.MAX), req.params.brand);
        request.input('languageCode', sql.NVarChar(sql.MAX), req.params.lang);
        request.output('BrandConfig', sql.NVarChar(sql.MAX));
        request.output('LanguageConfig', sql.NVarChar(sql.MAX));
        request.output('LanguageList', sql.NVarChar(sql.MAX));
        request.output('faqConfig', sql.NVarChar(sql.MAX));
        request.execute('usp_getBrandConfig', function (err, recordsets, returnValue) {
            connection.close();
            if (err) {
                Error.ErrorLog(err, "usp_getBrandConfig", JSON.stringify(request.parameters), req);
                res.status(400).send({ error: err });
            }
            else {
                res.status(200).send({ LanguageList: request.parameters.LanguageList.value, langconfig: request.parameters.LanguageConfig.value, brandconfig: request.parameters.BrandConfig.value, faqConfig: request.parameters.faqConfig.value});
            }
        });
    });
});

router.get('/languages/:code/:lang/:default', function (req, res) {
    db.executeSql(req, `select [Language].LanguageID, [Language].Name, LOWER([Language].Code) as Code, IsDefault
    from [Language] where LanguageID in 
    (select isnull(MappedLanguageGroupID,[Language].LanguageID) as mlid
            from [Language]  
            INNER JOIN brand_language_map ON brand_language_map.LanguageID = [Language].LanguageID
            INNER JOIN Partners ON Partners.PartnerID = brand_language_map.BrandID
            where Partners.IsActive = 1 and Partners.PartnerCode = '${req.params.code}' 
            and isnull(MappedLanguageGroupID,[Language].LanguageID) <> (Select isnull(MappedLanguageGroupID,LanguageID) 
                from [Language] where code = '${req.params.lang}' )
                group by isnull(MappedLanguageGroupID,[Language].LanguageID)
                union
                select LanguageID
                from [Language] where code = '${req.params.lang}' )
            ORDER BY [Language].Name `, function (data, err) {
        if (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.put('/UpdateInvalidLogin/:username/:locked', function (req, res) {
    var username = req.params.username;
    var locked = req.params.locked;
    // console.log(req.params.locked);
    // console.log(username);
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('username', sql.VarChar(500), username);
        request.input('locked', sql.VarChar(500), locked);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_User_FaliedAttemptedLock', function (err, recordsets) {
            Error.ErrorLog(err, "usp_User_FaliedAttemptedLock", JSON.stringify(request.parameters), req);
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});

module.exports = router;