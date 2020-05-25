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
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.output('TotalCount', sql.Int);
        request.execute('GetIntakeOrderByPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetIntakeOrderByPaging', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
        })
    });
});

router.get('/GetIoHeaderById/:IoHeaderId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('IoHeaderId', sql.Int, req.params.IoHeaderId);
        request.execute('GetIntakeOrderByPoHeaderId', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetIntakeOrderByPoHeaderId', JSON.stringify(request.parameters), req);
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
                Error.ErrorLog(err, 'GetPoReceivingItemByPoHeaderid', JSON.stringify(request.parameters), req);
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
        request.input('IoHeaderId', sql.Int, req.body.IOHeaderID);
        request.input('UserId', sql.Int, req.body.UserId);
        request.input('PartnerId', sql.Int, req.body.PartnerId);
        request.output('IONumber', sql.VarChar(100));
        request.execute('CreateOrUpdateIntakeOrder', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'CreateOrUpdateIntakeOrder', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, IONumber: request.parameters.IONumber.value});
        })
    });
});

router.get('/ExportToExcel2/:orderType', function (req, res) {
    var OrderType = req.params.orderType;
    var nodeExcel = require('excel-export');
    var dateFormat = require('dateformat');
    var sql = "SELECT VendorAddress.Address1+','+State.StateName+','+VendorAddress.City+','+VendorAddress.ZipCode As VendorAddress,"+
    " AccountPartner.PartnerName as AccountPartner, VendorName.PartnerName as Vendor,"+
       " [IOHeader].[IONumber], [IOHeader].[IODate], [IOHeader].[IOName], [IOHeader].[Remarks], [IOHeader].[DeliveryDate],"+
       " [User_CreatedBy].[UserName] CreatedByName , [IOHeader].[CreatedDate], [User_ModifyBy].[UserName] ModifyByName,"+
    "  [IOHeader].[ModifyDate]  FROM  [IOHeader] INNER JOIN Partners Vendor ON Vendor.PartnerID = IOHeader.VendorPartnerId  INNER JOIN Partners Partner " +
        "  ON Partner.PartnerID = IOHeader.PartnerID INNER JOIN Users User_CreatedBy ON  User_CreatedBy.Userid = [IOHeader].CreatedBy INNER JOIN Users User_ModifyBy " +
        "   ON User_ModifyBy.Userid = [IOHeader].ModifyBy INNER JOIN PartnerAddressMap PAM ON  IOHeader.VendorAddressID = PAM.PartnerAddressMapID " +
        "   INNER JOIN [Address] VendorAddress on PAM.AddressID = VendorAddress.AddressID  INNER JOIN Partners AccountPartner on IOHeader.AccountPartnerID = AccountPartner.PartnerID " +
        "   INNER JOIN Partners VendorName on IOHeader.VendorPartnerID = VendorName.PartnerID Left Join State ON VendorAddress.StateID = State.StateID ";

    

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
        caption: 'VendorAddress',
        type: 'string',
        width: 35,
        headerStyle: styles.cellPink
        },
    {
        caption: 'Account',
        type: 'string',
        width: 20,
        headerStyle: styles.cellGreen
    },
    {
        caption: 'IONumber',
        type: 'string',
        width: 20,
        headerStyle: styles.cellGreen
    },
    {
        headerStyle: styles.headerDark,
        caption: 'IODate',
        type: 'date',
        width: 15


    },
    {
        caption: 'IOName',
        type: 'string',
        width: 20,
        headerStyle: styles.headerDark
    },
    {
        caption: 'Remarks',
        type: 'string',
        width: 25,
        headerStyle: styles.headerDark
    },
    {
        caption: 'DeliveryDate',
        type: 'date',
        width: 20,
        headerStyle: styles.cellGreen
    },
    {
        caption: 'CreatedBy',
        type: 'string',
        width: 20,
        headerStyle: styles.cellGreen
    },
    {
        caption: 'CreatedDate',
        type: 'date',
        width: 20,
        headerStyle: styles.cellGreen
    },
    {
        caption: 'ModifyBy',
        type: 'string',
        width: 20,
        headerStyle: styles.cellGreen
    },
    {
        caption: 'ModifyDate',
        type: 'date',
        width: 20,
        headerStyle: styles.cellGreen
    }
    ];


    db.executeSql(req, sql, function (rows, err) {
        arr = [];
        for (i = 0; i < rows.length; i++) {
            Vendor = rows[i].Vendor;
            PartnerName = rows[i].VendorAddress;
            AccountPartner = rows[i].AccountPartner;
            IONumber = rows[i].IONumber;
            IODate = rows[i].IODate;
            IOName = rows[i].IOName;
            Remarks = rows[i].Remarks;
            DeliveryDate = rows[i].DeliveryDate;

            CreatedBy = rows[i].CreatedByName;
            CreatedDate = rows[i].CreatedDate;
            ModifyBy = rows[i].ModifyByName;
            ModifyDate = rows[i].ModifyDate;

            a = [Vendor, PartnerName, AccountPartner, IONumber, (dateFormat(IODate, "dd/mm/yyyy")), IOName, Remarks, (dateFormat(DeliveryDate, "dd/mm/yyyy")), CreatedBy, (dateFormat(CreatedDate, "dd/mm/yyyy")), ModifyBy, (dateFormat(ModifyDate, "dd/mm/yyyy"))];
            arr.push(a);

        }
        conf.rows = arr;
        var result = nodeExcel.execute(conf);
        res.setHeader("Content-Disposition", "attachment;filename=" + OrderType + "IntakeOrder.xlsx");
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
        request.input('PageSize', sql.Int,25000);
        request.input("SortColumn", sql.VarChar(50), 'null');
        request.input("SortDirection", sql.VarChar(4), 'null');       
        request.input("FilterValue", sql.VarChar(1000), 'null');
        request.input("PartnerID", sql.Int, 7);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.output('TotalCount', sql.Int);            
              
        request.execute('GetIntakeOrderByPaging', function (err, recordsets, returnValue) {
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
                caption: 'Vendor',
                type: 'string',
                width: 20,
                headerStyle: styles.headerDark
            },
            {
                caption: 'Account',
                type: 'string',
                width: 20,
                headerStyle: styles.cellGreen
            },
            {
                caption: 'IONumber',
                type: 'string',
                width: 20,
                headerStyle: styles.cellGreen
            },
            {
                headerStyle: styles.headerDark,
                caption: 'IODate',
                type: 'date',
                width: 15


            },
            {
                caption: 'IOName',
                type: 'string',
                width: 20,
                headerStyle: styles.headerDark
            },
            {
                caption: 'Remarks',
                type: 'string',
                width: 25,
                headerStyle: styles.headerDark
            },
            {
                caption: 'DeliveryDate',
                type: 'date',
                width: 20,
                headerStyle: styles.cellGreen
            },
            {
                caption: 'CreatedBy',
                type: 'string',
                width: 20,
                headerStyle: styles.cellGreen
            },
            {
                caption: 'CreatedDate',
                type: 'date',
                width: 20,
                headerStyle: styles.cellGreen
            },
            {
                caption: 'ModifyBy',
                type: 'string',
                width: 20,
                headerStyle: styles.cellGreen
            },
            {
                caption: 'ModifyDate',
                type: 'date',
                width: 20,
                headerStyle: styles.cellGreen
            }
            ];
            var rows = recordsets[0];
            arr = [];

            for (i = 0; i < rows.length; i++) {
                Vendor = rows[i].Vendor;
                AccountPartner = rows[i].AccountPartner;
                IONumber = rows[i].IONumber;
                IODate = rows[i].IODate;
                IOName = rows[i].IOName;
                Remarks = rows[i].Remarks;
                DeliveryDate = rows[i].DeliveryDate;
                CreatedBy = rows[i].CreatedByName;
                CreatedDate = rows[i].CreatedDate;
                ModifyBy = rows[i].ModifyByName;
                ModifyDate = rows[i].ModifyDate;
            
                a = [Vendor, AccountPartner, IONumber, (dateFormat(IODate, "dd/mm/yyyy")), IOName, Remarks, (dateFormat(DeliveryDate, "dd/mm/yyyy")), CreatedBy, (dateFormat(CreatedDate, "dd/mm/yyyy")), ModifyBy, (dateFormat(ModifyDate, "dd/mm/yyyy"))];
                arr.push(a);
            }

            conf.rows = arr;
            var result = nodeExcel.execute(conf);
            res.setHeader("Content-Disposition", "attachment;filename=" + OrderType + "IntakeOrder.xlsx");
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.end(result, 'binary');
            connection.close();
        });
    });
});
module.exports = router;