var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');

router.get('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.execute('spGetItemCategoriesForNode', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'spGetItemCategoriesForNode', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets});
            console.dir(recordsets);    
            connection.close();
        })
    });
});

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        req.body.CreatedBy = req.userlogininfo.UserID;
        request.input('json', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('returnValue', sql.VarChar(20));
        request.execute('USP_SaveItemCategory', function (err, data) {
            if (err) {
                Error.ErrorLog(err, 'USP_SaveItemCategory', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ result: request.parameters.returnValue.value, data: data }));//request.parameters.rid.value
            }
            res.end();
            connection.close();
        })
    });
});


router.delete('/:ID', function (req, res) {
    var ID = req.params.ID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ID', sql.Int, ID);
        request.output('returnValue', sql.VarChar(100));
        request.execute('USP_deleteItemCategory', function (err, data) {
            if (err) {
                Error.ErrorLog(err, 'USP_deleteItemCategory', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ data: request.parameters.returnValue.value });
            }
            res.end();
            connection.close();
        })
    });
});


module.exports = router;