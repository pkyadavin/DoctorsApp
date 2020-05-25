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
        request.input("PartnerID", sql.VarChar(1000), req.params.PartnerID);
        request.output('TotalCount', sql.Int);
        request.execute('usp_RouteLocation_GetAll', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_RouteLocation_GetAll', JSON.stringify(request.parameters), req);
            }        
        res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
        console.dir(recordsets);
        console.dir(request.parameters.TotalCount.value);
        connection.close();
        })
    });
});



router.get('/:customerid', function (req, res) {  
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('LocationID', sql.Int, req.params.customerid);
        request.execute('usp_RouteLocation_GetById', function (err, recordsets, returnValue) {    
            if (err) {
                Error.ErrorLog(err, 'usp_RouteLocation_GetById', JSON.stringify(request.parameters), req);
            }       
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.get('/AllCountry/:userId', function (req, res) {
    db.executeSql(req, "select CountryID,CountryName from Country", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "select CountryID,CountryName from Country", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/AllState/:countryId', function (req, res) {
    var countryId = req.params.countryId;
    var sqlQuery;
    if (countryId == 0) {
        sqlQuery = "select StateID,StateName from State where CountryId = 0";
    }
    else {
        sqlQuery = "select StateID,StateName from State where CountryId=" + countryId;
    }

    db.executeSql(req, sqlQuery, function (data, err) {
        if (err) {
            Error.ErrorLog(err, sqlQuery, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.post('/:UserId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.input('UserId', sql.Int, req.params.UserId);
        request.output('result', sql.VarChar(20));
        request.execute('usp_RoutedLocation_SaveDetail', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_RoutedLocation_SaveDetail', JSON.stringify(request.parameters), req);
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

module.exports = router;
