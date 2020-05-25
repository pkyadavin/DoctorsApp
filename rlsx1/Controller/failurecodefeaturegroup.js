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
        request.execute('GetFailureCodeFeatureGroupWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetFailureCodeFeatureGroupWithPaging', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            connection.close();
        })
    });
});

router.get('/:FailureCodeFeatureGroupId', function (req, res) {
    var failurecodefeaturegroupid = req.params.FailureCodeFeatureGroupId;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('FailureCodeFeatureGroupId', sql.Int, failurecodefeaturegroupid);
        request.execute('GetFailureCodeFeatureGroupByID', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetFailureCodeFeatureGroupByID', JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
            connection.close();
        })

    });
});

router.post('/', function (req, res) {
    db.executeSql(req, "INSERT INTO FailureCodeFeatureGroup (FailureCodeFeatureGroupCode, FailureCodeFeatureGroupName, IsActive, CreatedBy, CreatedDate) VALUES ('" + req.body.FailureCodeFeatureGroupCode + "','" + req.body.FailureCodeFeatureGroupName + "' ,'" + req.body.IsActive + "', '" + req.body.CreatedBy +"', GETUTCDATE())", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "INSERT INTO FailureCodeFeatureGroup (FailureCodeFeatureGroupCode, FailureCodeFeatureGroupName, IsActive, CreatedBy, CreatedDate) VALUES ('" + req.body.FailureCodeFeatureGroupCode + "','" + req.body.FailureCodeFeatureGroupName + "' ,'" + req.body.IsActive + "', '" + req.body.CreatedBy + "', GETUTCDATE())","", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write({ data: 0 });
        }
        res.end();
        
    });
});

router.put('/:FailureCodeFeatureGroupId', function (req, res) {
    var failurecodefeaturegroupid = req.params.FailureCodeFeatureGroupId;
    db.executeSql(req,"Update [FailureCodeFeatureGroup] SET [FailureCodeFeatureGroupCode]='" + req.body.FailureCodeFeatureGroupCode + "',[FailureCodeFeatureGroupName] ='" + req.body.FailureCodeFeatureGroupName + "', IsActive = " + (req.body.IsActive ? 1 : 0) + " Where FailureCodeFeatureGroupID=" + failurecodefeaturegroupid, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "Update [FailureCodeFeatureGroup] SET [FailureCodeFeatureGroupCode]='" + req.body.FailureCodeFeatureGroupCode + "',[FailureCodeFeatureGroupName] ='" + req.body.FailureCodeFeatureGroupName + "', IsActive = " + (req.body.IsActive ? 1 : 0) + " Where FailureCodeFeatureGroupID=" + failurecodefeaturegroupid, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(1);
        }
        res.end();


    });
});

module.exports = router;