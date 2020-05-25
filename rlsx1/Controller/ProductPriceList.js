var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');

router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.output('TotalCount', sql.Int);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('access_rights', sql.NVarChar(sql.MAX));
        request.execute('usp_getProductPriceList', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_getProductPriceList', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value, access_rights: request.parameters.access_rights.value });
            }
            connection.close();
        })
    });
});

router.get('/getRegions', function (req, res) {
    db.executeSql(req, 'select RegionID,RegionName from Region ', function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'select RegionID,RegionName from Region ', "", req);
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

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {

        var request = new sql.Request(connection);
        request.input('userID', sql.Int, req.body.UserID);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.VarChar(20));
        request.execute('usp_SaveProductPriceList', function (err, recordsets, returnValue) {
            if (err) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: request.parameters.result.value }));
            }
            res.end();
            connection.close();
        })
    });
});

router.post('/Update', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {

        var request = new sql.Request(connection);
        request.input('userID', sql.Int, req.body.UserID);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.VarChar(20));
        request.execute('UpdateProductPriceList', function (err, recordsets, returnValue) {
            if (err) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: request.parameters.result.value }));
            }
            res.end();
            connection.close();
        })
    });
});


router.delete('/Remove/:ID', function (req, res) {
    var id = req.params.ID;

    db.executeSql(req, 'delete from Grade where GradeId =' + id, function (err, data) {
        if (err) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Deleted" }));//request.parameters.rid.value
        }
        res.end();
    })
});



router.get('/Category', function (req, res) {
  db.executeSql(req, 'SELECT CatID, [CatCd] ,[Description] FROM [dbo].[Category] where IsActive = 1 order by CatCd', function (data, err) {
      if (err) {
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

router.get('/Grade', function (req, res) {
  db.executeSql(req, 'SELECT GradeId, [GradeCd],[Description] FROM [dbo].[Grade] where IsActive = 1 order by GradeCd', function (data, err) {
      if (err) {
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

router.get('/Season', function (req, res) {
  db.executeSql(req, 'SELECT [SeasonID] ,[SeasonName]  ,[SeasonCode]  FROM [dbo].[Season] where IsActive = 1 order by SeasonCode', function (data, err) {
      if (err) {
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


router.get('/Region', function (req, res) {
  db.executeSql(req, 'SELECT [RegionID] ,[RegionCode] ,[RegionName]  FROM [dbo].[Region] where IsActive = 1 order by RegionCode', function (data, err) {
      if (err) {
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
