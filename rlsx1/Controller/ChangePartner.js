var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');
router.get('/', function (req, res) {
        var connection = new sql.Connection(settings.DBconfig(req));
        connection.connect().then(function () {
            var request = new sql.Request(connection);
            var userID = req.userlogininfo.UserID;
            request.input("UserID", sql.Int, userID);
           
            request.execute('usp_GetAllFacilitiesByUserID', function (err, recordsets, returnValue) {
                if (err) {
                    Error.ErrorLog(err, 'usp_GetAllFacilitiesByUserID', JSON.stringify(request.parameters), req);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.write(JSON.stringify({ data: "Error Occured: " + err }));
                }
                else {
                    res.send(recordsets);
                }
                connection.close();
            })
        });
     
});

router.get('/save/:id', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        var userID = req.userlogininfo.UserID;
        request.input('UserID', sql.Int, userID);
        request.input('PartnerID', sql.Int, req.params.id);
        request.output('result', sql.VarChar(20));
        request.execute('UpdateUserDefaultPartner', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'UpdateUserDefaultPartner', JSON.stringify(request.parameters), req);
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

module.exports = router;