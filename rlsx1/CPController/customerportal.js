var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var helper = require('../UtilityLib/BlobHelper');
var multer = require('multer');
var upload = multer({ dest: '../Uploads/' })
var Error = require('../shared/ErrorLog');

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var str = JSON.stringify(req.body);
        var request = new sql.Request(connection);
        request.input('JsonData', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(100));
        request.execute('usp_import_CustomerSO', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_import_CustomerSO", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send(recordsets);
            }            
        })
    });
});

router.post('/SubmitCustomerSO', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var str = JSON.stringify(req.body);
        var request = new sql.Request(connection);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.execute('usp_SubmitCustomerSOReturn', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_SubmitCustomerSOReturn", JSON.stringify(req.body), req);
                res.send({ error: err });
            }
            else {
                res.send(recordsets);
            }
        })
    });
});

router.post('/updatetrackingnumber', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('RMAID', sql.NVarChar(400), req.body.RMAID);
        request.input('Carrier', sql.NVarChar(400), req.body.Carrier);
        request.input('LabelURL', sql.NVarChar(400), req.body.LabelURL);
        request.input('TrackingNumber', sql.NVarChar(400), req.body.TrackingNumber);
        request.execute('usp_updateRMAShippingLabel', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_updateRMAShippingLabel", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })
    });
});

//Quotation Approval
router.get('/quoteapproval/:RmaNumber/:CustomerID', function (req, res) {

    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        console.dir(req.body);
        request.input('RMANumber', sql.NVarChar(50), req.params.RmaNumber);
        request.input('UserID', sql.Int, req.params.CustomerID);
        request.execute('USP_CPQuoteApproval', function (err, recordsets, returnValue) {
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.get('/reasonlist', function (req, res) {

    db.executeSql(req, `select c.RMAActionCodeID as id, c.RMAActionName as reason 
                        from RMAActionCode c 
                        INNER JOIN TypeLookUp t on t.TypeLookUpID=c.RMAActionTypeID
                        where t.TypeGroup= 'Reject Reason' and  t.IsActive=1`,
        function (data, err) {
            if (err) {
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});

router.post('/updatequotation', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('data', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.NVarChar(100));
        request.execute('Usp_UpdateQuotationStatus', function (err, recordsets, returnValue) {
            if (err) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ success: false, message: "Error Occured: " + err }));
                res.end;
            }
            else {
                res.send({ success: true, message: request.parameters.result.value });
            }
            connection.close();
        })
    }).catch(err => {
        // ... error checks 
    });

});

//signup
var cpUpload = upload.fields([{ name: 'UserImage', maxCount: 1 }])
router.post('/signup', cpUpload, function (req, res) {
    var savetodb = function () {
        var connection = new sql.Connection(settings.DBconfig(req));
        connection.connect().then(function () {
            var request = new sql.Request(connection);
            console.dir(req.body);
            request.input('data', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
            request.input('ImageUrl', sql.NVarChar(500), req.ImageUrl);
            request.output('result', sql.NVarChar(100));

            request.execute('Usp_RegisterCPCustomer', function (err, recordsets, returnValue) {
                if (err) {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.write(JSON.stringify({ success: false, message: "Error Occured: " + err }));
                    res.end;
                }
                else {
                    res.send({ recordsets: recordsets, result: request.parameters.result.value });
                    console.dir(recordsets);
                    console.dir(request.parameters.result.value);
                    connection.close();
                }
            })
        });
    }

    if (req.files['UserImage'] != undefined) {
        helper.uploadFile('consumer-files', req.files['UserImage'][0], function (error, result) {
            if (!error) {
                req.ImageUrl = result;
                savetodb();
            }
        });
    }
    else {
        req.ImageUrl = '';
        savetodb();
    }
});

router.post('/checkemail', function (req, res) {

    db.executeSql(req, `select count(a.EmailID) as IsExists from (
                        select Email AS EmailID from Users where UserType = 'CPExternal' 
                        Union 
                        select EmailID from CPCustomer ) a
                        where UPPER(a.EmailID) = UPPER('${req.body.email}') `, function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.post('/checkusername', function (req, res) {

    db.executeSql(req, `select count(a.UserName) as IsExists from (
                        select UserName from Users where UserType = 'CPExternal' 
                        Union 
                        select UserName from CPCustomer ) a
                        where UPPER(a.UserName) = UPPER('${req.body.username}') `
        , function (data, err) {
            if (err) {
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});

router.get('/state/:stateid', function (req, res) {
    var stid = req.params.stateid;
    db.executeSql(req, `select StateID, StateName, CountryID from state where IsActive=1 and CountryID = ${stid} `, function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/country', function (req, res) {

    db.executeSql(req, `select CountryID, CountryName from Country where IsActive=1`, function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.post('/typelookup', function (req, res) {

    db.executeSql(req, `SELECT TypeLookUpID as TypeLookUpID ,[TypeCode] ,[TypeName] ,[Description] ,[IsActive] 
        ,case when IsActive=1 then 'fa fa-check-circle' else 'fa fa-times-circle' end [Active], [SortOrder], TypeGroup
        FROM [TypeLookUp] where typegroup IN (select items from dbo.Split('${req.body.join(',')}',',')) `, function (data, err) {
            if (err) {
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});

router.get('/getrmadetail/:SerialNumber', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('SerialNumber', sql.NVarChar(100), req.params.SerialNumber);
        request.execute('usp_GetRMADetailForConsumerReturn', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetRMADetailForConsumerReturn", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })
    });
});

router.get('/gettemplatedetail/:PageId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('PageId', sql.NVarChar(100), req.params.PageId);
        request.execute('usp_getB2CReturnPageContent', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_getB2CReturnPageContent", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
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

router.get('/GetGenerateCPRMABy/:ModuleID/:Code', function (req, res) {

    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        console.dir(req.body);
        request.input('ModuleID', sql.Int, req.params.ModuleID);
        request.input('Code', sql.NVarChar(50), req.params.Code);
        request.execute('usp_GenerateCPRMABy', function (err, recordsets, returnValue) {
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

router.get('/GetOtherSetupValue/:code', function (req, res) {

    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        console.dir(req.body);
        request.input('Code', sql.NVarChar(40), req.params.code);
        request.execute('usp_GetOtherSetupValue', function (err, recordsets, returnValue) {
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.get('/GetRMADetailsByID/:SRODID', function (req, res) {

    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        console.dir(req.body);
        request.input('SRODID', sql.NVarChar(100), req.params.SRODID);
        request.execute('usp_GetRMADetailsByID', function (err, recordsets, returnValue) {
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


//product Registration
router.get('/product', function (req, res) {

    db.executeSql(req, ` select ItemMasterID as id, ItemName  from ItemMaster Order By ItemName `, function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
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

router.post('/registerproduct', cpUpload, function (req, res) {

    helper.uploadFile('consumer-files', req.files['SNScan'][0], function (error, result) {
        if (!error) { req.SNScanUrl = result; }
        helper.uploadFile('consumer-files', req.files['Invoice'][0], function (error1, result1) {
            if (!error1) { req.InvoiceUrl = result1; }

            var connection = new sql.Connection(settings.DBconfig(req));
            connection.connect().then(function () {
                var request = new sql.Request(connection);
                console.dir(req.body);
                request.input('data', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
                request.input('InvoiceUrl', sql.NVarChar(500), req.InvoiceUrl);
                request.input('SNScanUrl', sql.NVarChar(500), req.SNScanUrl);
                request.output('result', sql.NVarChar(100));

                request.execute('Usp_RegisterCustomerProduct', function (err, recordsets, returnValue) {
                    if (err) {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.write(JSON.stringify({ success: false, message: "Error Occured: " + err }));
                        res.end;
                    }
                    else {
                        res.send({ recordsets: recordsets, result: request.parameters.result.value });
                        console.dir(recordsets);
                        console.dir(request.parameters.result.value);
                        connection.close();
                    }
                })
            });
        });
    });;
});

router.get('/GetReturnReasonModelWise/:SerialNumber', function (req, res) {

    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        console.dir(req.body);
        request.input('SerialNumber', sql.NVarChar(50), req.params.SerialNumber);        
        request.execute('usp_GetReturnReasonModelWise', function (err, recordsets, returnValue) {
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

var uUpload = upload.fields([{ name: 'UserImage', maxCount: 1 }])
router.post('/userimage', uUpload, function (req, res) {

    helper.uploadFile('consumer-files', req.files['UserImage'][0], function (error1, result1) {
        if (!error1) { req.ImageUrl = result1; }

        db.executeSql(req, `update users set UserImage = '${req.ImageUrl}' where UserID = ${req.body.UserID} `, function (data, err) {
            if (err) {
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
                res.end();
            }
            else {
                res.send({ url: req.ImageUrl, result: 'Success' });
            }

        });

    });;
});





module.exports = router;