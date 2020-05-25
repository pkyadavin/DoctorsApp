var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var ErrorLog = function (ErrorMessage,Sql,Request,req)
{

    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('ErrorMsg', sql.NVarChar(sql.MAX), ErrorMessage);
        request.input('Request', sql.NVarChar(sql.MAX), Request);
        request.input('Sql', sql.NVarChar(sql.MAX), Sql);
        request.execute('SaveErrorLog', function (err, recordsets, returnValue) {
            if (err) {
            }
        });
    });
    
}
exports.ErrorLog = ErrorLog;