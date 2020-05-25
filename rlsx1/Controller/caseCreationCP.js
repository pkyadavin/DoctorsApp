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
        request.execute('usp_getCaseCreation', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_getCaseCreation', JSON.stringify(request.parameters), req);
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
    console.log('amrendra case save')
    connection.connect(function (error) {

        var request = new sql.Request(connection);
        request.input('userID', sql.Int, req.body.UserID);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.VarChar(20));
        request.execute('usp_SaveCaseCreation', function (err, recordsets, returnValue) {
            if (err) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: request.parameters.result.value,caseNo:recordsets }));
            }
            res.end();
            connection.close();
        })
    });
});


router.delete('/Remove/:ID', function (req, res) {
    var id = req.params.ID;

    db.executeSql(req, 'delete from CaseCreation where CaseID =' + id, function (err, data) {
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

// router.get('/SearchPOWo/:PoWoNo', function (req, res) {
//     var PoWoNo = req.params.PoWoNo;
//     console.write('amrendra search powo ',PoWoNo);
//     var connection = new sql.Connection(settings.DBconfig(req));
//     connection.connect(function (error) {
//         var request = new sql.Request(connection);
//         request.input("OrderNO", sql.VarChar(50), PoWoNo);
//         request.output('result', sql.NVarChar(sql.MAX));
//         request.execute('usp_getOrderByNo', function (err, recordsets, returnValue) {
//             if (err) {
//                 Error.ErrorLog(err, 'usp_getOrderByNo', JSON.stringify(request.parameters), req);
//                 res.writeHead(200, { "Content-Type": "application/json" });
//                 res.write(JSON.stringify({ data: "Error Occured: " + err }));
//             }
//             else {
//                 res.send({ recordsets: recordsets, result: request.parameters.result.value });
//             }
//             connection.close();
//         })
//     });
// });

router.get('/SearchPOWo/:PoWoNo', function(req,res){
    var headerID = req.params.PoWoNo;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input("OrderNO", sql.VarChar(50), headerID);
        request.output('result', sql.NVarChar(sql.MAX));
        request.execute('usp_getOrderByNo', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_getOrderByNo', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: recordsets, result: request.parameters.result.value}));
            }
            res.end();
            connection.close() ;
        })
    });
});
router.get('/GetStateByCountry/:CountryID', function(req,res){
    var countryid = req.params.CountryID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input("CountryID", sql.VarChar(50), countryid);
        request.execute('usp_GetStateBy_CountryID', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_GetStateBy_CountryID', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: recordsets}));
            }
            res.end();
            connection.close() ;
        })
    });
});
router.get('/GetColorSizeIssueCountry', function(req,res){
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.execute('usp_getColorSizeIssueCountry', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_getColorSizeIssueCountry', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: recordsets}));
            }
            res.end();
            connection.close() ;
        })
    });
});

router.get('/GetPersonalInfoByNo/:AccountNo', function(req,res){
    var AccountNo = req.params.AccountNo;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input("accountNo", sql.VarChar(50), AccountNo);
        request.execute('usp_getAccountStore', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_getAccountStore', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: recordsets}));
            }
            res.end();
            connection.close() ;
        })
    });
});
module.exports = router;