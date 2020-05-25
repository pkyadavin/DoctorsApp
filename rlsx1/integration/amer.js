var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');


router.get('/passport', function (req, res) {   

});

router.post('/customerorderlog', function (req, res) { 
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
            var request = new sql.Request(connection);
            request.input('data', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
            request.execute('usp_logAmerOrder', function (err, recordsets, returnValue) {
                connection.close();
                if (err) {
                    Error.ErrorLog(err, "usp_logAmerOrder", JSON.stringify(request.parameters), req);
                    res.status(400).send({error: err});
                }
                else {
                    res.status(200).send({ data: "created" });
                }
            });
        });
});

module.exports = router;