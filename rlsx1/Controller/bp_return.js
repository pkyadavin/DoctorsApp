var express = require("express");
var router = express.Router();
var sql = require("mssql");
var settings = require("../shared/Settings");
var db = require("../shared/DBAccess");
var Error = require("../shared/ErrorLog");

router.get(
    "/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:fromDate/:toDate/:Status/:brandCode",
    function(req, res) {
      var connection = new sql.Connection(settings.DBconfig(req));
  
      connection.connect().then(function() {
        var request = new sql.Request(connection);
        request.input("StartIndex", sql.Int, req.params.StartIndex);
        request.input("PageSize", sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("fromDate", sql.VarChar(1000), req.params.fromDate);
        request.input("toDate", sql.VarChar(1000), req.params.toDate);
        request.input("Status", sql.VarChar(1000), req.params.Status);
        request.input("brandCode", sql.VarChar(1000), req.params.brandCode);
        request.input("UserId", sql.Int, req.userlogininfo.UserID);
        request.input("LanguageID", sql.Int, req.userlogininfo.languageid);
        request.output("TotalCount", sql.Int);
        request.execute("usp_ga_ia_returnOrder_all", function(
          err,
          recordsets,
          returnValue
        ) {
          connection.close();
          if (err) {
            Error.ErrorLog(
              err,
              "usp_ga_ia_returnOrder_all",
              JSON.stringify(request.parameters),
              req
            );
            res.send({ error: err });
          } else {
            res.send({
              recordsets: recordsets,
              totalcount: request.parameters.TotalCount.value
            });
          }
        });
      });
    }
  );
  
  router.post("/saveBPreturn", function(req, res) {
    console.log(JSON.stringify(req.body));
    debugger;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function() {
      var request = new sql.Request(connection);
      request.input("data", sql.NVarChar(sql.MAX), JSON.stringify(req.body));
      request.output("rma_data", sql.NVarChar(sql.MAX));
      request.execute("usp_returns_post_Blueparrott", function(
        err,
        recordsets,
        returnValue
      ) {
        connection.close();
        if (err) {
          Error.ErrorLog(
            err,
            "usp_returns_post_Blueparrott",
            JSON.stringify(request.parameters),
            req
          );
          res.status(400).send({ error: err });
        } else {
          res.send({ recordsets: recordsets });
        }
        res.end();
        connection.close();
      });
    });
  });

  router.get("/trackByRef/:returnRef", function(req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function(error) {
      var request = new sql.Request(connection);
      request.input(
        "UserId",
        sql.Int,
        (req.userlogininfo && req.userlogininfo.UserID) || 0
      );
      request.input("return_ref_number", sql.NVarChar(sql.MAX), req.params.returnRef);
      request.execute("usp_bp_returns_get_ByRef", function(
        err,
        Data,
        returnValue
      ) {
        connection.close();
        if (err) {
          Error.ErrorLog(
            err,
            "usp_bp_returns_get_ByRef",
            JSON.stringify(request.parameters),
            req
          );
          res.status(400).send({ error: err });
        } else {
          res.status(200).send({
            payload: JSON.parse(Data[0][0].payload),
            track_status: JSON.parse(Data[1][0].track_status)
          });
        }
      });
    });
  });
  
  router.get("/:queue/:order", function(req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function(error) {
      var request = new sql.Request(connection);
      request.input(
        "UserId",
        sql.Int,
        (req.userlogininfo && req.userlogininfo.UserID) || 0
      );
      request.input("return_ref_number", sql.NVarChar(sql.MAX), req.params.order);
      request.execute("usp_bp_returns_get_ByRef", function(err, Data, returnValue) {
        connection.close();
        if (err) {
          Error.ErrorLog(
            err,
            "usp_bp_returns_get_ByRef",
            JSON.stringify(request.parameters),
            req
          );
          res.status(400).send({ error: err });
        } else {
          res.status(200).send({
            payload: JSON.parse(Data[0][0].payload),
            track_status: JSON.parse(Data[1][0].track_status),
            AccessCodes: JSON.parse(Data[2][0].access_code),
          });
        }
      });
    });
  });

  module.exports = router;