var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');
router.post('/:orderType/:tabType/:userId/:parentId', function (req, res) {
    var orderType = req.params.orderType;
    var tabType = req.params.tabType;
    var userId = req.params.userId;
    var parentId = req.params.parentId;
    var jsonData = '';


    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);

        var sendData = req.body[0].SendData;

        if (tabType == 'xml') {
            var to_json = require('xmljson').to_json;

            to_json(sendData, function (error, result) {
                jsonData = result;
            });
        }
        else {
            jsonData = JSON.parse(sendData);
        }

        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(jsonData));
        request.input('UserID', sql.Int, userId);
        request.input('OrderType', sql.VarChar(50), orderType);
        request.input('PartnerID', sql.Int, parentId);
        request.output('result', sql.NVarChar(500));
        request.execute('usp_OrderApi_Create', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_OrderApi_Create", JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});

module.exports = router;