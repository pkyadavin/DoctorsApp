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
        request.execute('usp_GetAllRMARepairCommandConfig', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetAllRMARepairCommandConfig", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            }
            connection.close();
        })
    });
});



router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.VarChar(20));
        request.input('UserID', sql.Int, req.body.UserID);
        request.input('ParentID', sql.Int, req.body.ParentID);
       
        request.execute('usp_SaveRMARepairCommandConfig', function (err, recordsets, returnValue) {
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


router.delete('/RemoveLocation/:ID', function (req, res) {
    var id = req.params.ID;

    db.executeSql(req, 'delete from Location where LocationID =' + id, function (err, data) {
        if (err) {
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

router.get('/getActionType', function (req, res) {
    db.executeSql(req, 'WITH CTE AS(select TypeLookUpID,RMAActionTypeID,TypeName ,ROW_NUMBER() OVER(PARTITION BY TypeName ORDER BY TypeName) row_num from'+ 
' RMACommandConfig Inner join Typelookup on typelookupid= RMAActionTypeID and typegroup= \'RMAActionCommand\' ) '+
' SELECT DENSE_RANK() OVER(ORDER BY TypeName) RMACommandConfigID, RMAActionTypeID, TypeName FROM CTE WHERE row_num = 1 ', function (data, err) {
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

router.get('/getParentRMACommand', function (req, res) {
    db.executeSql(req, 'WITH CTE AS(select RMACommandConfigID,RMAActionTypeID ,TypeName ,ROW_NUMBER() OVER(PARTITION BY TypeName ORDER BY TypeName) row_num from RMACommandConfig left join Typelookup on typelookupid=RMAActionTypeID) SELECT DENSE_RANK() OVER(ORDER BY TypeName) RMACommandConfigID,RMAActionTypeID As ParentID, TypeName FROM CTE WHERE row_num = 1 ', function (data, err) {
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