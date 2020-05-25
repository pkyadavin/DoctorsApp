var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');
router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.output('TotalCount', sql.Int);
        request.execute('usp_PreApprovals_GetAll', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_PreApprovals_GetAll", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            connection.close();
        })
    });
});

router.get('/:specialaprovalId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('SpecialAprovalId', sql.Int, req.params.specialaprovalId);
        request.execute('usp_PreApproval_GetById', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_PreApproval_GetById", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.get('/PreApprovalDetailByID/:Id', function (req, res) {    
    var sql = 'select sl.SerialNumber, rd.RMANumber from specialaprovallog sll inner join RMAOrderDetail rd on sll.RMAOrderDetailID = rd.RMAOrderDetailID inner join SpecialAproval sl on sll.SpecialAprovalID = sl.SpecialAprovalID where sl.SpecialAprovalID = ' + req.params.Id;
    db.executeSql(req, sql, function (data, err) {
        if (err) {
            Error.ErrorLog(err, sql, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.delete('/DeleteRow/:SpecialAprovalId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('SpecialAprovalId', sql.Int, req.params.SpecialAprovalId);
        request.execute('usp_DeletePreApproval_ById', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_DeletePreApproval_ById', JSON.stringify(request.parameters), req);
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
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.VarChar(20));
        request.execute('usp_PreApproval_SaveDetail', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_PreApproval_SaveDetail', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });                
                res.write(JSON.stringify({ data: request.parameters.result.value }));
            }
            res.end();
            connection.close();
        })
    });
});

router.get('/ExportToExcel/:orderType', function (req, res) {
    var OrderType = req.params.orderType;
    var nodeExcel = require('excel-export');
    var dateFormat = require('dateformat');
    var sql = "SELECT SpecialAproval.SerialNumber ,tl.TypeName,SpecialAproval.ValidFrom ,SpecialAproval.ValidUpto,SpecialAproval.DiscountPercentage FROM [SpecialAproval] Left Join [Users] user1 ON  user1.UserId = SpecialAproval.CreatedBy Left Join [Users] user2 ON user2.UserId = SpecialAproval.ModifyBy Left Join TypeLookUp tl ON  tl.TypeLookUpID = SpecialAproval.AprovalTypeID  and tl.TypeGroup='SpecialAprovalType' and tl.IsActive=1";
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
        caption: 'Unit Serial Number',
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
            caption: 'Aproval Type',
            type: 'string',
            width: 40,
            headerStyle: styles.headerDark
        },
    {
        caption: 'Effective Date From (dd-mm-yyyy)',
        type: 'date',
        width: 40,
        headerStyle: styles.headerDark
    },    
    
    {
        caption: 'Effective Date To (dd-mm-yyyy)',
        type: 'date',
        width: 40,
        headerStyle: styles.headerDark
    },
  
    {
        caption: 'VALUE IN % FOR SPLDISC',
        type: 'number',
        width: 20,

        headerStyle: styles.headerDark
    }
    ];

    db.executeSql(req, sql, function (rows, err) {
        arr = [];
        for (i = 0; i < rows.length; i++) {
            SerialNumber = rows[i].SerialNumber;
            TypeName = rows[i].TypeName;
            ValidFrom = rows[i].ValidFrom;
            ValidUpto = rows[i].ValidUpto;
            DiscountPercentage = rows[i].DiscountPercentage;           

            a = [SerialNumber, TypeName, (dateFormat(rows[i].ValidFrom, "dd/mm/yyyy")), (dateFormat(rows[i].ValidUpto, "dd/mm/yyyy")), DiscountPercentage];
            arr.push(a);

        }
        conf.rows = arr;
        console.dir(conf);
        var result = nodeExcel.execute(conf);
        res.setHeader("Content-Disposition", "attachment;filename=" + OrderType + "Disposal.xlsx");
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.end(result, 'binary');
    });
});


module.exports = router;
