var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('mssql');
var db = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');
router.get('/:statusName/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input("StatusName", sql.VarChar(50), req.params.statusName);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.output('TotalCount', sql.Int);
        request.execute('GetDisposalOrderWithPagging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetDisposalOrderWithPagging', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            connection.close();
        })
    });
});

router.get('/:orderHeaderId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('OrderHeaderId', sql.Int, req.params.orderHeaderId);
        request.execute('usp_GetDisposalOrderHeaderById', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_GetDisposalOrderHeaderById', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        var chk = JSON.stringify(req.body);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.input('JsonData', sql.VarChar(sql.MAX), JSON.stringify(req.body));
        request.input('DoHeaderId', sql.Int, req.body.DisposalOrderHeaderID);
        request.output('DoNumber', sql.VarChar(100));
        request.execute('usp_DisposalOrder_SaveDetail', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_DisposalOrder_SaveDetail', JSON.stringify(request.parameters), req);
                res.send({ recordsets: recordsets });
                console.dir(recordsets);
            }
            else {
                res.send({ recordsets: recordsets, DoNumber: request.parameters.DoNumber.value });
            }
            connection.close();
        });
    });
});

router.get('/GetDisposeItemByDOHeaderid/:DoHeaderId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('DisposalOrderHeaderID', sql.Int, req.params.DoHeaderId);
        request.execute('GetDisposeItemByDOHeaderid', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetDisposeItemByDOHeaderid', JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            connection.close();
        })
    });
});


router.get('/ExportToExcel/:orderType', function (req, res) {
    var OrderType=req.params.orderType;
    var nodeExcel = require('excel-export');
    var dateFormat = require('dateformat');
    var sql = "SELECT DisposalOrderNumber,DisposalOrderDate,Remarks,DisposalOrderHeader.CreatedDate,DisposalOrderHeader.ModifyDate,User_CreatedBy.Username as CreatedByName ,User_ModifyBy.Username as ModifyByName FROM DisposalOrderHeader Left Outer Join Users User_CreatedBy on DisposalOrderHeader.CreatedBy = User_CreatedBy.UserID Left Outer Join Users User_ModifyBy on DisposalOrderHeader.ModifyBy = User_ModifyBy.UserID Left Outer Join ModuleStatusMap on ModuleStatusMap.ModuleStatusMapID = DisposalOrderHeader.ModuleStatusMapID Left Outer Join [Statuses] on ModuleStatusMap.StatusID = [Statuses].StatusID Where [Statuses].StatusName ='" + OrderType + "'";
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
            caption: 'DisposalOrderNumber',
            type: 'string',
            width: 30,
            font: {
            color: {
                rgb: 'FFFFFFFF'
            },
            sz: 14,
            bold: true,
            underline: true
        }
        },
        {
            caption: 'DisposalOrderDate',
            type: 'date',
            width: 20,
            headerStyle: styles.headerDark
            },
        {
            caption: 'Remarks',
            type: 'string',
            width: 40,
            headerStyle: styles.headerDark
        },
        {
            headerStyle: styles.headerDark,
            caption: 'CreatedByName',
            type: 'string',
            width: 15
           
             
        },
        {
            caption: 'CreatedDate',
            type: 'date',
            width: 20,
            headerStyle: styles.headerDark
        },
        {
            caption: 'ModifyBy',
            type: 'string',
            width: 15,
            headerStyle: styles.headerDark
        },
        {
            caption: 'ModifyDate',
            type: 'date',
            width: 20,
            
            headerStyle: styles.headerDark
        }
        ];
       
        db.executeSql(req, sql, function (rows, err) {
                arr = [];
                for (i = 0; i < rows.length; i++) {
                    DisposalOrderNumber = rows[i].DisposalOrderNumber;
                    DisposalOrderDate = rows[i].DisposalOrderDate;
                    Remarks = rows[i].Remarks;
                    CreatedByName = rows[i].CreatedByName;
                    CreatedDate = rows[i].CreatedDate;
                    ModifyByName = rows[i].ModifyByName;
                    ModifyDate = rows[i].ModifyDate;
                   
                    a = [DisposalOrderNumber, (dateFormat(rows[i].DisposalOrderDate, "dd/mm/yyyy")), Remarks, CreatedByName, (dateFormat(rows[i].CreatedDate, "dd/mm/yyyy")), ModifyByName, (dateFormat(rows[i].ModifyDate, "dd/mm/yyyy")) ];
                    arr.push(a);
                    
                }
                conf.rows = arr;
                console.dir(conf);
                var result = nodeExcel.execute(conf);
                res.setHeader("Content-Disposition", "attachment;filename=" + OrderType+"Disposal.xlsx");
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.end(result, 'binary');        
        });
        });


module.exports = router;