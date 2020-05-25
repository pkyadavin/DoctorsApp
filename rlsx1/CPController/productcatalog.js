var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var helper = require('../UtilityLib/BlobHelper');
var multer = require('multer');
var upload = multer({ dest: '../Uploads/' })
var Error = require('../shared/ErrorLog');

var fs = require('fs');
var pdf = require('html-pdf');
var options = { format: 'Letter' };

router.get('/AddressLabel/:SOID/:name', function (request, response) {   
    var connection = new sql.Connection(settings.DBconfig(request));
    connection.connect().then(function (error) {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('SalesReturnOrderDetailID', sql.Int, request.params.SOID);        
        sqlRequest.output('FileName', sql.VarChar(100));
        sqlRequest.output('ReportHTMLOut', sql.VarChar(10000));
        sqlRequest.execute('usp_RMAAddressLabel', function (err, recordsets, returnValue) {

            if (err) {
                Error.ErrorLog(err, `usp_RMAAddressLabel`, JSON.stringify(request.parameters), request);
                console.dir(sqlRequest.parameters.ReportHTMLOut.value);
            }
            else {
            }
        })
    });
});

router.get('/RMAReport/:SOID/:name', function (request, response) {
    var connection = new sql.Connection(settings.DBconfig(request));
    connection.connect().then(function (error) {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('SalesReturnOrderHeaderID', sql.Int, request.params.SOID);
        sqlRequest.output('FileName', sql.VarChar(100));
        sqlRequest.output('ReportHTMLOut', sql.VarChar(10000));
        sqlRequest.execute('usp_RMAReport', function (err, recordsets, returnValue) {

            if (err) {
                Error.ErrorLog(err, `usp_RMAReport`, JSON.stringify(request.parameters), request);
                console.dir(sqlRequest.parameters.ReportHTMLOut.value);
            }
            else {
                console.dir(sqlRequest.parameters.ReportHTMLOut.value);
            }

            pdf.create(sqlRequest.parameters.ReportHTMLOut.value).toStream(function (err, stream) {
                var filename = sqlRequest.parameters.FileName.value;
                stream.pipe(fs.createWriteStream('../RL21.Web/Assets/Report/' + filename));
            });
        })
    });
});


router.get('/Load', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);

        console.dir(req.body);       
        request.execute('usp_LoadProductCatalog', function (err, recordsets, returnValue) {
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.get('/GetItemByModelId/:ItemModelID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        
        request.input('ItemModelID', sql.Int, parseInt(req.params.ItemModelID));
        request.execute('usp_GetItemByModelId', function (err, recordsets, returnValue) {
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.get('/GetItem/:ItemMasterID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);

        request.input('ItemMasterID', sql.Int, parseInt(req.params.ItemMasterID));
        request.execute('usp_GetItemByID', function (err, recordsets, returnValue) {
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.get('/GetReturnReasonType/:ModuleID/:Code', function (req, res) {

    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        console.dir(req.body);
        request.input('ModuleID', sql.Int, req.params.ModuleID);
        request.input('Code', sql.NVarChar(50), req.params.Code);
        request.execute('usp_GetReturnReasonType', function (err, recordsets, returnValue) {
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
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

router.get('/CheckSerialNumber/:SerialNumber', function (req, res) {

    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        console.dir(req.body);
        request.input('SerialNumber', sql.NVarChar(40), req.params.SerialNumber);
        request.execute('usp_CheckSerialNumber', function (err, recordsets, returnValue) {
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.get('/GetRMADynamicControls/:RMAActionCodeID/:PartnerID/:SalesReturnOrderDetailID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('RMAActionCodeID', sql.Int, req.params.RMAActionCodeID);
        request.input('SalesReturnOrderDetailID', sql.Int, req.params.SalesReturnOrderDetailID);
        request.execute('usp_getRMAControlsFroCP', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_getRMAControlsFroCP", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })
    });
});

router.get('/GetDynamicControlsModelWise/:RMAActionCodeID/:SalesReturnOrderDetailID/:ItemModelId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('RMAActionCodeID', sql.Int, req.params.RMAActionCodeID);
        request.input('SalesReturnOrderDetailID', sql.Int, req.params.SalesReturnOrderDetailID);
        request.input('ItemModelID', sql.Int, req.params.ItemModelId);
        request.execute('usp_GetDynamicControlsModelWise', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetDynamicControlsModelWise", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })
    });
});

router.get('/GetCountry', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        
        request.execute('usp_get_country', function (err, recordsets, returnValue) {
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.get('/GeStateByCountryID/:CountryID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);

        request.input('CountryID', sql.Int, req.params.CountryID);
        request.execute('usp_GetStateByCountryID', function (err, recordsets, returnValue) {
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.post('/SaveProductCatalog', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var str = JSON.stringify(req.body);
        var request = new sql.Request(connection);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body)); 
        request.input('UserID', sql.Int, req.userlogininfo.UserID);   
        request.output('RESULT', sql.VarChar(500));
        request.execute('usp_SubmitProductCatalog', function (err, recordsets) {
            if (err) {
                res.send({ error: err });
            }
            else {               
                res.send(recordsets);
            }
        })
    });
});

router.get('/GetRMAStatus/:RMANumber', function (req, res) {
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

router.get('/ShippingLabel/:SalesReturnOrderDetailID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('SalesReturnOrderDetailID', sql.Int, req.params.SalesReturnOrderDetailID);
        request.execute('usp_GetShippingLabelUrl', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetShippingLabelUrl", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })
    });
});

var uUpload = upload.fields([{ name: 'SRODocs', maxCount: 1 }])
router.post('/doc', uUpload, function (req, res) {
    helper.uploadFile('sro-files', req.files['SRODocs'][0], function (error1, result1) {
        if (!error1) {
            var output = { result: 'Success', FileName: req.files['SRODocs'][0].originalname, FileUrl: result1, SystemGenName: result1.substring(result1.lastIndexOf('/')) };
            res.send(JSON.stringify(output));
        }
        else {
            res.send({ error: err });
        }
    });
});

module.exports = router;