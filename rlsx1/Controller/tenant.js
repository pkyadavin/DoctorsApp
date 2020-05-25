var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');

router.get('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.execute('usp_Tenant_GetAll', function (err, recordsets, returnValue) {
            res.send({ recordsets: recordsets});
            console.dir(recordsets);         
        })
    });
});
router.get('/tenants', function (req, res) {
    var tenantQuery = "SELECT TenantID, TenantName, TenantCode, ValidFrom,ValidTo,Domain,NoofUsers,currency.CurrencyName FROM Tenant Inner Join currency on currency.currencyId=Tenant.currencyId";
    db.executeSql(req,tenantQuery, function (data, err) {
        if (err) {
            Error.ErrorLog(err, tenantQuery, "", req);
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

module.exports = router;