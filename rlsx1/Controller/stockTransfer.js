var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');
router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:filterOpenVal/:Status/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterOpenVal", sql.VarChar(1000), req.params.filterOpenVal);
        request.output('TotalCount', sql.Int);
        request.input('Status', sql.Int, req.params.Status);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.execute('GetOpenSTOsWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetOpenSTOsWithPaging", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            connection.close();
        })
    });
});

router.get('/GetSTOData/:STOHeaderId', function (req, res) {
    var hdrid = req.params.STOHeaderId;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('STOHeaderId', sql.Int, hdrid);
        request.execute('GetSTOByHeaderID', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetSTOByHeaderID", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            console.dir(recordsets);
            connection.close();
        })

    });
});

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.input('STOData', sql.VarChar(5000), JSON.stringify(req.body));
        request.input('STOHeaderId', sql.Int, req.body.STOHeaderID);
        request.output('result', sql.VarChar(5000));
        request.output('STONumber', sql.VarChar(100));
        request.execute('UpdateStockTransferOrder', function (err, recordsets) {
            if (err) {
             
                Error.ErrorLog(err, "UpdateStockTransferOrder", JSON.stringify(request.parameters), req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ result: request.parameters.result.value, STONumber: request.parameters.STONumber.value });
            }
            connection.close();
        })
    });
});

router.get('/GetPartners', function (req, res) {
    db.executeSql(req, "SELECT PartnerID,PartnerName FROM Partners WHERE IsActive = 1 and PartnerTypeID in (select TypeLookUpID from TypeLookUp where TypeCode = 'PTR001'", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT PartnerID,PartnerName FROM Partners WHERE IsActive = 1 and PartnerTypeID in (select TypeLookUpID from TypeLookUp where TypeCode = 'PTR001'", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/ExportToExcel/:OrderType', function (req, res) {
    var OrderType = req.params.OrderType;
    var nodeExcel = require('excel-export');
    var dateFormat = require('dateformat');
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);  
        request.input('StartIndex', sql.Int, 0);
        request.input('PageSize', sql.Int, 25000);
        request.input("SortColumn", sql.VarChar(50), 'null');
        request.input("SortDirection", sql.VarChar(4), 'null');
        request.input("FilterOpenVal", sql.VarChar(1000), 'null');
        request.output('TotalCount', sql.Int);
        request.input('Status', sql.Int, OrderType);
        request.input("PartnerID", sql.Int, 7);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);      
     
        request.execute('GetOpenSTOsWithPaging', function (err, recordsets, returnValue) {
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
                caption: 'STONumber',
                type: 'string',
                width: 20,
                headerStyle: styles.headerDark
            },
            {
                caption: 'FromPartner',
                type: 'string',
                width: 20,
                headerStyle: styles.cellPink
            },
            {
                caption: 'ToPartner',
                type: 'string',
                width: 20,
                headerStyle: styles.cellGreen
            },
            {
                headerStyle: styles.headerDark,
                caption: 'STODate',
                type: 'date',
                width: 15


            },
            {
                headerStyle: styles.headerDark,
                caption: 'CreatedBy',
                type: 'string',
                width: 15


            },
            {
                headerStyle: styles.headerDark,
                caption: 'CreatedDate',
                type: 'date',
                width: 20                
            }
            ];

            arr = [];

            for (i = 0; i < rows.length; i++) {
                STONumber = rows[i].STONumber;            
                FromPartner = rows[i].FromPartner;               
                ToPartner = rows[i].ToPartner;
                STODate = rows[i].STODate;  
                CreatedBy = rows[i].CreatedBy;               
                CreatedDate = rows[i].CreatedDate;
                a = [STONumber, FromPartner, ToPartner, (dateFormat(STODate, "dd/mm/yyyy")), CreatedBy, (dateFormat(CreatedDate, "dd/mm/yyyy"))];
                arr.push(a);
            }

            conf.rows = arr;
           
            var result = nodeExcel.execute(conf);
            res.setHeader("Content-Disposition", "attachment;filename=" + OrderType + "StockTransfer.xlsx");
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.end(result, 'binary');
            connection.close();
        });
    });
});

module.exports = router;