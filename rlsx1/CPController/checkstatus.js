var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');

var fs = require('fs');
var pdf = require('html-pdf');
var options = { format: 'Letter' };

router.get('/AddressLabel/:SOID/:SubDomain', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);
               
        sqlRequest.input('SalesReturnOrderDetailID', sql.Int, req.params.SOID);
        sqlRequest.output('FileName', sql.VarChar(100));
        sqlRequest.output('ReportHTMLOut', sql.NVarChar(sql.MAX));        
        sqlRequest.execute('usp_RMAAddressLabel', function (err, recordsets, returnValue) {

            if (err) {
                res.send(JSON.stringify({ "Result": err })); 
                }
            else {

                var filename = sqlRequest.parameters.FileName.value;                

                pdf.create(sqlRequest.parameters.ReportHTMLOut.value).toStream(function (err, stream) {

                    var ReportPath = "../../RL21WebSSL/Assets/Report/";
                    if (req.params.SubDomain.indexOf('localhost') >= 0) {
                        ReportPath = "../RL21.Web/Assets/Report/";
                    }
                    stream.pipe(fs.createWriteStream(ReportPath + filename));
                    res.send(JSON.stringify({ "Result": "Success", "FileName": filename }));
                }); 
                                              
            }
            
            connection.close();
        })
    });
});

router.get('/getTypeLookUpByName/:typegroup', function (req, res) {

    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        console.dir(req.body);
        request.input('TypeGroup', sql.NVarChar(100), req.params.typegroup);
        request.execute('usp_GetTypeLookUpByName', function (err, recordsets, returnValue) {
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.put('/:SalesReturnOrderDetailID', function (req, res) {
  
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('SalesReturnOrderDetailID', sql.Int, req.params.SalesReturnOrderDetailID);
        request.input('Alldata', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_UpdateCustomerAwb', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'usp_UpdateCustomerAwb', JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});


router.get('/RMAReport/:SOID/:SubDomain', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('SalesReturnOrderHeaderID', sql.Int, req.params.SOID);
        sqlRequest.output('FileName', sql.VarChar(100));
        sqlRequest.output('ReportHTMLOut', sql.NVarChar(sql.MAX));
        sqlRequest.execute('usp_RMAReport', function (err, recordsets, returnValue) {

        if (err) {
            res.send(JSON.stringify({ "Result": err }));
        }
        else {

            var filename = sqlRequest.parameters.FileName.value;

            pdf.create(sqlRequest.parameters.ReportHTMLOut.value).toStream(function (err, stream) {

                var ReportPath = "../../RL21WebSSL/Assets/Report/";
                if (req.params.SubDomain.indexOf('localhost') >= 0) {
                    ReportPath = "../RL21.Web/Assets/Report/";
                }
                stream.pipe(fs.createWriteStream(ReportPath + filename));
                res.send(JSON.stringify({ "Result": "Success", "FileName": filename }));
            });                       

        }

            connection.close();
        })
    });
});

//checkStatus
router.post('/checkstatus', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        console.dir(req.body);
        request.input('data', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.input('UserID', sql.Int, parseInt(req.userlogininfo.UserID));
        request.output('result', sql.VarChar(100));
        request.execute('GetConsumerRequestDetail', function (err, recordsets, returnValue) {
            res.send({ recordsets: recordsets, result: request.parameters.result.value });
            console.dir(recordsets);
            console.dir(request.parameters.result.value);
            connection.close();
        })
    });
});

router.get('/getrequests/:SearchCaluse', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
       
        console.dir(req.body);
        request.input('SearchCaluse', sql.VarChar(500), req.params.SearchCaluse);
        request.execute('usp_customer_GetRMARequests', function (err, recordsets, returnValue) {
            res.send({ recordsets: recordsets});
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.get('/checkreturnstatus/:RMANumber', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);        
        request.input('RMANumber', sql.VarChar(150), req.params.RMANumber);        
        request.execute('usp_GetRMAStatus', function (err, recordsets, returnValue) {
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.get('/TrackShipping/:SalesReturnOrderDetailID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);

        console.dir(req.body);        
        request.input('SalesReturnOrderDetailID', sql.Int, req.params.SalesReturnOrderDetailID);        
        request.execute('usp_RMATrackShipping', function (err, recordsets, returnValue) {
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});


module.exports = router;