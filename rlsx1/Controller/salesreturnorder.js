var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var helper = require('../UtilityLib/BlobHelper');
var multer = require('multer');
var upload = multer({ dest: '../Uploads/' })
var Error = require('../shared/ErrorLog');
var http = require('http');

router.get('/:Status/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID/:GridType/:Scope', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('Status', sql.VarChar(100), req.params.Status);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.input("GridType", sql.VarChar(100), req.params.GridType);
        request.input("Scope", sql.VarChar(100), req.params.Scope);
        request.output('TotalCount', sql.Int);
        if (req.params.GridType != 'popup') {
            request.execute('GetSalesReturnOrderByPagingNew', function (err, recordsets, returnValue) {
                if (err) {
                    Error.ErrorLog(err, "GetSalesReturnOrderByPagingNew", JSON.stringify(request.parameters), req);
                }
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
                connection.close();
            })
        }
        else {
            request.execute('GetSalesReturnOrderPopUp', function (err, recordsets, returnValue) {
                if (err) {
                    Error.ErrorLog(err, "GetSalesReturnOrderPopUp", JSON.stringify(request.parameters), req);
                }
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
                connection.close();
            })
        }
    });
});

router.get('/GetSROHeaderById/:UserId/:SRODetailId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then( function (error) {
        var request = new sql.Request(connection);
        request.input('UserId', sql.Int, req.params.UserId);
        request.input('SROHeaderId', sql.Int, req.params.SRODetailId);
        request.execute('GetSalesReturnOrderDetails', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetSalesReturnOrderDetails", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })
    });
});

router.get('/GetSalesReturnOrderByStatus/:UserId/:StatusCode/:PartnerId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('UserId', sql.Int, req.params.UserId);
        request.input('StatusCode', sql.VarChar(25), req.params.StatusCode);
        request.input('PartnerId', sql.Int, req.params.PartnerId);
        request.execute('GetSalesReturnOrderByStatus', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetSalesReturnOrderByStatus", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })        
    });
});

router.get('/GetSalesReturnReceivedItems/:UserId/:PartnerID/:ListType', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('UserId', sql.Int, req.params.UserId);
        request.input('PartnerID', sql.Int, req.params.PartnerID);
        request.input('ListType', sql.VarChar(50), req.params.ListType);
        request.execute('GetSalesReturnReceivedItems', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetSalesReturnReceivedItems", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })
    });
});

router.get('/GetSalesReturnRejectedItems/:UserId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('UserId', sql.Int, req.params.UserId);        
        request.execute('GetSalesReturnRejectedItems', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetSalesReturnRejectedItems", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })
    });
});

router.get('/GetSroByRMANumber/:PartnerID/:RMANumber', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);                
        request.input('RMANumber', sql.VarChar(100), req.params.RMANumber);
        request.input('PartnerID', sql.Int, req.params.PartnerID);
        request.execute('GetSroByRMANumber', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetSroByRMANumber", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })
    });
});

router.get('/getrefundamount/:rid/:pid/:qt/:at/:md', function (req, res)
{
    db.executeSql(req, `SELECT dbo.fun_RefundAmount(${req.params.rid}, ${req.params.pid}, ${req.params.qt}, ${req.params.at}, ${req.params.md}) as RefundAmount`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `SELECT dbo.fun_RefundAmount(${req.params.rid}, ${req.params.pid}, ${req.params.qt}, ${req.params.at}, ${req.params.md}) as RefundAmount`, JSON.stringify(request.parameters), req);
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});

router.get('/GetRMALog/:SalesReturnOrderHeaderID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('SalesReturnOrderHeaderID', sql.Int, req.params.SalesReturnOrderHeaderID);        
        request.execute('usp_GetRMALog', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetRMALog", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })        
    });
});

router.get('/GetRMADiscrepancy/:SalesReturnOrderDetailID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('SalesReturnOrderDetailID', sql.Int, req.params.SalesReturnOrderDetailID);
        request.execute('usp_GetRMADiscrepancy', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetRMADiscrepancy", JSON.stringify(request.parameters), req);
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

router.get('/GetRejectReasonForConsumer/:UserId', function (req, res) {
    
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('UserId', sql.Int, req.params.UserId);        
        request.execute('usp_GetRejectReasonForConsumer', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetRejectReasonForConsumer", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })
    });
});

router.get('/GetSODetailsBySONumber/:SONumber/:isCP/:column/:UserPartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        
        var request = new sql.Request(connection);
        request.input('SONumber', sql.VarChar(200), req.params.SONumber);
        request.input('IsCP', sql.VarChar(5), req.params.isCP);
        request.input('column', sql.VarChar(5), req.params.column);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('PartnerID', sql.Int, req.params.UserPartnerID);
        request.execute('GetSODetailsBySONumber', function (err, recordsets, returnValue) {
            if (err)
            {
                Error.ErrorLog(err, "GetSODetailsBySONumber", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })
    });
});

router.get('/GetRMADynamicControls/:RMAActionCodeID/:PartnerID/:SalesReturnOrderDetailID/:q/:p', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));    
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('RMAActionCodeID', sql.Int, req.params.RMAActionCodeID);
        request.input('PartnerID', sql.Int, req.params.PartnerID);
        request.input('SalesReturnOrderDetailID', sql.Int, req.params.SalesReturnOrderDetailID);
        request.input('Quantity', sql.Int, req.params.q);
        request.input('Amount', sql.Int, req.params.p);
        request.execute('usp_getRMACountrols', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_getRMACountrols", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
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

router.get('/GetReturnReason', function (req, res) {

    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        console.dir(req.body);        
        request.execute('usp_GetReturnReason', function (err, recordsets, returnValue) {
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.get('/GetRMADynamicControlsModelWise/:RMAActionCodeID/:ModelID/:SalesReturnOrderDetailID/:q/:p', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('RMAActionCodeID', sql.Int, req.params.RMAActionCodeID);
        request.input('ModelID', sql.Int, req.params.ModelID);
        request.input('SalesReturnOrderDetailID', sql.Int, req.params.SalesReturnOrderDetailID);
        request.input('Quantity', sql.Int, req.params.q);
        request.input('Amount', sql.Int, req.params.p);
        request.execute('usp_getRMACountrolsModelWise', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_getRMACountrolsModelWise", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })
    });
});

router.get('/TrackShipping/:SalesReturnOrderDetailID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);        
        request.input('SalesReturnOrderDetailID', sql.Int, req.params.SalesReturnOrderDetailID);
        request.execute('usp_RMATrackShipping', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_RMATrackShipping", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
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

router.get('/artifacts/:ID', function (req, res) {
    db.executeSql(req, `SELECT  sra.SaleReturnOrderDetailArtifactsID, t.TypeName,a.[FileName], a.FileType, a.ArtifactURL, format(sra.CreatedDate,'MMM dd, yyyy hh:mm') AS CreatedDate
                FROM SaleReturnOrderDetailArtifacts sra INNER JOIN SaleReturnOrderDetailReasonValue srv ON srv.SaleReturnOrderDetailReasonValueID = sra.SaleReturnOrderDetailReasonValueID 
				INNER JOIN Artifact a ON a.ArtifactID = sra.ArtifactID
                INNER JOIN TypeLookUp t ON t.TypeLookUpID = sra.ArtifactTypeID
                WHERE srv.SaleReturnOrderDetailID = ${ req.params.ID}`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `SELECT  sra.SaleReturnOrderDetailArtifactsID, t.TypeName,a.[FileName], a.FileType, a.ArtifactURL, format(sra.CreatedDate,'MMM dd, yyyy hh:mm') AS CreatedDate
                FROM SaleReturnOrderDetailArtifacts sra INNER JOIN SaleReturnOrderDetailReasonValue srv ON srv.SaleReturnOrderDetailReasonValueID = sra.SaleReturnOrderDetailReasonValueID 
				INNER JOIN Artifact a ON a.ArtifactID = sra.ArtifactID
                INNER JOIN TypeLookUp t ON t.TypeLookUpID = sra.ArtifactTypeID
                WHERE srv.SaleReturnOrderDetailID = ${ req.params.ID}`, JSON.stringify(request.parameters), req);
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(data));
            }
            res.end();

        });
});

router.post('/approval', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var str = JSON.stringify(req.body);
        var request = new sql.Request(connection);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('result', sql.VarChar(5000));
        request.execute('usp_ApproveSRO_New', function (err, recordsets) {
            if (err) {
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
                res.end();
            }
            else {
                res.send({ result: request.parameters.result.value });
            }
            connection.close();
        })
    });
});

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var str = JSON.stringify(req.body);
        var request = new sql.Request(connection);
        request.input('Order', sql.VarChar(sql.MAX), JSON.stringify(req.body));
        request.input('IsCP', sql.NVarChar(10), req.body.IsCP);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('SRONumber', sql.VarChar(100));
        request.execute('usp_SalesReturnOrder_Post', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_SalesReturnOrder_Post", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ recordsets: recordsets });
            }
        })
    });
});

router.post('/ResolveDescrapency', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var str = JSON.stringify(req.body);
        var request = new sql.Request(connection);
        request.input('Items', sql.VarChar(sql.MAX), JSON.stringify(req.body));
        request.output('Result', sql.VarChar(100));
        
        request.execute('usp_ResolveDescrapency', function (err, recordsets) {
            if (err) {
                res.write(JSON.stringify({ result: "Error Occured: " + err }));
                res.end();

                Error.ErrorLog(err, "usp_ResolveDescrapency", JSON.stringify(request.parameters), req);                
            }
            else {
                res.send({ result: request.parameters.Result.value });
            }
        })
    });
});

var uUpload = upload.fields([{ name: 'SRODocs', maxCount: 1 }])
router.post('/doc', uUpload, function (req, res) {
    helper.uploadFileWithBase64('sro-files', req.files['SRODocs'][0], function (error1, result1) {
        if (!error1) {
            var output = { result: 'Success', FileName: req.files['SRODocs'][0].originalname, FileUrl: result1, SystemGenName: result1.substring(result1.lastIndexOf('/')) };
            res.send(JSON.stringify(output));
        }
        else {
            res.send({ error: err });
        }
    });
});

router.post('/uploadFileWithBase64', uUpload, function (req, res) {
    helper.uploadFileWithBase64('sro-files', "", req.body.ImageString, function (error1, result1) {
        if (!error1) {
            
            var output = { result: 'Success', FileName: result1.FileName, FileUrl: result1.FileURL, SystemGenName: result1.FileURL.substring(result1.FileURL.lastIndexOf('/')) };
            res.send(JSON.stringify(output));
        }
        else {
            res.send({ error: err });
        }
    });
});


router.get('/ExportToExcel/:orderType', function (req, res) {
    var OrderType = req.params.orderType;
    var nodeExcel = require('excel-export');
    var dateFormat = require('dateformat');
    var sql = "DECLARE @moduleStatusMapID INT SELECT @moduleStatusMapID = ISNULL(ModuleStatusMapID, 0) FROM ModuleStatusMap where ModuleID = 1250 AND StatusID in (select StatusID from Statuses where StatusName = '" + OrderType + "') SELECT Vendor.PartnerName as VendorName, Partner.PartnerName as PartnerName, PONumber, PODate, ShipVia.TypeName as ShipVia, Payterms.TypeName As Payterm FROM [POHeader] INNER JOIN Partners Vendor ON Vendor.PartnerID = POHeader.VendorPartnerId INNER JOIN TypeLookUp Payterms ON Payterms.TypeLookUpId = POHeader.PayTermTypeID INNER JOIN TypeLookUp ShipVia ON ShipVia.TypeLookUpId = POHeader.ShipViaTypeId INNER JOIN Partners Partner ON Partner.PartnerID = POHeader.PartnerID INNER JOIN Users User_CreatedBy  ON User_CreatedBy.Userid = [POHeader].CreatedBy INNER JOIN Users User_ModifyBy ON User_ModifyBy.Userid = [POHeader].ModifyBy WHERE POHeader.ModuleStatusMapID = + CAST(@moduleStatusMapID AS VARCHAR(50))";
   
    var styles = {
        headerDark: {
            fill: {
                fgColor: {
                    rgb: 'FF000000'
                }
            },
            font: {
                color: {
                    rgb: 'FFFFFFFF'
                },
                sz: 14,
                bold: true,
                underline: true
            }
        },
        cellPink: {
            fill: {
                fgColor: {
                    rgb: 'FFFFCCFF'
                }
            }
        },
        cellGreen: {
            fill: {
                fgColor: {
                    rgb: 'FF00FF00'
                }
            }
        }
    };

    var conf = {}

    conf.cols = [{
        caption: 'SalesReturn Order Number',
        type: 'string',
        width: 30,
        headerStyle: styles.headerDark
    },
    {
        caption: 'SO Number',
        type: 'string',
        width: 20,
        headerStyle: styles.headerDark
    },
    {
        caption: 'Order Date',
        type: 'date',
        width: 15,
        headerStyle: styles.headerDark
    },
    {
        caption: 'Item Qty',
        type: 'string',
        width: 20,
        headerStyle: styles.headerDark
    },
    {
        caption: 'Requester',
        type: 'string',
        width: 15,
        headerStyle: styles.headerDark
    },
    {
        caption: 'Return Reason',
        type: 'string',
        width: 20,
        headerStyle: styles.headerDark
    },
    {
        caption: 'Status',
        type: 'string',
        width: 15,
        headerStyle: styles.headerDark
    },
    {
        caption: 'Created By',
        type: 'string',
        width: 15,
        headerStyle: styles.headerDark
    }
    ];

   
db.executeSql(req, sql, function (rows, err) {
        arr = [];
        for (i = 0; i < rows.length; i++) {
            SalesReturnOrderNumber = rows[i].SalesReturnOrderNumber;
            SONumber = rows[i].SONumber;
            OrderDate = rows[i].OrderDate;
            ItemQty = rows[i].ItemQty;
            Requester = rows[i].Requester;
            ReturnReason = rows[i].ReturnReason;
            Status = rows[i].Status;
            CreatedBy = rows[i].CreatedBy;

            a = [SalesReturnOrderNumber, SONumber, (dateFormat(OrderDate, "dd/mm/yyyy")), ItemQty, Requester, ReturnReason, Status, CreatedBy];
            arr.push(a);
        }
        conf.rows = arr;
        console.dir(conf);
        var result = nodeExcel.execute(conf);
        res.setHeader("Content-Disposition", "attachment;filename=" + OrderType + "SROrder.xlsx");
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.end(result, 'binary');
    });
});
module.exports = router;