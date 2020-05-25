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
        request.execute('usp_Node_GetAll', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_Node_GetAll", JSON.stringify(request.parameters), req);

            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();

        })
    });
});


router.get('GetNodeById/:Id', function (req, res) {

    db.executeSql(req, "SELECT NodeId as ID , [Node], [IsActive] FROM [Node] where NodeId=" + req.params.Id, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT NodeId as ID , [Node], [IsActive] FROM [Node] where NodeId=" + req.params.Id, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();



    });
});

router.get('/loadAll', function (req, res) {
    db.executeSql(req, "SELECT NodeId as ID , [Node] from Node where IsActive=1", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT NodeId as ID , [Node] from Node where IsActive=1", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();
    });
});


router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('Node', sql.NVarChar(sql.MAX), req.body.Node);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.execute('usp_node_post', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_node_post", JSON.stringify(request.parameters), req);
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

router.put('/:NodeID', function (req, res) {
    //var timezoneid = req.params.TimeZoneId;
    db.executeSql(req, "Update [Node] SET [Node] ='" + req.body.Node + "', ModifyDate=GETUTCDATE(), ModifyBy=" + req.body.ModifyBy + ", IsActive = " + (req.body.IsActive ? 1 : 0) + " Where NodeId=" + req.params.NodeID, function (data, err) {
        if (err) {

            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(1);
        }
        res.end();


    });
});

router.delete('/:NodeId', function (req, res) {
    db.executeSql(req, "delete from [Node] where NodeId=" + req.params.NodeId, function (data, err) {
        if (err) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(res.statusCode.toString());
        }
        res.end();
    });
});

module.exports = router;