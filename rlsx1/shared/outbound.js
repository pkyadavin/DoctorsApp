
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');

var log = function (data, status, req) {

    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('data', sql.NVarChar(sql.MAX), data);
        request.input('status', sql.NVarChar(sql.MAX), status);
        request.execute('usp_log_outboubd_data', function (err, recordsets, returnValue) {
            if (err) {
            }
        });
    });

}

var stage_log = function (data, status, req) {
    console.log('stage outbound');
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('data', sql.NVarChar(sql.MAX), data);
        request.input('status', sql.NVarChar(sql.MAX), status);
        request.execute('usp_log_outboubd_data_stage', function (err, recordsets, returnValue) {
            if (err) {
            }
        });
    });

}
exports.log = log;
exports.stage_log = stage_log;