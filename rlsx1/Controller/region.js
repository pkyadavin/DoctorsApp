var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');
router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue', function (req, res) {
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
        request.execute('usp_Region_All', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_Region_All", JSON.stringify(request.parameters), req);
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

router.get('/CustomerCarrierGateway/:CarrierListType/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ListType', sql.VarChar(50), req.params.CarrierListType);
        request.input('PartnerID', sql.Int, req.params.PartnerID);
        request.execute('usp_GetConsumerCarrier', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetConsumerCarrier", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        })
    });
});

router.get('/ConfigMap/:ID', function (req, res) {
    db.executeSql(req, "SELECT tl.* FROM RegionConfigMap rcm INNER JOIN TypeLookUp tl ON tl.TypeLookUpID = rcm.TypeLookupID WHERE rcm.RegionID ="+ req.params.ID +" and (ConfigGroup = 'RegionConfiguration' OR ConfigGroup in (select TypeCode from TypeLookUp where typegroup= 'RegionConfiguration'))" , function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT tl.* FROM RegionConfigMap rcm INNER JOIN TypeLookUp tl ON tl.TypeLookUpID = rcm.TypeLookupID WHERE rcm.RegionID =" + req.params.ID + " and (ConfigGroup = 'RegionConfiguration' OR ConfigGroup in (select TypeCode from TypeLookUp where typegroup= 'RegionConfiguration'))", "", req);
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

router.get('/CostBreakdown', function (req, res) {
    db.executeSql(req,"SELECT CostCodeLookUpID, CostCode, CostCodeDescription, CostValue, Mandatory=1, IsCostPercentage FROM CostCodeLookup", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT CostCodeLookUpID, CostCode, CostCodeDescription, CostValue, Mandatory=1, IsCostPercentage FROM CostCodeLookup", "", req);
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

router.get('/CostBreakdown/:ID', function (req, res) {
    db.executeSql(req,"SELECT rccl.CostCodeLookUpID, ccl.CostCode, ccl.CostCodeDescription, rccl.CostPercentage AS CostValue, rccl.CostValueExpression AS CostValueExpression, rccl.Mandatory, rccl.Sequence, IsCostPercentage FROM CostCodeLookup ccl INNER JOIN RegionCostCodeMap rccl ON rccl.CostCodeLookUpID = ccl.CostCodeLookUpID WHERE rccl.RegionID = " + req.params.ID +" ORDER BY rccl.[Sequence]", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT rccl.CostCodeLookUpID, ccl.CostCode, ccl.CostCodeDescription, rccl.CostPercentage AS CostValue, rccl.Mandatory, IsCostPercentage FROM CostCodeLookup ccl INNER JOIN RegionCostCodeMap rccl ON rccl.CostCodeLookUpID = ccl.CostCodeLookUpID WHERE rccl.RegionID = " + req.params.ID + " ORDER BY rccl.[Sequence]", "", req);
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

router.get('/BillingCode', function (req, res) {
    db.executeSql(req,"SELECT BillingCodeLookupID, BillCode, BillCodeName, MarkUp, IsMarkUpOnPercentage, LaborServiceCost FROM BillingCodeLookup", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT BillingCodeLookupID, BillCode, BillCodeName, MarkUp, IsMarkUpOnPercentage, LaborServiceCost FROM BillingCodeLookup", "", req);
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

router.get('/PaymentGateway/:ID', function (req, res) {
    db.executeSql(req, "SELECT isnull(rcm.RegionConfigMapID,0) RegionConfigMapID,g.TypeLookUpID, g.TypeCode, g.TypeName, g.TypeGroup, g.[Description], (SELECT isnull(rcm.RegionConfigMapID,0) RegionConfigMapID,tl.TypeLookUpID, tl.TypeCode, tl.TypeName, tl.TypeGroup, tl.[Description], rcm.[Description] AS AttributeValue FROM TypeLookUp tl LEFT JOIN RegionConfigMap rcm ON rcm.TypeLookupID = tl.TypeLookUpID and rcm.RegionID ='" + req.params.ID + "' WHERE TypeGroup = g.TypeCode FOR JSON PATH) AS Attributes FROM TypeLookUp g left join RegionConfigMap rcm ON rcm.TypeLookUpID = g.TypeLookUpID and rcm.RegionID ='" + req.params.ID +"' WHERE g.TypeGroup = 'PaymentGateway'", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT isnull(rcm.RegionConfigMapID,0) RegionConfigMapID,g.TypeLookUpID, g.TypeCode, g.TypeName, g.TypeGroup, g.[Description], (SELECT isnull(rcm.RegionConfigMapID,0) RegionConfigMapID,tl.TypeLookUpID, tl.TypeCode, tl.TypeName, tl.TypeGroup, tl.[Description], rcm.[Description] AS AttributeValue FROM TypeLookUp tl LEFT JOIN RegionConfigMap rcm ON rcm.TypeLookupID = tl.TypeLookUpID and rcm.RegionID ='" + req.params.ID + "' WHERE TypeGroup = g.TypeCode FOR JSON PATH) AS Attributes FROM TypeLookUp g left join RegionConfigMap rcm ON rcm.TypeLookUpID = g.TypeLookUpID and rcm.RegionID ='" + req.params.ID + "' WHERE g.TypeGroup = 'PaymentGateway'", "", req);
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

router.get('/Currency', function (req, res) {
    db.executeSql(req,"SELECT CurrencyID, '( '+CurrencySymbol+' ) '+CurrencyName CurrencyName, CurrencyCode, CurrencySymbol FROM Currency", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT CurrencyID, CurrencyName, CurrencyCode, CurrencySymbol FROM Currency", "", req);
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

router.get('/TimeZone', function (req, res) {
    db.executeSql(req,"SELECT TimeZoneId as timezoneId, TimeZoneName as timezonename, TimeZoneDescription as timezonedescription, TimeZoneDifference, TimeZoneDifferenceInMinutes, DayTimeSaving, UTCOffset FROM TimeZone WHERE IsActive = 1", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT TimeZoneId as timezoneId, TimeZoneName as timezonename, TimeZoneDescription as timezonedescription, TimeZoneDifference, TimeZoneDifferenceInMinutes, DayTimeSaving, UTCOffset FROM TimeZone WHERE IsActive = 1", "", req);
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

router.get('/CarrierGateway/:ID', function (req, res) {
    db.executeSql(req, "SELECT isnull(rcm.RegionConfigMapID,0) RegionConfigMapID,g.TypeLookUpID, g.TypeCode, g.TypeName, g.TypeGroup, g.[Description], (SELECT isnull(rcm.RegionConfigMapID,0) RegionConfigMapID,tl.TypeLookUpID, tl.TypeCode, tl.TypeName, tl.TypeGroup, tl.[Description], rcm.[Description] AS AttributeValue FROM TypeLookUp tl LEFT JOIN RegionConfigMap rcm ON rcm.TypeLookupID = tl.TypeLookUpID and rcm.RegionID ='" + req.params.ID + "' WHERE TypeGroup = g.TypeCode  ORDER BY tl.SortOrder FOR JSON PATH) AS Attributes FROM TypeLookUp g left join RegionConfigMap rcm ON rcm.TypeLookUpID = g.TypeLookUpID and rcm.RegionID ='" + req.params.ID +"' WHERE g.TypeGroup = 'CarrierGateway'", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT isnull(rcm.RegionConfigMapID,0) RegionConfigMapID,g.TypeLookUpID, g.TypeCode, g.TypeName, g.TypeGroup, g.[Description], (SELECT isnull(rcm.RegionConfigMapID,0) RegionConfigMapID,tl.TypeLookUpID, tl.TypeCode, tl.TypeName, tl.TypeGroup, tl.[Description], rcm.[Description] AS AttributeValue FROM TypeLookUp tl LEFT JOIN RegionConfigMap rcm ON rcm.TypeLookupID = tl.TypeLookUpID and rcm.RegionID ='" + req.params.ID + "' WHERE TypeGroup = g.TypeCode  FOR JSON PATH) AS Attributes FROM TypeLookUp g left join RegionConfigMap rcm ON rcm.TypeLookUpID = g.TypeLookUpID and rcm.RegionID ='" + req.params.ID + "' WHERE g.TypeGroup = 'CarrierGateway'", "", req);
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

router.get('/BillingCode/:ID', function (req, res) {
    db.executeSql(req,"SELECT bcl.BillingCodeLookupID, bcl.BillCode, bcl.BillCodeName, bcl.MarkUp, bcl.IsMarkUpOnPercentage, bcl.LaborServiceCost FROM BillingCodeLookup bcl INNER JOIN RegionBillingCodeMap rbcl ON rbcl.BillingCodeLookupID = bcl.BillingCodeLookupID WHERE rbcl.RegionID =  " + req.params.ID, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT bcl.BillingCodeLookupID, bcl.BillCode, bcl.BillCodeName, bcl.MarkUp, bcl.IsMarkUpOnPercentage, bcl.LaborServiceCost FROM BillingCodeLookup bcl INNER JOIN RegionBillingCodeMap rbcl ON rbcl.BillingCodeLookupID = bcl.BillingCodeLookupID WHERE rbcl.RegionID =  " + req.params.ID, "", req);
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

router.get('/area/:ID', function (req, res) {
    db.executeSql(req, `SELECT DISTINCT RegionCityMap.RegionAreaCodeMapID as TransactionID, RegionCityMap.RegionAreaCodeMapID,
                    City.[Name] as 'City'
                    FROM
                    RegionCityMap
                    INNER JOIN City on RegionCityMap.CityID = City.CityID
                    WHERE RegionCityMap.RegionID =  ${req.params.ID} order by City.[Name]`, function (data, err) {
        if (err) {
            Error.ErrorLog(err, `SELECT DISTINCT
                    RegionCityMap.RegionAreaCodeMapID as TransactionID, RegionCityMap.RegionAreaCodeMapID,
                    City.[Name] as 'City'
                    FROM
                    RegionCityMap
                    INNER JOIN City on RegionCityMap.CityID = City.CityID
                    WHERE RegionCityMap.RegionID =  ${req.params.ID} order by City.[Name]`, "", req);
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
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('Region', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('ReturnRegionID', sql.Int);
        request.execute('usp_Region_Post', function (err, recordsets, returnValue) {
            connection.close();
            if (err) {
                Error.ErrorLog(err, "usp_Region_Post", JSON.stringify(request.parameters), req);
                res.status(400).send({ error: err });
            }
            else {
                res.status(200).send({status: res.statusCode.toString(), ReturnRegionID:request.parameters.ReturnRegionID.value });
            }
        })
    });
});

router.post('/Account', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('Region', sql.NVarChar(sql.MAX), req.body[0].Region);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.execute('usp_AccountRegion_Post', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_AccountRegion_Post", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(res.statusCode.toString());
            }
            res.end();
            connection.close();
        })
    });
});

router.delete('/:ID', function (req, res) {
    db.executeSql(req,"DELETE FROM Region WHERE RegionID =" + req.params.ID, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "DELETE FROM Region WHERE RegionID =" + req.params.ID, "", req);
            res.send({ error: err });
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(res.statusCode.toString());
        }
        res.end();
    });
});

router.post("/contryConfiguration", function(req, res) {
    debugger;
    console.log(JSON.stringify(req.body));
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function() {
      var request = new sql.Request(connection);
      request.input("data", sql.NVarChar(sql.MAX), JSON.stringify(req.body));
      request.input("userid", sql.Int, req.userlogininfo.UserID);
      request.execute("usp_country_service_label_configuration", function(
        err,
        recordsets,
        returnValue
      ) {
        connection.close();
        if (err) {
          Error.ErrorLog(
            err,
            "usp_country_service_label_configuration",
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

  router.get('/CarrierGateway/:ID', function (req, res) {
    db.executeSql(req, "SELECT isnull(rcm.regionConfigMapID,0) regionConfigMapID,g.TypeLookUpID, g.TypeCode, g.TypeName, g.TypeGroup, g.[Description], (SELECT isnull(rcm.regionConfigMapID,0) regionConfigMapID,tl.TypeLookUpID, tl.TypeCode, tl.TypeName, tl.TypeGroup, tl.[Description], rcm.[Description] AS AttributeValue FROM TypeLookUp tl LEFT JOIN regionConfigMap rcm ON rcm.TypeLookupID = tl.TypeLookUpID and rcm.regionID ='" + req.params.ID + "' WHERE TypeGroup = g.TypeCode  ORDER BY tl.SortOrder FOR JSON PATH) AS Attributes FROM TypeLookUp g left join regionConfigMap rcm ON rcm.TypeLookUpID = g.TypeLookUpID and rcm.regionID ='" + req.params.ID +"' WHERE g.TypeGroup = 'CarrierGateway'", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT isnull(rcm.regionConfigMapID,0) regionConfigMapID,g.TypeLookUpID, g.TypeCode, g.TypeName, g.TypeGroup, g.[Description], (SELECT isnull(rcm.regionConfigMapID,0) regionConfigMapID,tl.TypeLookUpID, tl.TypeCode, tl.TypeName, tl.TypeGroup, tl.[Description], rcm.[Description] AS AttributeValue FROM TypeLookUp tl LEFT JOIN regionConfigMap rcm ON rcm.TypeLookupID = tl.TypeLookUpID and rcm.regionID ='" + req.params.ID + "' WHERE TypeGroup = g.TypeCode  FOR JSON PATH) AS Attributes FROM TypeLookUp g left join regionConfigMap rcm ON rcm.TypeLookUpID = g.TypeLookUpID and rcm.regionID ='" + req.params.ID + "' WHERE g.TypeGroup = 'CarrierGateway'", "", req);
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
