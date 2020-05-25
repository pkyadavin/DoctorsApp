var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');
//router.post('/putCase', function (req, res) {
//  console.log('hi');
//  var connection = new sql.Connection(settings.DBconfig(req));
//  connection.connect().then(function () {
//      var request = new sql.Request(connection);
//      request.input('filterValue', sql.NVarChar(1000), req.body.filterValue);
//    request.execute('usp_GetAllCaseValidation', function (err, recordsets) {
//      if (err) {
//        res.writeHead(200, { "Content-Type": "application/json" });
//        res.write(JSON.stringify({ data: "Error Occured: " + err }));
//      }
//      else {
//        res.writeHead(200, { "Content-Type": "application/json" });
//        res.write(JSON.stringify({ data: recordsets }));
//      }
//      res.end();
//      connection.close();
//    });
//  });
//});
router.get('/putCase/:filterValue', function (req, res) {
  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect().then(function () {
    debugger;
    var request = new sql.Request(connection);
    request.input('filterValue', sql.NVarChar, req.params.filterValue);
    request.execute('usp_GetAllCaseValidation', function (err, recordsets, returnValue) {
      console.log(JSON.stringify(recordsets[0]));
      if (err) {
        Error.ErrorLog(err, "usp_GetAllCaseValidation", JSON.stringify(recordsets), req);
        res.send({ error: err });
      }
      else {
        res.send(JSON.stringify(recordsets[0]));
      }
      connection.close();
    })
  });
});
router.get('/getCaseDetails/:filterValue', function (req, res) {
  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect().then(function () {
    debugger;
    var request = new sql.Request(connection);
    request.input('filterValue', sql.NVarChar, req.params.filterValue);
    request.execute('usp_GetCaseDetails', function (err, recordsets, returnValue) {
      console.log(JSON.stringify(recordsets[0]));
      if (err) {
        Error.ErrorLog(err, "usp_GetCaseDetails", JSON.stringify(recordsets), req);
        res.send({ error: err });
      }
      else {
        res.send(JSON.stringify(recordsets[0]));
      }
      connection.close();
    })
  });
});
router.get('/getEditAddress/:filterValue', function (req, res) {
  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect().then(function () {
    debugger;
    var request = new sql.Request(connection);
    request.input('filterValue', sql.NVarChar, req.params.filterValue);
    request.execute('usp_GetEditAddress', function (err, recordsets, returnValue) {
      console.log(JSON.stringify(recordsets[0]));
      if (err) {
        Error.ErrorLog(err, "usp_GetEditAddress", JSON.stringify(recordsets), req);
        res.send({ error: err });
      }
      else {
        res.send(JSON.stringify(recordsets[0]));
      }
      connection.close();
    })
  });
});

router.get('/editCaseDetails/:filterValue', function (req, res) {
  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect().then(function () {
    debugger;
    var request = new sql.Request(connection);
    request.input('filterValue', sql.NVarChar, req.params.filterValue);
    request.execute('usp_GetEditCaseDetails', function (err, recordsets, returnValue) {
      console.log(JSON.stringify(recordsets[0]));
      if (err) {
        Error.ErrorLog(err, "usp_GetEditCaseDetails", JSON.stringify(recordsets), req);
        res.send({ error: err });
      }
      else {
        res.send(JSON.stringify(recordsets[0]));
      }
      connection.close();
    })
  });
});
module.exports = router;
