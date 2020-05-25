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
        request.output('TotalCount', sql.Int);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input("PartnerID", sql.Int, req.params.PartnerID);

        request.output('access_rights', sql.NVarChar(sql.MAX));
        request.execute('usp_GetRepair_Resolution', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_GetRepair_Resolution', JSON.stringify(request.parameters), req);
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


router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {

        var request = new sql.Request(connection);
        request.input('userID', sql.Int, req.body.UserID);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.VarChar(20));
        request.execute('usp_post_repair_resolution', function (err, recordsets, returnValue) {
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

    db.executeSql(req, 'delete from Country where CountryID =' + id, function (err, data) {
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

router.get('/CarrierGateway/:ID', function (req, res) {
  db.executeSql(req, "SELECT isnull(rcm.CountryConfigMapID,0) CountryConfigMapID,g.TypeLookUpID, g.TypeCode, g.TypeName, g.TypeGroup, g.[Description], (SELECT isnull(rcm.CountryConfigMapID,0) CountryConfigMapID,tl.TypeLookUpID, tl.TypeCode, tl.TypeName, tl.TypeGroup, tl.[Description], rcm.[Description] AS AttributeValue FROM TypeLookUp tl LEFT JOIN CountryConfigMap rcm ON rcm.TypeLookupID = tl.TypeLookUpID and rcm.CountryID ='" + req.params.ID + "' WHERE TypeGroup = g.TypeCode  ORDER BY tl.SortOrder FOR JSON PATH) AS Attributes FROM TypeLookUp g left join CountryConfigMap rcm ON rcm.TypeLookUpID = g.TypeLookUpID and rcm.CountryID ='" + req.params.ID +"' WHERE g.TypeGroup = 'CarrierGateway'", function (data, err) {
      if (err) {
          Error.ErrorLog(err, "SELECT isnull(rcm.CountryConfigMapID,0) CountryConfigMapID,g.TypeLookUpID, g.TypeCode, g.TypeName, g.TypeGroup, g.[Description], (SELECT isnull(rcm.CountryConfigMapID,0) CountryConfigMapID,tl.TypeLookUpID, tl.TypeCode, tl.TypeName, tl.TypeGroup, tl.[Description], rcm.[Description] AS AttributeValue FROM TypeLookUp tl LEFT JOIN CountryConfigMap rcm ON rcm.TypeLookupID = tl.TypeLookUpID and rcm.CountryID ='" + req.params.ID + "' WHERE TypeGroup = g.TypeCode  FOR JSON PATH) AS Attributes FROM TypeLookUp g left join CountryConfigMap rcm ON rcm.TypeLookUpID = g.TypeLookUpID and rcm.CountryID ='" + req.params.ID + "' WHERE g.TypeGroup = 'CarrierGateway'", "", req);
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
