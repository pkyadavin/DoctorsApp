var express = require('express');
var router = express.Router();
var settings = require('../shared/Settings');
/* GET users listing. */
var sql = require('mssql');
var Error = require('../shared/ErrorLog');
var db = require('../shared/DBAccess');

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
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('TotalCount', sql.Int);
        request.execute('GetKeyFieldGenRuleWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetKeyFieldGenRuleWithPaging', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            connection.close();
        })
    }).catch(function (err) {
        console.log(err);
    });    
});

router.get('/hints', function (req, res) {
    db.executeSql(req,"select * from PrefixMaster", function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'select * from PrefixMaster', "", req);
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

router.delete('/:ID', function (req, res) {
    var ID = req.params.ID;
    db.executeSql(req,"delete KeyFieldAutoGenRule where KeyFieldAutoGenRuleID = " + ID, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "delete KeyFieldAutoGenRule where KeyFieldAutoGenRuleID = " + ID, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
          
        }
        res.end();
        
    });
});

router.get('/getGenerateRules/:rule/:numberLength/:partnerID', function (req, res) {
    var rule = req.params.rule;
    var numberLength = req.params.numberLength;
    var partnerID = req.params.partnerID;
    db.executeSql(req,"select dbo.[udf_ShowAutoNumber]('" + rule + "'," + numberLength + "," + partnerID + ")", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "select dbo.[udf_ShowAutoNumber]('" + rule + "'," + numberLength + "," + partnerID + ")", "", req);
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
        req.body.CreatedBy = req.userlogininfo.UserID;
        request.input('json', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('returnValue', sql.VarChar(20));
        request.execute('USP_SaveKeyFieldGenRule', function (err, data) {
            if (err) {
                Error.ErrorLog(err, "USP_SaveKeyFieldGenRule", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: request.parameters.returnValue.value }));//request.parameters.rid.value
            }
            res.end();
            connection.close();
        })
    });

});


module.exports = router;