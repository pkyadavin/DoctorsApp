var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');
router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:Status/:RTVOrderMenu/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.output('TotalCount', sql.Int);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.input('Status', sql.Int, req.params.Status);       
        if (req.params.RTVOrderMenu === 'true') {            
            request.execute('GetOpenRTVsWithPaging', function (err, recordsets, returnValue) {
                if (err) {
                    Error.ErrorLog(err, "GetOpenRTVsWithPaging", JSON.stringify(request.parameters), req);
                }
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
                console.dir(recordsets);
                console.dir(request.parameters.TotalCount.value);
                connection.close();
            })
        }
        else {          
            request.execute('GetOpenRTDsWithPaging', function (err, recordsets, returnValue) {
                if (err) {
                    Error.ErrorLog(err, "GetOpenRTDsWithPaging", JSON.stringify(request.parameters), req);
                }
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
                console.dir(recordsets);
                console.dir(request.parameters.TotalCount.value);
                connection.close();
            })
        }
    });
});

router.get('/GetSTOData/:RTVHeaderId', function (req, res) {
    var hdrid = req.params.RTVHeaderId;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('RTVHeaderId', sql.Int, hdrid);
        request.execute('GetRTVByHeaderID', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetRTVByHeaderID", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
            connection.close();
        })

    });
});

//RTD
router.get('/GetRTDSTOData/:RTDHeaderId', function (req, res) {
    var hdrid = req.params.RTDHeaderId;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('RTDHeaderId', sql.Int, hdrid);
        request.execute('GetRTDByHeaderID', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetRTDByHeaderID", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
            connection.close();
        })

    });
});

router.put('/:RTVHeaderID/:ID', function (req, res) {
    var rTVHeaderID = req.params.RTVHeaderID;
    var TVHeaderID = req.params.ID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('RTVHeaderID', sql.Int, rTVHeaderID);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.output('RTVNumber', sql.VarChar(100));
        request.execute('usp_UpdateRTVOrderByRTVOrderId', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_UpdateRTVOrderByRTVOrderId", JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value, RTVNumber: request.parameters.RTVNumber.value  });
            connection.close();
        })
    });
});




router.put('/:RTDHeaderID', function (req, res) {
    var rTDHeaderID = req.params.RTDHeaderID;   
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('RTDHeaderID', sql.Int, rTDHeaderID);
        request.input('JsonData', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.output('RTDNumber', sql.VarChar(100));
        request.execute('usp_UpdateRTDOrderByRTDOrderId', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_UpdateRTDOrderByRTDOrderId", JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value, RTDNumber: request.parameters.RTDNumber.value });
            connection.close();
        })
    });
});



router.get('/GetRTVLineData/:RTVHeaderId', function (req, res) {
    var hdrid = req.params.RTVHeaderId;
    db.executeSql(req,"select im.ItemMasterID,im.ItemDescription, im.ItemName, im.ItemDiscountPC, im.ItemPrice, rd.Quantity,rd.Price from RTVDetail rd inner join ItemMaster im on im.ItemMasterID = rd.ItemMasterID where RTVHeaderid= " + hdrid, function (data, err) {
        if (err) {
          
                Error.ErrorLog(err, "select im.ItemMasterID,im.ItemDescription, im.ItemName, im.ItemDiscountPC, im.ItemPrice, rd.Quantity,rd.Price from RTVDetail rd inner join ItemMaster im on im.ItemMasterID = rd.ItemMasterID where RTVHeaderid= " + hdrid, JSON.stringify(request.parameters), req);
            
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

//rtd
router.get('/GetRTDLineData/:RTDHeaderId', function (req, res) {
    var hdrid = req.params.RTDHeaderId;
    var sql = "select im.ItemMasterID,im.ItemDescription, im.ItemName, im.ItemDiscountPC, im.ItemPrice, rd.Quantity,rd.Price from RTDDetail rd inner join ItemMaster im on im.ItemMasterID = rd.ItemMasterID where RTDHeaderid= " + hdrid;
    db.executeSql(req, sql , function (data, err) {
        if (err) {
            Error.ErrorLog(err,sql , "", req);
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
        request.output('RTVNumber', sql.VarChar(100));
        request.execute('usp_SaveRTV', function (err, recordsets) {
            if (err) {
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ result: request.parameters.result.value, RTVNumber: request.parameters.RTVNumber.value });
            }
            connection.close();
        })
    });
});

router.post('/CreateID', function (req, res) {
    
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));      
        request.output('RTDNumber', sql.VarChar(100));  
            request.execute('usp_SaveRTD', function (err, recordsets) {
                if (err) {
                    Error.ErrorLog(err, "usp_SaveRTD", JSON.stringify(request.parameters), req);
                    res.write(JSON.stringify({ data: "Error Occured: " + err }));
                }
                else {
                    res.send({ result: request.parameters.result.value, RTDNumber: request.parameters.RTDNumber.value });
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
        request.input('ModelID', sql.Int, modelId);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_UpdateRTVByHeaderId', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_UpdateRTVByHeaderId", JSON.stringify(request.parameters), req);
            }
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});




router.get('/GetPartners', function (req, res) {
    db.executeSql(req,"SELECT PartnerID,PartnerName FROM Partners WHERE IsActive = 1 and PartnerTypeID in (select TypeLookUpID from TypeLookUp where TypeCode = 'PTR002')", function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});
router.get('/GetRTDPartners', function (req, res) {
    db.executeSql(req, "SELECT PartnerID,PartnerName FROM Partners WHERE IsActive = 1 and PartnerTypeID in (select TypeLookUpID from TypeLookUp where TypeCode = 'PTR005')", function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});
router.get('/ExportToExcel/:orderType/:moduleTitle/:PartnerID', function (req, res) {
    var OrderType = req.params.orderType;
    var moduletitle = req.params.moduleTitle;
    var nodeExcel = require('excel-export');
    var dateFormat = require('dateformat');


    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('status', sql.VarChar(100), OrderType);
        request.input('StartIndex', sql.Int, 0);
        request.input('PageSize', sql.Int, 25000);
        request.input("SortColumn", sql.VarChar(50), 'null');
        request.input("SortDirection", sql.VarChar(4), 'null');
        request.input("FilterValue", sql.VarChar(1000), 'null');
        request.output('TotalCount', sql.Int);
        request.input("PartnerID", sql.Int, req.params.PartnerID);


        if (moduletitle === 'true') {


            request.execute('GetOpenRTVsWithPaging', function (err, recordsets, returnValue) {
                var rows = recordsets[0];
                var conf = {}
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

                conf.cols = [{
                    caption: 'RTVNumber',
                    type: 'string',
                    width: 30
                },
                {
                    caption: 'RTVDate',
                    type: 'date',
                    width: 20,
                    headerStyle: styles.headerDark
                },
                {
                    caption: 'RTVStartDate',
                    type: 'date',
                    width: 15,
                    headerStyle: styles.headerDark
                },
                {
                    headerStyle: styles.headerDark,
                    caption: 'RTVEndDate',
                    type: 'date',
                    width: 15
                },
                {
                    caption: 'From Partner',
                    type: 'string',
                    width: 30,
                    headerStyle: styles.headerDark
                },
                {
                    caption: 'Vendor Partner',
                    type: 'string',
                    width: 30,
                    headerStyle: styles.headerDark
                },
                {
                    caption: 'OutBound Tracking Number',
                    type: 'string',
                    width: 40,
                    headerStyle: styles.headerDark
                },
               

                {
                    caption: 'Approval Date',
                    type: 'string',
                    width: 20,
                    headerStyle: styles.headerDark
                },
                {
                    caption: 'ShipDate',
                    type: 'string',
                    width: 15,
                    headerStyle: styles.headerDark
                },
                {
                    caption: 'Remarks',
                    type: 'string',
                    width: 20,
                    headerStyle: styles.headerDark
                },
                {
                    caption: 'CreatedBy',
                    type: 'string',
                    width: 15,
                    headerStyle: styles.headerDark
                },
                {
                    caption: 'Created Date',
                    type: 'date',
                    width: 20,
                    headerStyle: styles.headerDark
                }

                    , {
                    caption: 'ModifyBy ',
                    type: 'string',
                    width: 20,
                    headerStyle: styles.headerDark
                },
                {
                    caption: 'Modify Date',
                    type: 'date',
                    width: 15,
                    headerStyle: styles.headerDark
                }
                ];

                    arr = [];
                    for (i = 0; i < rows.length; i++) {
                        RTVNumber = rows[i].RTVNumber;
                        RTVDate = rows[i].RTVDate;
                        RTVStartDate = rows[i].RTVStartDate;
                        RTVEndDate = rows[i].RTVEndDate;
                        FromPartner = rows[i].PartnerName;
                        Vendor = rows[i].VendorPartner;
                        OutBoundTrackingNumber = rows[i].OutboundTrackingNumber;
                        ApprovalDate = rows[i].ApprovalDate;
                        ShipDate = rows[i].ShipDate;
                        Remarks = rows[i].Remarks;
                        CreatedByName = rows[i].CreatedByName;
                        CreatedDate = rows[i].CreatedDate;
                        ModifyByName = rows[i].ModifyByName;
                        ModifiedDate = rows[i].ModifiedDate;

                        a = [RTVNumber, (dateFormat(RTVDate, "dd/mm/yyyy")), (dateFormat(RTVStartDate, "dd/mm/yyyy")), (dateFormat(rows[i].RTVEndDate, "dd/mm/yyyy")), FromPartner, Vendor, OutBoundTrackingNumber,  ApprovalDate == null ? "N/A" : dateFormat(ApprovalDate, "dd/mm/yyyy"), (ShipDate == null ? "N/A" : dateFormat(ShipDate, "dd/mm/yyyy")), Remarks, CreatedByName, (dateFormat(rows[i].CreatedDate, "dd/mm/yyyy")), ModifyByName, (dateFormat(rows[i].ModifiedDate, "dd/mm/yyyy"))];
                        arr.push(a);

                    }
                    conf.rows = arr;
                    console.dir(conf);
                    var result = nodeExcel.execute(conf);
                    res.setHeader("Content-Disposition", "attachment;filename=" + OrderType + "RTV.xlsx");
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                    res.end(result, 'binary');
            });
        }

        else {
            request.execute('GetOpenRTDsWithPaging', function (err, recordsets, returnValue) {
                var conf = {}
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
                conf.cols = [{
                    caption: 'RTDNumber',
                    type: 'string',
                    width: 30
                },
                {
                    caption: 'RTDDate',
                    type: 'date',
                    width: 20,
                    headerStyle: styles.headerDark
                },
                {
                    caption: 'RTDStartDate',
                    type: 'date',
                    width: 15,
                    headerStyle: styles.headerDark
                },
                {
                    headerStyle: styles.headerDark,
                    caption: 'RTDEndDate',
                    type: 'date',
                    width: 15
                },
                {
                    caption: 'From Partner',
                    type: 'string',
                    width: 30,
                    headerStyle: styles.headerDark
                },
                {
                    caption: 'Depot Partner',
                    type: 'string',
                    width: 30,
                    headerStyle: styles.headerDark
                },
                {
                    caption: 'Outbound Tracking Number',
                    type: 'string',
                    width: 30,
                    headerStyle: styles.headerDark
                },

                {
                    caption: 'ApprovalDate',
                    type: 'string',
                    width: 20,
                    headerStyle: styles.headerDark
                },
                {
                    caption: 'ShipDate',
                    type: 'string',
                    width: 15,
                    headerStyle: styles.headerDark
                },
                {
                    caption: 'Remarks',
                    type: 'string',
                    width: 20,
                    headerStyle: styles.headerDark
                },
                {
                    caption: 'CreatedByName',
                    type: 'string',
                    width: 15,
                    headerStyle: styles.headerDark
                },
                {
                    caption: 'CreatedDate',
                    type: 'date',
                    width: 20,
                    headerStyle: styles.headerDark
                }

                    , {
                    caption: 'ModifyByName',
                    type: 'string',
                    width: 20,
                    headerStyle: styles.headerDark
                },
                {
                    caption: 'ModifyDate',
                    type: 'date',
                    width: 15,
                    headerStyle: styles.headerDark
                }
                ];

                    arr = [];
                    for (i = 0; i < rows.length; i++) {
                        RTDNumber = rows[i].RTDNumber;
                        RTDDate = rows[i].RTDDate;
                        RTDStartDate = rows[i].RTDStartDate;
                        RTDEndDate = rows[i].RTDEndDate;
                        FromPartner = rows[i].PartnerName;
                        Vendor = rows[i].VendorPartner;
                        OutBoundTrackingNumber = rows[i].OutboundTrackingNumber;
                        ApprovalDate = rows[i].ApprovalDate;
                        ShipDate = rows[i].ShipDate;
                        Remarks = rows[i].Remarks;
                        CreatedByName = rows[i].CreatedByName;
                        CreatedDate = rows[i].CreatedDate;
                        ModifyByName = rows[i].ModifyByName;
                        ModifiedDate = rows[i].ModifiedDate;

                        a = [RTDNumber, (dateFormat(RTDDate, "dd/mm/yyyy")), (dateFormat(RTDStartDate, "dd/mm/yyyy")), (dateFormat(rows[i].RTDEndDate, "dd/mm/yyyy")), FromPartner, Vendor, OutBoundTrackingNumber, ApprovalDate == null ? "N/A" : dateFormat(ApprovalDate, "dd/mm/yyyy"), (ShipDate == null ? "N/A" : dateFormat(ShipDate, "dd/mm/yyyy")), Remarks, CreatedByName, (dateFormat(rows[i].CreatedDate, "dd/mm/yyyy")), ModifyByName, (dateFormat(rows[i].ModifiedDate, "dd/mm/yyyy"))];
                        arr.push(a);

                    }
                    conf.rows = arr;
                    console.dir(conf);
                    var result = nodeExcel.execute(conf);
                    res.setHeader("Content-Disposition", "attachment;filename=" + OrderType + "RTD.xlsx");
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                    res.end(result, 'binary');
            });
        }
    });
    });

module.exports = router;