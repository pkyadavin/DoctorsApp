var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');
router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:Status/:PartnerID/:Scope', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.output('TotalCount', sql.Int);
        request.input('Status', sql.VarChar(1000), req.params.Status);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.input('Scope', sql.VarChar(20), req.params.Scope);
        request.execute('GetSOHeaderPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetSOHeaderPaging", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            connection.close();
        })
    });
});

router.get('/GetSTOData/:SOHeaderID', function (req, res) {
    var hdrid = req.params.SOHeaderID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('SOHeaderID', sql.Int, hdrid);
        request.execute('GetSOHeaderByHeaderID', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetSOHeaderByHeaderID", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
            connection.close();
        })

    });
});

router.get('/CheckAvailability/:SONumber/:Type', function (req, res) {
    var soNumber = req.params.SONumber;
    var type = req.params.Type;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('SONumber', sql.VarChar(1000), soNumber);
        request.input('Type', sql.VarChar(1000), type);
        request.execute('usp_SO_CheckAvailabilty', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_SO_CheckAvailabilty", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
            connection.close();
        })

    });
});

router.get('/CheckAvailability/:SONumber/:Type', function (req, res) {
    var soNumber = req.params.SONumber;
    var type = req.params.Type;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('SONumber', sql.VarChar(1000), soNumber);
        request.input('Type', sql.VarChar(1000), type);
        request.execute('usp_SO_CheckAvailabilty', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_SO_CheckAvailabilty", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
            connection.close();
        })

    });
});

router.get('/CheckAllowExcel', function (req, res) {    
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        
        request.execute('usp_GetUploadSalesOrdersBy', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_GetUploadSalesOrdersBy", "", req);
            }
            res.send(recordsets);
            connection.close();
        })
    });
});

router.post('/import/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));

    var jsonData = req.body;

    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(jsonData));
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('PartnerID', sql.Int, req.params.PartnerID);
        request.output('result', sql.NVarChar(500));
        request.execute('usp_import_SO', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_import_SO", JSON.stringify(request.parameters), req);
            }
            console.dir(request.parameters.result.value);
            res.send({ result: request.parameters.result.value });
            connection.close();
        });
    });
});
router.get('/GetSOLineData/:SOHeaderID', function (req, res) {
    var hdrid = req.params.SOHeaderID;
    db.executeSql(req, "select im.ItemMasterID,im.ItemDescription, im.ItemName, im.ItemDiscountPC, rd.Price as ItemPrice, cast(rd.Quantity as int) as Quantity,"
        + "  rd.TotalAmount as Price, SerialNumber,im.ItemNumber, case when isnull(im.ItemReceiveTypeID,0) = 76 then SerialNumber else cast(cast(rd.Quantity as int) as varchar(100)) end as SerialNumberQuantity from SODetail rd inner join OutBoundItemContextHistory oic on oic.RefDetailID= rd.SoDetailID inner join ItemMaster im on im.ItemMasterID = rd.ItemMasterID INNER JOIN iteminfo ON [iteminfo].ItemInfoID = oic.ItemInfoID"
        + " where SOHeaderID= " + hdrid, function (data, err) {
            if (err) {
                Error.ErrorLog(err, "select im.ItemMasterID,im.ItemDescription, im.ItemName, im.ItemDiscountPC, im.ItemPrice, rd.Quantity,"
                    + "  rd.Price from SODetail rd inner join ItemMaster im on im.ItemMasterID = rd.ItemMasterID "
                    + " where SOHeaderID= " + hdrid, "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});

router.get('/AllRefType', function (req, res) {
    var itemmasterid = req.params.ItemMasterId;
    db.executeSql(req, "select TypelookUpId , TypeName from TypelookUp  where typegroup= 'SOType' ", function (data, err) {

        if (err) {
            Error.ErrorLog(err, "select TypelookUpId , TypeName from TypelookUp  where typegroup= 'SOType' ", req);
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
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.output('SoNumber', sql.VarChar(100));
        request.execute('usp_SaveSO', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_SaveSO", JSON.stringify(request.parameters), req);
                //res.write(JSON.stringify({ data: "Error Occured: " + err.message }));
                res.send({ result: err.message });
            }
            else {
                res.send({ result: request.parameters.result.value, SoNumber: request.parameters.SoNumber.value });
            }
            connection.close();
        })
    });
});

router.put('/:ModelID', function (req, res) {
    var modelId = req.params.ModelID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.input('ModelID', sql.Int, modelId);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_UpdateSOByHeaderId', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_UpdateSOByHeaderId", JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});
router.get('/loadAddressbyId/:AddressID', function (req, res) {
    var addressID = req.params.AddressID;
    db.executeSql(req, "select Address1 + ','+ address2 + ','+ City +','+ZipCode as Address from address  where AddressID=" + addressID, function (data, err) {

        if (err) {
            Error.ErrorLog(err, "select Address1 + ','+ address2 + ','+ City +','+ZipCode as Address from address  where AddressID=" + addressID, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();

    });
});



router.get('/GetPartners', function (req, res) {
    db.executeSql(req, "SELECT PartnerID,PartnerName FROM Partners WHERE IsActive = 1 and PartnerTypeID in (select TypeLookUpID from TypeLookUp where TypeCode = 'PTR002')", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT PartnerID,PartnerName FROM Partners WHERE IsActive = 1 and PartnerTypeID in (select TypeLookUpID from TypeLookUp where TypeCode = 'PTR002')", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/ExportToExcel/:orderType/:partnerID', function (req, res) {
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
        request.input("PartnerID", sql.Int, req.params.partnerID);
        request.execute('GetSOHeaderPaging', function (err, recordsets, returnValue) {
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
            var rows = recordsets[0];
            var conf = {}

            conf.cols = [{
                caption: 'SONumber',
                type: 'string',
                width: 20,
                headerStyle: styles.headerDark
            },
            {
                caption: 'TypeName',
                type: 'string',
                width: 20,
                headerStyle: styles.cellPink
            },
            {
                caption: 'PartnerName',
                type: 'string',
                width: 20,
                headerStyle: styles.cellGreen
            },
            {
                caption: 'BillNumber',
                type: 'string',
                width: 20,
                headerStyle: styles.cellGreen
            },
            {
                caption: 'BillingDate',
                type: 'string',
                width: 20,
                headerStyle: styles.cellGreen
            },
            {
                caption: 'PORefNo',
                type: 'string',
                width: 20,
                headerStyle: styles.cellGreen
            },
            {
                caption: 'PORefDate',
                type: 'date',
                width: 20,
                headerStyle: styles.cellGreen
            },
            {
                caption: 'Remarks',
                type: 'string',
                width: 20,
                headerStyle: styles.cellGreen
            },
            {
                caption: 'Status',
                type: 'string',
                width: 20,
                headerStyle: styles.cellGreen
            },
            {
                caption: 'CreatedByName',
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
                caption: 'ModifyByName',
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

            arr = [];

            for (i = 0; i < rows.length; i++) {
                SONumber = rows[i].SONumber;
                TypeName = rows[i].TypeName;
                PartnerName = rows[i].PartnerName;
                BillNumber = rows[i].BillNumber;
                BillingDate = rows[i].BillingDate;
                PORefNo = rows[i].PORefNo;
                PoRefDate = rows[i].PoRefDate;
                Remarks = rows[i].Remarks;
                Status = rows[i].Status;
                CreatedByName = rows[i].CreatedByName;
                CreatedDate = rows[i].CreatedDate;
                ModifyByName = rows[i].ModifyByName;
                ModifyDate = rows[i].ModifyDate;


                a = [SONumber, TypeName, PartnerName, BillNumber, (dateFormat(BillingDate, "dd/mm/yyyy")), PORefNo, (dateFormat(PoRefDate, "dd/mm/yyyy")), Remarks, Status, CreatedByName, (dateFormat(CreatedDate, "dd/mm/yyyy")), ModifyByName, (dateFormat(ModifyDate, "dd/mm/yyyy"))];
                arr.push(a);
            }

            conf.rows = arr;
            var result = nodeExcel.execute(conf);
            res.setHeader("Content-Disposition", "attachment;filename=" + OrderType + "SOOrder.xlsx");
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.end(result, 'binary');
            connection.close();
        });
    });
});

module.exports = router;