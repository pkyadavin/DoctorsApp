var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
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
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('TotalCount', sql.Int);
        request.execute('GetTimeZoneWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetTimeZoneWithPaging", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
        })
    });
});

router.get('/', function (req, res) {
    db.executeSql(req,"SELECT TimeZoneId as timezoneId, TimeZoneName as timezonename, TimeZoneDescription as timezonedescription, TimeZoneDifference, TimeZoneDifferenceInMinutes, DayTimeSaving, UTCOffset FROM TimeZone WHERE IsActive = 1", function (data, err) {
        if (err) {            
            Error.ErrorLog(err, "SELECT TimeZoneId, TimeZoneName, TimeZoneDescription, TimeZoneDifference, TimeZoneDifferenceInMinutes, DayTimeSaving, UTCOffset FROM TimeZone WHERE IsActive = 1", "", req);
            res.status(401).send({data:err});
        }
        else {
            res.status(200).send({data:data});
        }
    });
});

router.get('/:TimeZoneId', function (req, res) {
    var timezoneid = req.params.TimeZoneId;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('TimeZoneId', sql.Int, timezoneid);
        request.execute('GetTimezoneByID', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetTimezoneByID", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
            connection.close();
        })

    });
});

router.post('/', function (req, res) {

    db.executeSql(req,"INSERT INTO TimeZone (TimeZoneName, TimeZoneDescription, DayTimeSaving, UTCOffset, IsActive) VALUES ('" + req.body.TimeZoneName + "','" + req.body.TimeZoneDescription + "' ,'" + req.body.DayTimeSaving + "' ,'" + req.body.UTCOffset + "' ,'" + req.body.IsActive +"' )", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "INSERT INTO TimeZone (TimeZoneName, TimeZoneDescription, DayTimeSaving, UTCOffset, IsActive) VALUES ('" + req.body.TimeZoneName + "','" + req.body.TimeZoneDescription + "' ,'" + req.body.DayTimeSaving + "' ,'" + req.body.UTCOffset + "' ,'" + req.body.IsActive + "' )", JSON.stringify(request.parameters), req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(res.statusCode.toString());
        }
        res.end();
        connection.close();
    });
});

router.put('/:TimeZoneId', function (req, res) {
    var timezoneid = req.params.TimeZoneId;
    db.executeSql(req,"Update [TimeZone] SET [TimeZoneName] ='" + req.body.TimeZoneName + "',  [TimeZoneDescription] ='" + req.body.TimeZoneDescription + "',  [DayTimeSaving] = " + (req.body.DayTimeSaving ? 1 : 0) + ",  [UTCOffset] = '" + req.body.UTCOffset + "', IsActive = " + (req.body.IsActive ? 1 : 0) + " Where TimeZoneID=" + timezoneid, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "Update [TimeZone] SET [TimeZoneName] ='" + req.body.TimeZoneName + "',  [TimeZoneDescription] ='" + req.body.TimeZoneDescription + "',  [DayTimeSaving] = " + (req.body.DayTimeSaving ? 1 : 0) + ",  [UTCOffset] = '" + req.body.UTCOffset + "', IsActive = " + (req.body.IsActive ? 1 : 0) + " Where TimeZoneID=" + timezoneid, req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(res.statusCode.toString());
        }
        res.end();
        connection.close();
    });
});

module.exports = router;