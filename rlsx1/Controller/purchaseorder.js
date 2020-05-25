var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');
router.get('/:Status/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('Status', sql.VarChar(100), req.params.Status);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.output('TotalCount', sql.Int);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.execute('GetPurchaseOrderByPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetPurchaseOrderByPaging", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
        })
    });
});

router.get('/GetPoHeaderById/:PoHeaderId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then( function (error) {
       var request = new sql.Request(connection);
        request.input('PoHeaderId', sql.Int, req.params.PoHeaderId);
        request.execute('GetPurchaseOrderByPoHeaderId', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetPurchaseOrderByPoHeaderId", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })
    });
});

router.get('/GetPoReceivingItemByPoHeaderid/:PoHeaderId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('PoHeaderId', sql.Int, req.params.PoHeaderId);
        request.execute('GetPoReceivingItemByPoHeaderid', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetPoReceivingItemByPoHeaderid", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
        })
    });
});


router.post('/', function (req, res) {
   var connection = new sql.Connection(settings.DBconfig(req));
   connection.connect().then(function (error) {
       var request = new sql.Request(connection);
       request.input('JsonData', sql.VarChar(sql.MAX), JSON.stringify(req.body));
       request.input('PoHeaderId', sql.Int, req.body.POHeaderID);
       request.input('UserId', sql.Int, req.body.UserId);
       request.input('PartnerId', sql.Int, req.body.PartnerId);
       request.output('PoNumber', sql.VarChar(100));
       request.execute('CreateOrUpdatePurchaseOrder', function (err, recordsets, returnValue) {
           if (err) {
               Error.ErrorLog(err, "CreateOrUpdatePurchaseOrder", JSON.stringify(request.parameters), req);
           }
           res.send({ PoNumber: request.parameters.PoNumber.value });
        })
    });
});

router.get('/ExportToExcel2/:orderType', function (req, res) {//  obsolete Method
    var OrderType = req.params.orderType;
    var nodeExcel = require('excel-export');
    var dateFormat = require('dateformat');
    var sql = "DECLARE @moduleStatusMapID INT SELECT @moduleStatusMapID = ISNULL(ModuleStatusMapID, 0) FROM ModuleStatusMap where ModuleID = 40 AND StatusID in (select StatusID from Statuses where StatusName = '" + OrderType + "') SELECT Vendor.PartnerName as VendorName, Partner.PartnerName as PartnerName, PONumber, PODate, ShipVia.TypeName as ShipVia, Payterms.TypeName As Payterm FROM [POHeader] INNER JOIN Partners Vendor ON Vendor.PartnerID = POHeader.VendorPartnerId INNER JOIN TypeLookUp Payterms ON Payterms.TypeLookUpId = POHeader.PayTermTypeID INNER JOIN TypeLookUp ShipVia ON ShipVia.TypeLookUpId = POHeader.ShipViaTypeId INNER JOIN Partners Partner ON Partner.PartnerID = POHeader.PartnerID INNER JOIN Users User_CreatedBy  ON User_CreatedBy.Userid = [POHeader].CreatedBy INNER JOIN Users User_ModifyBy ON User_ModifyBy.Userid = [POHeader].ModifyBy WHERE POHeader.ModuleStatusMapID = + CAST(@moduleStatusMapID AS VARCHAR(50))";
   
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
        caption: 'VendorName',
        type: 'string',
        width: 20,
        headerStyle: styles.headerDark
    },
    {
        caption: 'PartnerName',
        type: 'string',
        width: 20,
        headerStyle: styles.cellPink
    },
    {
        caption: 'PONumber',
        type: 'string',
        width: 20,
        headerStyle: styles.cellGreen
    },
    {
        headerStyle: styles.headerDark,
        caption: 'PODate',
        type: 'date',
        width: 15


    },
    {
        caption: 'ShipVia',
        type: 'string',
        width: 20,
        headerStyle: styles.headerDark
    },
    {
        caption: 'PayTerm',
        type: 'string',
        width: 15,
        headerStyle: styles.headerDark
    }
    ];

   
db.executeSql(req, sql, function (rows, err) {
        arr = [];
        for (i = 0; i < rows.length; i++) {
            VendorName = rows[i].VendorName;
            PartnerName = rows[i].PartnerName;
            PONumber = rows[i].PONumber;
            PODate = rows[i].PODate;
            ShipVia = rows[i].ShipVia;
            Payterm = rows[i].Payterm;

            a = [VendorName, PartnerName, PONumber, (dateFormat(PODate, "dd/mm/yyyy")), ShipVia, Payterm];
            arr.push(a);

        }
        conf.rows = arr;
        console.dir(conf);
        var result = nodeExcel.execute(conf);
        res.setHeader("Content-Disposition", "attachment;filename=" + OrderType + "PurchaseOrder.xlsx");
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.end(result, 'binary');
    });
});




router.get('/ExportToExcel/:orderType', function (req, res) {
    var OrderType = req.params.orderType;
    var nodeExcel = require('excel-export');
    var dateFormat = require('dateformat');
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('Status', sql.VarChar(100), OrderType);
        request.input('StartIndex', sql.Int, 0);
        request.input('PageSize', sql.Int, 25000);
        request.input("SortColumn", sql.VarChar(50), 'null');
        request.input("SortDirection", sql.VarChar(4), 'null');
        request.input("FilterValue", sql.VarChar(1000), 'null');
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.output('TotalCount', sql.Int);
        request.input("PartnerID", sql.Int, 7);
        request.execute('GetPurchaseOrderByPaging', function (err, recordsets, returnValue) {
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
   var rows= recordsets[0];
    var conf = {}

    conf.cols = [{
        caption: 'VendorName',
        type: 'string',
        width: 20,
        headerStyle: styles.headerDark
    },
    {
        caption: 'PartnerName',
        type: 'string',
        width: 20,
        headerStyle: styles.cellPink
    },
    {
        caption: 'PONumber',
        type: 'string',
        width: 20,
        headerStyle: styles.cellGreen
    },
    {
        headerStyle: styles.headerDark,
        caption: 'PODate',
        type: 'date',
        width: 15


    },
    {
        caption: 'ShipVia',
        type: 'string',
        width: 20,
        headerStyle: styles.headerDark
    },
    {
        caption: 'PayTerm',
        type: 'string',
        width: 15,
        headerStyle: styles.headerDark
    }
    ];

    arr = [];
   
    for (i = 0; i < rows.length; i++) {
            VendorName = rows[i].VendorName;
            PartnerName = rows[i].PartnerName;
            PONumber = rows[i].PONumber;
            PODate = rows[i].PODate;
            ShipVia = rows[i].ShipVia;
            Payterm = rows[i].PayTerms;
            ModifyDate = rows[i].ModifyDate;

            a = [VendorName, PartnerName, PONumber, (dateFormat(PODate, "dd/mm/yyyy")), ShipVia, Payterm];
            arr.push(a);
       }

       conf.rows = arr;
        var result = nodeExcel.execute(conf);
        res.setHeader("Content-Disposition", "attachment;filename=" + OrderType + "PurchaseOrder.xlsx");
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.end(result, 'binary');
        connection.close();
        });
    });
});

module.exports = router;