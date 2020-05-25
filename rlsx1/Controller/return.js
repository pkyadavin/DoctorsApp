var express = require("express");
var router = express.Router();
var sql = require("mssql");
var settings = require("../shared/Settings");
var db = require("../shared/DBAccess");
var Error = require("../shared/ErrorLog");
var outbound = require("../shared/outbound");
const httprequest = require("request");
var moment = require("moment");

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
      request.execute("usp_returnOrder_all", function(
        err,
        recordsets,
        returnValue
      ) {
        connection.close();
        if (err) {
          Error.ErrorLog(
            err,
            "usp_returnOrder_all",
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

//============Approach 2 (DEF) for 417==============//

// for saving Order Reject Reason
router.post("/boOrderReject", function(req, res) {
  debugger;
  console.log(JSON.stringify(req.body));
  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect().then(function() {
    var request = new sql.Request(connection);
    request.input("data", sql.NVarChar(sql.MAX), JSON.stringify(req.body));
    request.input("userid", sql.Int, req.userlogininfo.UserID);
    request.execute("usp_enterprise_authorized_return", function(
      err,
      recordsets,
      returnValue
    ) {
      connection.close();
      if (err) {
        Error.ErrorLog(
          err,
          "usp_enterprise_authorized_return",
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

//Cancel the return request
router.post("/cancelReturnRequest", function(req, res) {
  debugger;
  console.log(JSON.stringify(req.body));
  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect().then(function() {
    var request = new sql.Request(connection);
    request.input("data", sql.NVarChar(sql.MAX), JSON.stringify(req.body));
    request.execute("usp_enterprise_return_cancel", function(
      err,
      recordsets,
      returnValue
    ) {
      connection.close();
      if (err) {
        Error.ErrorLog(
          err,
          "usp_enterprise_return_cancel",
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

router.post("/saveGNreturn", function(req, res) {
  debugger;
  console.log("Hi HI");
  console.log(JSON.stringify(req.body));
  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect().then(function() {
    var request = new sql.Request(connection);
    request.input("data", sql.NVarChar(sql.MAX), JSON.stringify(req.body));
    request.output("rma_data", sql.NVarChar(sql.MAX));
    request.execute("usp_returns_post_new", function(
      err,
      recordsets,
      returnValue
    ) {
      connection.close();
      if (err) {
        Error.ErrorLog(
          err,
          "usp_returns_post_new",
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

//new For Staging
router.post("/customer", function(req, res) {
  let access_token;
  let CalltokenApiFlag = true;
  var currentDate = moment.utc();
  var expiredTokenDate = moment.utc(req.body.tokeninfo.ExpiredOn);
  var min = expiredTokenDate.diff(currentDate, "minutes");
  if (min > 0) {
    access_token = req.body.tokeninfo.access_token;
    CalltokenApiFlag = false;
  }
  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect(function(error) {
    var request = new sql.Request(connection);
    request.input("data", sql.NVarChar(sql.MAX), JSON.stringify(req.body));
    request.input(
      "UserId",
      sql.Int,
      (req.userlogininfo && req.userlogininfo.UserID) || 0
    );
    request.input("staging_return_number", sql.NVarChar(sql.MAX), "");
    request.output("rm_data", sql.NVarChar(sql.MAX));
    request.execute("usp_returns_post_stage", function(
      err,
      recordsets,
      returnValue
    ) {
      connection.close();

      if (err) {
        Error.ErrorLog(
          err,
          "usp_returns_post_stage",
          JSON.stringify(request.parameters),
          req
        );
        res.status(400).send({ error: err });
      } else {
        //====================New for Custom=============//

        if (
          recordsets &&
          recordsets[0] &&
          recordsets[0][0] &&
          recordsets[0][0].status == "Error"
        ) {
          Error.ErrorLog(
            err,
            "usp_returns_post_stage Execution error",
            JSON.stringify(recordsets),
            req
          );
          res.status(400).send({ error: recordsets });
        } else {
          let _data = null;
          _data = req.body;
          var rmData = JSON.parse(request.parameters.rm_data.value);

          if (
            !_data.return_order_number ||
            _data.return_order_number == "Auto Generated"
          ) {
            if (
              recordsets &&
              recordsets[0] &&
              recordsets[0][0] &&
              recordsets[0][0].return_order_number
            ) {
              _data.return_order_number = recordsets[0][0].return_order_number;

              try {
                _data.shipment.mrn_number = JSON.parse(
                  recordsets[0][0].shipment
                )[0].MRNNo;
              } catch (error) {}
            }

            var customDeclarationOption = {
              method: "POST",
              //1
              // NAM LIT
              //url: 'https://amertestwebapinam.azurewebsites.net/api/carrier/GenerateCustomDecalartionLabel',

              // EMEA LIT
              //url: 'http://amer-carrier-test.azurewebsites.net/api/carrier/GenerateCustomDecalartionLabel',

              //NAM & EMEA UAT
              url:
                "https://amer-carrier.azurewebsites.net/api/carrier/GenerateCustomDecalartionLabel",

              //NAM & EMEA PROD
              //url: 'https://wsamer.reverselogix.net/api/carrier/GenerateCustomDecalartionLabel',
              body: JSON.stringify(_data),
              headers: {
                "Content-Type": "application/json"
              }
            };

            httprequest(
              customDeclarationOption,
              (post_error, resp1, tbody1) => {
                if (post_error) {
                  Error.ErrorLog(
                    post_error,
                    "AMER CUSTOM DECLARATION ERROR",
                    customDeclarationOption,
                    req
                  );
                } else {
                  try {
                    if (
                      tbody1 &&
                      JSON.parse(tbody1).status == "success" &&
                      JSON.parse(tbody1).rm_data
                    ) {
                      rmData = JSON.parse(tbody1).rm_data;
                    } else {
                      Error.ErrorLog(
                        post_error,
                        "AMER CUSTOM DECLARATION ERROR",
                        customDeclarationOption,
                        req
                      );
                    }
                  } catch (error) {}

                  //=================Old====================//
                  callAmerSportsApiWithJWTToken(
                    CalltokenApiFlag,
                    rmData,
                    req,
                    res,
                    recordsets,
                    access_token
                  );
                  //=================End Old================//
                }
              }
            );
          } else {
            //=================Old====================//
            callAmerSportsApiWithJWTToken(
              CalltokenApiFlag,
              rmData,
              req,
              res,
              recordsets,
              access_token
            );
            //=================End Old================//
          }
        }

        //===================End New===================//
      }
    });
  });
});

function callAmerSportsApiWithJWTToken(
  CalltokenApiFlag,
  rmData,
  req,
  res,
  recordsets,
  access_token
) {
  if (CalltokenApiFlag) {
    //2
    // NAM & EMEA UAT & LIT
    let bodydata =
      "client_id=0a1da5f5-95d5-434f-9bdc-cbefd04854bd&client_secret=lwPMNE/@V82mNNqN2?PWv-k65x8iUu6e&grant_type=client_credentials& scope=https://amersportsonline.onmicrosoft.com/a751ea41-4b61-4e1f-a62f-e6519ea0080c/.default";

    // Prod
    //let bodydata = 'client_id=8e9bb4b8-69ac-468c-a9e0-2f01667b9356&client_secret=%2B0m%2BVM-U%3FIT8A4RjA7u00r%5B*zO2U%5B%5B%2FW&grant_type=client_credentials&scope=https%3A%2F%2Famersportsonline.onmicrosoft.com%2F317e495e-65a8-49ac-b2e2-2ce6ab879753%2F.default';

    var optionsToken = {
      method: "POST",
      url:
        "https://login.microsoftonline.com/227c66e2-c39f-42e6-9963-86f26b23ea13/oauth2/v2.0/token",
      body: bodydata,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      }
    };

    httprequest(optionsToken, (post_error, resp, tbody) => {
      if (post_error) {
        Error.ErrorLog(post_error, "AMER POST", body, req);
      } else {
        access_token = JSON.parse(tbody).access_token;
        var connection1 = new sql.Connection(settings.DBconfig(req));
        connection1.connect(function(error) {
          var request1 = new sql.Request(connection1);
          request1.input("tbody", sql.NVarChar(sql.MAX), tbody);
          request1.input(
            "UserId",
            sql.Int,
            (req.userlogininfo && req.userlogininfo.UserID) || 0
          );
          request1.execute("usp_SaveJWTtoken", function(
            err,
            recordsets,
            returnValue
          ) {
            connection1.close();
            if (err) {
              res.status(400).send({ error: err });
            } else {
              amerpostrmas(rmData, access_token, req, res, recordsets);
            }
          });
        });
      }
    });
  } else {
    amerpostrmas(rmData, access_token, req, res, recordsets);
  }
}

function amerpostrmas(rmData, access_token, req, res, recordsets) {
  var options = {
    method: "POST",
    //3
    // For EMEA UAT & LIT
    //url: 'https://rms.noprod-api.amersports.com/qual/rmas',   //OLD UAT

    // For NAM UAT & LIT
    url: "https://rms.noprod-api.amersports.com/nam/rmas",

    // For Prod EMEA
    //url: 'https://rms.api.amersports.com/rmas',

    body: rmData,
    json: true,
    headers: {
      //4
      // For EMEA & NAM UAT / LIT
      Host: "rms.noprod-api.amersports.com",

      // For Prod
      //Host: 'rms.api.amersports.com',
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token
    }
  };
  httprequest(options, (post_error, resp, body) => {
    if (post_error) {
      Error.ErrorLog(post_error, "AMER POST", body, req);

      //===========outbound log stage=========//
      outbound.stage_log(JSON.stringify(rmData), resp.statusCode, req);
    } else {
      //===========outbound log stage=========//
      outbound.stage_log(JSON.stringify(rmData), resp.statusCode, req);

      if (rmData && rmData.custom_declaration) {
        req.body.custom_declaration = rmData.custom_declaration;
      }
      reverselogixFinalRMASubmission(req, res, rmData, resp.statusCode);
    }
  });
}

function reverselogixFinalRMASubmission(req, res, rmData, amer_status_code) {
  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect(function(error) {
    var request = new sql.Request(connection);
    request.input("data", sql.NVarChar(sql.MAX), JSON.stringify(req.body));
    request.input(
      "UserId",
      sql.Int,
      (req.userlogininfo && req.userlogininfo.UserID) || 0
    );
    request.input(
      "staging_return_number",
      sql.NVarChar(sql.MAX),
      rmData.return_order_number
    );
    request.output("rm_data", sql.NVarChar(sql.MAX));
    request.execute("usp_returns_post", function(err, recordsets, returnValue) {
      connection.close();

      if (err) {
        Error.ErrorLog(
          err,
          "usp_returns_post",
          JSON.stringify(request.parameters),
          req
        );
        res.status(400).send({ error: err });
      } else {
        //===========outbound log main=========//
        if (
          recordsets &&
          recordsets[0] &&
          recordsets[0][0] &&
          recordsets[0][0].status == "Success"
        ) {
          outbound.log(JSON.stringify(rmData), amer_status_code, req);
        }

        if (
          !req.body.return_order_number ||
          req.body.return_order_number == "Auto Generated"
        ) {
          var connection1 = new sql.Connection(settings.DBconfig(req));
          connection1.connect(function(error) {
            var request1 = new sql.Request(connection1);
            request1.input(
              "return_order_number",
              sql.NVarChar(sql.MAX),
              (rmData && rmData.return_order_number) || ""
            );
            request1.input(
              "language_code",
              sql.NVarChar(sql.MAX),
              req.body.language
            );
            request1.execute("Usp_SaveOrderLabelData", function(
              err,
              recordsets,
              returnValue
            ) {
              connection1.close();
              if (err) {
                res.status(400).send({ error: err });
              } else {
              }
            });
          });
        }

        res.status(200).send({ recordsets });
      }
    });
  });
}

router.post("/Orders", function(req, res) {
  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect(function(error) {
    var request = new sql.Request(connection);
    request.input("data", sql.NVarChar(sql.MAX), JSON.stringify(req.body));
    request.execute("usp_allOrders", function(err, recordsets, returnValue) {
      connection.close();
      if (err) {
        Error.ErrorLog(
          err,
          "usp_allOrders",
          JSON.stringify(request.parameters),
          req
        );
        res.status(400).send({ error: err });
      } else {
        res.status(200).send({ data: recordsets });
      }
    });
  });
});

router.get("/track-all/:data/:brand/:searchtext", function(req, res) {
  console.log('HI');
  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect(function(error) {
    var request = new sql.Request(connection);
    request.input("email", sql.NVarChar(sql.MAX), req.params.data);
    request.input("brand", sql.NVarChar(sql.MAX), req.params.brand);
    request.input("searchtext", sql.NVarChar(sql.MAX), req.params.searchtext);
    request.execute("usp_returns_all", function(err, Data, returnValue) {
      connection.close();
      console.log("all_dta",Data)
      if (err) {
        Error.ErrorLog(
          err,
          "usp_returns_all",
          JSON.stringify(request.parameters),
          req
        );
        res.status(400).send({ error: err });
      } else {
        console.dir(Data);
        res.status(200).send({ recordsets: Data });
      }
    });
  });
});

router.get("/order/:data", function(req, res) {
  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect(function(error) {
    var request = new sql.Request(connection);
    request.input("data", sql.NVarChar(sql.MAX), req.params.data);
    request.input(
      "UserId",
      sql.Int,
      (req.userlogininfo && req.userlogininfo.UserID) || 0
    );
    request.output("BrandConfig", sql.NVarChar(sql.MAX));
    request.output("LanguageConfig", sql.NVarChar(sql.MAX));
    request.execute("usp_CustomerOrder", function(err, Data, returnValue) {
      connection.close();
      if (err) {
        Error.ErrorLog(
          err,
          "usp_CustomerOrder",
          JSON.stringify(request.parameters),
          req
        );
        res.status(400).send({ error: err });
      } else {
        res
          .status(200)
          .send({
            langconfig: request.parameters.LanguageConfig.value,
            brandconfig: request.parameters.BrandConfig.value,
            payload: JSON.parse(Data[0][0].payload),
            reason: JSON.parse(Data[1][0].ReturnReasons),
            AccessCodes: JSON.parse(Data[2][0].AccessCodes),
            return_address: JSON.parse(Data[3][0].return_address),
            return_freight: JSON.parse(Data[5][0].return_freight),
            states: JSON.parse(Data[4][0].states)
          });
      }
    });
  });
});

router.post("/findorder", function(req, res) {
  let access_token;
  let CalltokenApiFlag = true;
  var currentDate = moment.utc();

  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect(function(error) {
    var request = new sql.Request(connection);
    request.input("ordernumber", sql.NVarChar(sql.MAX), req.body.ordernumber);
    request.input("email", sql.NVarChar(sql.MAX), req.body.email);
    request.input("LanguageCode", sql.NVarChar(sql.MAX), req.body.LanguageCode);
    request.input("BrandCode", sql.NVarChar(sql.MAX), req.body.BrandCode);
    request.input(
      "UserId",
      sql.Int,
      (req.userlogininfo && req.userlogininfo.UserID) || 0
    );
    request.output("BrandConfig", sql.NVarChar(sql.MAX));
    request.output("LanguageConfig", sql.NVarChar(sql.MAX));
    request.execute("usp_customer_order_get", function(err, Data, returnValue) {
      console.log("JSONData findorder", JSON.parse(Data[0][0].payload));
      //res.status(200).send({ payload: JSON.stringify(Data) });
      //Error.ErrorLog(err, "Request - RL Find Order", req.body, req);
      if (err) {
        Error.ErrorLog(
          err,
          "Failure - RL Find Order",
          JSON.stringify(request.parameters),
          req
        );
        res.status(400).send({ error: err });
      }
      //else if (!JSON.parse(Data[0][0].payload).serial_number) {
      //     console.log(JSON.parse(Data[0][0].payload).order_number);

      //     console.log(JSON.parse(Data[0][0].payload).order_number);
      //     Error.ErrorLog(err, "Success - RL Find Order", Data, req);

      //     // //5
      //     // // For EMEA UAT & LIT
      //     // // Error.ErrorLog(err, "RM URL", req.body.hash ? `https://rms.noprod-api.amersports.com/qual/orders?retrieve=${req.body.hash}&brand=${req.body.BrandCode}` : `https://rms.noprod-api.amersports.com/qual/orders/${req.body.ordernumber}?brand=${req.body.BrandCode}`
      //     // //     , req);

      //     // // For NAM UAT & LIT
      //     // Error.ErrorLog(err, "RM URL", req.body.hash ? `https://rms.noprod-api.amersports.com/nam/orders?retrieve=${req.body.hash}&brand=${req.body.BrandCode}` : `https://rms.noprod-api.amersports.com/nam/orders/${req.body.ordernumber}?brand=${req.body.BrandCode}`
      //     //     , req);

      //     // // For EMEA Prod
      //     // //  Error.ErrorLog(err, "RM URL", req.body.hash ? `https://rms.api.amersports.com/orders?retrieve=${req.body.hash}&brand=${req.body.BrandCode}` : `https://rms.api.amersports.com/orders/${req.body.ordernumber}?brand=${req.body.BrandCode}`
      //     // //     , req);

      //     // let tokeninfo = JSON.parse(Data[7][0].tokeninfo);
      //     // var expiredTokenDate = moment.utc(tokeninfo.ExpiredOn);
      //     // var min = expiredTokenDate.diff(currentDate, 'minutes');
      //     // if (min > 0) {
      //     //     access_token = tokeninfo.access_token;
      //     //     CalltokenApiFlag = false;
      //     // }
      //     // if (CalltokenApiFlag) {
      //     //     //6
      //     //     // NAM & EMEA UAT & LIT
      //     //     let bodydata = 'client_id=0a1da5f5-95d5-434f-9bdc-cbefd04854bd&client_secret=lwPMNE/@V82mNNqN2?PWv-k65x8iUu6e&grant_type=client_credentials& scope=https://amersportsonline.onmicrosoft.com/a751ea41-4b61-4e1f-a62f-e6519ea0080c/.default';

      //     //     // Prod
      //     //     //let bodydata = 'client_id=8e9bb4b8-69ac-468c-a9e0-2f01667b9356&client_secret=%2B0m%2BVM-U%3FIT8A4RjA7u00r%5B*zO2U%5B%5B%2FW&grant_type=client_credentials&scope=https%3A%2F%2Famersportsonline.onmicrosoft.com%2F317e495e-65a8-49ac-b2e2-2ce6ab879753%2F.default';

      //     //     var optionsToken = {
      //     //         method: 'POST',
      //     //         url: 'https://login.microsoftonline.com/227c66e2-c39f-42e6-9963-86f26b23ea13/oauth2/v2.0/token',
      //     //         body: bodydata,
      //     //         headers: {
      //     //             'Content-Type': 'application/x-www-form-urlencoded',
      //     //             'Accept': 'application/json'
      //     //         }
      //     //     };

      //     //     httprequest(optionsToken, (post_error, resp, tbody) => {
      //     //         if (post_error) {
      //     //             Error.ErrorLog(post_error, "AMER POST", body, req);
      //     //         }
      //     //         else {
      //     //             access_token = JSON.parse(tbody).access_token;
      //     //             var connection1 = new sql.Connection(settings.DBconfig(req));
      //     //             connection1.connect(function (error) {
      //     //                 var request1 = new sql.Request(connection1);
      //     //                 request1.input('tbody', sql.NVarChar(sql.MAX), tbody);
      //     //                 request1.input('UserId', sql.Int, req.userlogininfo && req.userlogininfo.UserID || 0);
      //     //                 request1.execute('usp_SaveJWTtoken', function (err, recordsets, returnValue) {
      //     //                     connection1.close();
      //     //                     if (err) {
      //     //                         res.status(400).send({ error: err });
      //     //                     }
      //     //                     else {
      //     //                     }
      //     //                 });
      //     //             });
      //     //             amergetrmas(Data, access_token, req, res);
      //     //         }
      //     //     });
      //     // }
      //     // else {
      //     //     amergetrmas(Data, access_token, req, res);
      //     // }
      //}
      else {
        connection.close();
        res.status(200).send({
          // langconfig: request.parameters.LanguageConfig.value,
          // brandconfig: request.parameters.BrandConfig.value,
          payload: JSON.parse(Data[0][0].payload),
          reason: JSON.parse(Data[1][0].ReturnReasons),
          AccessCodes: JSON.parse(Data[2][0].AccessCodes),
          return_address: JSON.parse(Data[3][0].return_address),
          return_freight: JSON.parse(Data[5][0].return_freight),
          states: JSON.parse(Data[4][0].states),
          country: JSON.parse(Data[6][0].country)
        });
      }
    });
  });
});

function amergetrmas(Data, access_token, req, res) {
  var options = {
    method: "GET",
    //7
    // For EMEA UAT & LIT
    //url: req.body.hash ? `https://rms.noprod-api.amersports.com/qual/orders?retrieve=${req.body.hash}&brand=${req.body.BrandCode}` : `https://rms.noprod-api.amersports.com/qual/orders/${req.body.ordernumber}?brand=${req.body.BrandCode}`,

    // For NAM UAT & LIT
    url: req.body.hash
      ? `https://rms.noprod-api.amersports.com/nam/orders?retrieve=${req.body.hash}&brand=${req.body.BrandCode}`
      : `https://rms.noprod-api.amersports.com/nam/orders/${req.body.ordernumber}?brand=${req.body.BrandCode}`,

    // For Prod EMEA
    //url: req.body.hash ? `https://rms.api.amersports.com/orders?retrieve=${req.body.hash}&brand=${req.body.BrandCode}` : `https://rms.api.amersports.com/orders/${req.body.ordernumber}?brand=${req.body.BrandCode}`,
    json: true,
    headers: {
      //8
      // For EMEA & NAM UAT / LIT
      Host: "rms.noprod-api.amersports.com",

      // For Prod
      //Host: 'rms.api.amersports.com',
      "Content-Type": "application/json",
      Authorization: "Bearer " + access_token
    }
  };
  httprequest(options, (err, resp, body) => {
    var connection = new sql.Connection(settings.DBconfig(req));
    if (resp.statusCode != 200) {
      connection.close();
      res.status(400).send({ error: "not found." });
    } else {
      connection.connect(function(error) {
        var Amerrequest = new sql.Request(connection);
        Amerrequest.input("data", sql.NVarChar(sql.MAX), JSON.stringify(body));
        Amerrequest.input(
          "ordernumber",
          sql.NVarChar(sql.MAX),
          req.body.ordernumber
        );
        Amerrequest.input("email", sql.NVarChar(sql.MAX), req.body.email);
        Amerrequest.input(
          "LanguageCode",
          sql.NVarChar(sql.MAX),
          req.body.LanguageCode
        );
        Amerrequest.input(
          "BrandCode",
          sql.NVarChar(sql.MAX),
          req.body.BrandCode
        );
        Amerrequest.input(
          "UserId",
          sql.Int,
          (req.userlogininfo && req.userlogininfo.UserID) || 0
        );
        Amerrequest.output("BrandConfig", sql.NVarChar(sql.MAX));
        Amerrequest.output("LanguageConfig", sql.NVarChar(sql.MAX));
        Amerrequest.execute("usp_logAmerOrderWithData", function(
          err,
          recordsets,
          returnValue
        ) {
          connection.close();
          if (err) {
            Error.ErrorLog(
              err,
              "usp_logAmerOrderWithData",
              JSON.stringify(Amerrequest.parameters),
              req
            );
            res.status(400).send({ error: err });
          } else {
            res.status(200).send({
              langconfig: Amerrequest.parameters.LanguageConfig.value,
              brandconfig: Amerrequest.parameters.BrandConfig.value,
              payload: JSON.parse(recordsets[0][0].payload),
              reason: JSON.parse(recordsets[1][0].ReturnReasons),
              AccessCodes: JSON.parse(recordsets[2][0].AccessCodes),
              return_address: JSON.parse(recordsets[3][0].return_address),
              return_freight: JSON.parse(recordsets[4][0].return_freight),
              states: JSON.parse(recordsets[5][0].states),
              parentReturnReasons: JSON.parse(Data[6][0].parentReturnReasons),
              tokeninfo: JSON.parse(recordsets[7][0].tokeninfo)
            });
          }
        });
      });
    }
  });
}

router.post("/order", function(req, res) {
  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect(function(error) {
    var request = new sql.Request(connection);
    request.input("data", sql.NVarChar(sql.MAX), req.body.filter);
    request.input(
      "UserId",
      sql.Int,
      (req.userlogininfo && req.userlogininfo.UserID) || 0
    );
    request.output("BrandConfig", sql.NVarChar(sql.MAX));
    request.output("LanguageConfig", sql.NVarChar(sql.MAX));
    request.execute("usp_CustomerOrder", function(err, Data, returnValue) {
      connection.close();
      if (err) {
        Error.ErrorLog(
          err,
          "usp_CustomerOrder",
          JSON.stringify(request.parameters),
          req
        );
        res.status(400).send({ error: err });
      } else {
        console.dir(Data);
        res
          .status(200)
          .send({
            langconfig: request.parameters.LanguageConfig.value,
            brandconfig: request.parameters.BrandConfig.value,
            payload: JSON.parse(Data[0][0].payload),
            reason: JSON.parse(Data[1][0].ReturnReasons),
            AccessCodes: JSON.parse(Data[2][0].AccessCodes),
            return_address: JSON.parse(Data[3][0].return_address),
            return_freight: JSON.parse(Data[4][0].return_freight),
            states: JSON.parse(Data[5][0].states)
          });
      }
    });
  });
});

router.get("/status/:order/:status/:newStatus", function(req, res) {
  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect(function(error) {
    var request = new sql.Request(connection);
    request.input("oldStatus", sql.NVarChar(50), req.params.status);
    request.input("newStatus", sql.NVarChar(50), req.params.newStatus);
    request.input("RMANumber", sql.NVarChar(50), req.params.order);
    request.input(
      "UserId",
      sql.Int,
      (req.userlogininfo && req.userlogininfo.UserID) || 0
    );
    request.execute("usp_returns_changeStatus", function(
      err,
      recordsets,
      returnValue
    ) {
      connection.close();
      if (err) {
        Error.ErrorLog(
          err,
          "usp_returns_changeStatus",
          JSON.stringify(request.parameters),
          req
        );
        res.status(400).send({ error: err });
      } else {
        res.status(200).send({ recordsets: recordsets });
      }
    });
  });
});

router.get("/notes/:order", function(req, res) {
  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect(function(error) {
    var request = new sql.Request(connection);
    request.input("order", sql.NVarChar(sql.MAX), req.params.order);
    request.input("UserId", sql.Int, req.userlogininfo.UserID);
    request.execute("usp_returnNotes_all", function(
      err,
      recordsets,
      returnValue
    ) {
      connection.close();
      if (err) {
        Error.ErrorLog(
          err,
          "usp_returnNotes_all",
          JSON.stringify(request.parameters),
          req
        );
        res.status(400).send({ error: err });
      } else {
        res.status(200).send({ data: recordsets });
      }
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
    request.input("return_number", sql.NVarChar(sql.MAX), req.params.returnRef);
    request.execute("usp_returns_get_ByRef", function(err, Data, returnValue) {
      connection.close();
      if (err) {
        Error.ErrorLog(
          err,
          "usp_returns_get_ByRef",
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
    request.input("return_number", sql.NVarChar(sql.MAX), req.params.order);
    request.input("return_queue", sql.NVarChar(sql.MAX), req.params.queue);
    request.output("BrandConfig", sql.NVarChar(sql.MAX));
    request.output("LanguageConfig", sql.NVarChar(sql.MAX));
    request.output("GradesConfig", sql.NVarChar(sql.MAX));
    request.execute("usp_returns_get", function(err, Data, returnValue) {
      connection.close();
      if (err) {
        Error.ErrorLog(
          err,
          "usp_returns_get",
          JSON.stringify(request.parameters),
          req
        );
        res.status(400).send({ error: err });
      } else {
        res.status(200).send({
          // GradesConfig: request.parameters.GradesConfig.value,
          // langconfig: request.parameters.LanguageConfig.value,
          // brandconfig: request.parameters.BrandConfig.value,
          payload: JSON.parse(Data[0][0].payload),
          reason: JSON.parse(Data[1][0].ReturnReasons),
          AccessCodes: JSON.parse(Data[2][0].AccessCodes),
          return_address: JSON.parse(Data[3][0].return_address),
          //return_freight: JSON.parse(Data[4][0].return_freight),
          track_status: JSON.parse(Data[4][0].track_status),
          // parcel_track_status: JSON.parse(Data[7][0].parcel_track_status),
          // states: JSON.parse(Data[6][0].states),
          // parentReturnReasons: JSON.parse(Data[8][0].parentReturnReasons)
        });
      }
    });
  });
});

router.post("/note", function(req, res) {
  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect(function(error) {
    var request = new sql.Request(connection);
    request.input("data", sql.NVarChar(sql.MAX), JSON.stringify(req.body));
    request.input("UserId", sql.Int, req.userlogininfo.UserID);
    request.execute("usp_returnNotes_post", function(
      err,
      recordsets,
      returnValue
    ) {
      connection.close();
      if (err) {
        Error.ErrorLog(
          err,
          "usp_returnNotes_post",
          JSON.stringify(request.parameters),
          req
        );
        res.status(400).send({ error: err });
      } else {
        res.status(200).send({ data: recordsets });
      }
    });
  });
});

router.post("/files/:rmanumber", function(req, res) {
  console("in return.js to upload file")
  var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect().then(function() {
    var request = new sql.Request(connection);
    request.input("rmanumber", sql.VarChar(50), req.params.rmanumber);
    request.input("UserId", sql.Int, req.userlogininfo.UserID);
    request.input("data", sql.NVarChar(sql.MAX), JSON.stringify(req.body));
    request.execute("usp_rmaFiles_Post", function(
      err,
      recordsets,
      returnValue
    ) {
      connection.close();
      if (err) {
        Error.ErrorLog(
          err,
          "usp_rmaFiles_Post",
          JSON.stringify(request.parameters),
          req
        );
        res.status(400).send({ error: err });
      } else {
        res.status(200).send({ status: JSON.stringify(req.body) });
      }
    });
  });
});

module.exports = router;
