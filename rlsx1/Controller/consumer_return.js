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
        request.execute("usp_consumer_returnOrder_all", function(
          err,
          recordsets,
          returnValue
        ) {
          connection.close();
          if (err) {
            Error.ErrorLog(
              err,
              "usp_consumer_returnOrder_all",
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

  router.post("/saveConsumerreturn", function(req, res) {
    console.log(JSON.stringify(req.body));
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function() {
      var request = new sql.Request(connection);
      request.input("data", sql.NVarChar(sql.MAX), JSON.stringify(req.body));
      request.output("rma_data", sql.NVarChar(sql.MAX));
      request.execute("usp_returns_post_consumer", function(
        err,
        recordsets,
        returnValue
      ) {
        connection.close();
        if (err) {
          Error.ErrorLog(
            err,
            "usp_returns_post_consumer",
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

  
  router.post("/updaetConsumerreturn", function(req, res) {
    console.log(JSON.stringify(req.body));
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function() {
      var request = new sql.Request(connection);
      request.input("data", sql.NVarChar(sql.MAX), JSON.stringify(req.body));
      request.output("rma_data", sql.NVarChar(sql.MAX));
      request.execute("usp_consumer_cp_post", function(
        err,
        recordsets,
        returnValue
      ) {
        connection.close();
        if (err) {
          Error.ErrorLog(
            err,
            "usp_consumer_cp_post",
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
      request.execute("usp_consumer_returns_get_ByRef", function(
        err,
        Data,
        returnValue
      ) {
        connection.close();
        if (err) {
          Error.ErrorLog(
            err,
            "usp_consumer_returns_get_ByRef",
            JSON.stringify(request.parameters),
            req
          );
          res.status(400).send({ error: err });
        } else {
          console.log(Data);
          res.status(200).send({
            payload: JSON.parse(Data[0][0].payload),
            track_status: JSON.parse(Data[1][0].track_status),
            return_reason: JSON.parse(Data[2][0].return_reason),
            access_code: JSON.parse(Data[3][0].access_code)
          });
        }
      });
    });
  });
  
  router.get("/consumerInitiation/:LanguageCode/:BrandCode", function(req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function(error) {
      var request = new sql.Request(connection);
      request.input(
        "LanguageCode",
        sql.NVarChar(sql.MAX),
        req.params.LanguageCode
      );
      request.input("BrandCode", sql.NVarChar(sql.MAX), req.params.BrandCode);
      request.execute("usp_consumer_return_initiate", function(
        err,
        Data,
        returnValue
      ) {
        connection.close();
        if (err) {
          Error.ErrorLog(
            err,
            "usp_consumer_return_initiate",
            JSON.stringify(request.parameters),
            req
          );
          res.status(400).send({ error: err });
        } else {
          console.log(Data);
          res.status(200).send({
            product_detail: JSON.parse(Data[0][0].ProductDetail),
            color_detail: JSON.parse(Data[1][0].ColorDetail),
            rmatype_detail: JSON.parse(Data[2][0].RMATypeDetail),
            productwarranty_detail: JSON.parse(Data[3][0].ProductWarrantyDetail),
            return_reason: JSON.parse(Data[4][0].ReturnReasons),
            country: JSON.parse(Data[5][0].country)
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
      request.execute("usp_consumer_returns_get_ByRef", function(err, Data, returnValue) {
        connection.close();
        if (err) {
          Error.ErrorLog(
            err,
            "usp_consumer_returns_get_ByRef",
            JSON.stringify(request.parameters),
            req
          );
          res.status(400).send({ error: err });
        } else {
          res.status(200).send({
            payload: JSON.parse(Data[0][0].payload),
            track_status: JSON.parse(Data[1][0].track_status),
            return_reason: JSON.parse(Data[2][0].return_reason),
            access_code: JSON.parse(Data[3][0].access_code)
          });
        }
      });
    });
  });

  router.post("/consumer_authorizationRequest", function(req, res) {
    debugger;
    console.log(JSON.stringify(req.body));
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function() {
      var request = new sql.Request(connection);
      request.input("data", sql.NVarChar(sql.MAX), JSON.stringify(req.body));
      request.input("userid", sql.Int, req.userlogininfo.UserID);
      request.execute("usp_consumer_authorized_return", function(
        err,
        recordsets,
        returnValue
      ) {
        connection.close();
        if (err) {
          Error.ErrorLog(
            err,
            "usp_consumer_authorized_return",
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

module.exports = router;