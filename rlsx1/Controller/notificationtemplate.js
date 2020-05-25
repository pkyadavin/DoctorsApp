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
        request.input("PartnerID", sql.VarChar(1000), req.params.PartnerID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('TotalCount', sql.Int);
        request.output('access_rights', sql.NVarChar(sql.MAX));
        request.execute('GetNotifocationWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetNotifocationWithPaging", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value, access_rights: request.parameters.access_rights.value });
            console.dir(request.parameters.TotalCount);
        })
    }).catch(function (err) {
        console.log(err);
    });
});

router.get('/NotificationTemplate/:ntId', function (req, res) {
    var ntID = req.params.ntId;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ntId', sql.Int, ntID);
        request.execute('GetNotificationTemplateByID', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetNotificationTemplateByID", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
        })

    });
});

router.get('/NotificationBylang/:lId/:bId/:code', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('lId', sql.Int, req.params.lId);
        request.input('bId', sql.Int, req.params.bId);
        request.input('code', sql.NVarChar(50), req.params.code);
        request.execute('GetNotificationBylang', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetNotificationBylang", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
        })
    });
});

router.get('/NotificationTemplate/:langId/:code', function (req, res) {
    var langId = req.params.langId;
    var code = req.params.code;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('langId', sql.Int, langId);
        request.input('code', sql.VarChar(20), code);
        request.execute('GetNotificationTemplateByLanguageAndCode', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetNotificationTemplateByLanguageAndCode", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
        })

    });
});

router.get('/languages', function (req, res) {
    db.executeSql(req, 'select LanguageID,Name,Code,IsDefault from [Language]  where IsActive = 1 ', function (data, err) {
        if (err) {
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

router.get('/languages/:bid', function (req, res) {
    db.executeSql(req, `select [Language].LanguageID, [Language].Name, [Language].Code, IsDefault 
        from [Language]  
        INNER JOIN brand_language_map ON brand_language_map.LanguageID = [Language].LanguageID
        where IsActive = 1 and brand_language_map.BrandID = ${req.params.bid}`, function (data, err) {
            if (err) {
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

router.get('/scheduledays', function (req, res) {
    db.executeSql(req, 'select TypeLookUpID ScheduleDayID,TypeName ScheduleDay from TypeLookUp where Typegroup = \'ScheduleDays\'', function (data, err) {
        if (err) {
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

router.get('/Parameters:NotificationTemplateID', function (req, res) {
    db.executeSql(req, 'select * from NotificationTemplateKey where NotificationTemplateID = ' + NotificationTemplateID + ' order by KeyName', function (data, err) {
        if (err) {
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

router.delete('/:id', function (req, res) {
    var id = req.params.id;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ntId', sql.Int, id);
        request.execute('usp_deleteNotificationTemplate', function (err, data) {
            if (err) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(data));//request.parameters.rid.value
            }
            res.end();
        })
    });
});

router.post('/', function (req, res) {

    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        req.body.CreatedBy = req.userlogininfo.UserID;
        request.input('json', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.input('TemplateBody', sql.NVarChar(sql.MAX), JSON.stringify(req.body.TemplateBody));
        request.output('returnValue', sql.VarChar(20));
        request.execute('USP_SaveNotificationTemplate', function (err, data) {
            if (err) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: request.parameters.returnValue.value }));//request.parameters.rid.value
            }
            res.end();
            connection.close();
        })
    });

});


module.exports = router;