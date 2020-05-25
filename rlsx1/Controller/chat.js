var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var helper = require('../UtilityLib/BlobHelper');
var multer = require('multer');
var upload = multer({ dest: '../Uploads/' })
var Error = require('../shared/ErrorLog');


router.get('/Users/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('PartnerID', sql.Int, req.params.PartnerID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.execute('usp_chatUsers', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_chatUsers", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        })
    });
});

router.get('/chatMessages/:RoomID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('RoomID', sql.Int, req.params.RoomID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.execute('usp_chatMessages', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_chatMessages", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        })
    });
});

module.exports = router;