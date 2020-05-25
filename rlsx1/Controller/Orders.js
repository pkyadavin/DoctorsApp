var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');
router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.output('TotalCount', sql.Int);
        request.output('access_rights', sql.NVarChar(sql.MAX));
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.execute('usp_GetAllOrders', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetAllOrders", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value, access_rights: request.parameters.access_rights.value});
            }
            connection.close();
        })
    });
});

//Save

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.input('userID', sql.Int, req.userlogininfo.UserID);
        request.output('result', sql.VarChar(5000));
        request.execute('usp_SaveOrders', function (err, recordsets) {
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

  db.executeSql(req,'update intake_orders set isactive=0 where order_Id =' + id, function (err, data) {
      if (err) {
          Error.ErrorLog(err, 'delete from intake_orders where order_Id =' + id,"" , req);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ data: "Error Occured: " + err }));
      }
      else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify({ data: "Deleted" }));
      }
      res.end();
  })
});

router.get('/Colors', function (req, res) {
  db.executeSql(req, 'SELECT [ColorID] ColorsID,[ColorName] Name ,[ColorCode] Code ,[Description] Description FROM [dbo].[Color] where IsActive = 1 ', function (data, err) {
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

router.get('/ProductSize', function (req, res) {
  db.executeSql(req, 'SELECT [ProductSizeID],[SizeCode] ,[IsActive] FROM [dbo].[ProductSize] where IsActive = 1 order by SizeCode', function (data, err) {
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
  db.executeSql(req, 'SELECT [SeasonID] SeasonID,[SeasonName] SeasonName ,[SeasonCode] SeasonCode ,[Description] Description FROM [dbo].[Season] where IsActive = 1 order by SeasonCode', function (data, err) {
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

router.get('/Category', function (req, res) {
  db.executeSql(req, 'SELECT [CatCd] ,[Description] FROM [dbo].[Category] where IsActive = 1 order by CatCd', function (data, err) {
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
  db.executeSql(req, 'SELECT [GradeCd],[Description] FROM [dbo].[Grade] where IsActive = 1 order by GradeCd', function (data, err) {
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

router.get('/Subcategory', function (req, res) {
  db.executeSql(req, 'SELECT [SubCatCd] ,[Description] FROM [dbo].[SubCategory] where IsActive = 1 order by SubCatCd', function (data, err) {
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


router.get('/Country', function (req, res) {
  db.executeSql(req, 'SELECT [CountryCode] ,[CountryName] FROM [dbo].[Country] where IsActive = 1 order by CountryCode', function (data, err) {
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







