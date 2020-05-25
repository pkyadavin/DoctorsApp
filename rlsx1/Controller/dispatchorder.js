var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');
router.get('/loadallbyStatus/:status/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID', function (req, res) {

    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {

        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.output('TotalCount', sql.Int);
        request.input('Status', sql.VarChar(100), req.params.status);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.execute('GetDispatchOrdersWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetDispatchOrdersWithPaging', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            connection.close();
        })
    });
});

router.get('/loadallbyId/:StartIndex/:PageSize/:SortColumn/:SortDirection/:ID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input("ID", sql.VarChar(100), req.params.ID);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.output('TotalCount', sql.Int);
        request.execute('GetDispatchOrderDetailsByIDWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetDispatchOrderDetailsByIDWithPaging', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            connection.close();
        })
    });
});



router.get('/loadAlldetailsById/:DispatchOrderID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('DispatchOrderID', sql.VarChar(100), req.params.DispatchOrderID);
        request.execute('GetDispatchOrderDetailsByID', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'GetDispatchOrderDetailsByID', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
                res.end();
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        });
    });
});
router.get('/loadAlldetailsByActions/:DispatchOrderID/:ActionCode', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('DispatchOrderID', sql.VarChar(100), req.params.DispatchOrderID);
        request.input('ActionCode', sql.VarChar(100), req.params.ActionCode);
        request.execute('GetDispatchOrderDetailsByActions', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'GetDispatchOrderDetailsByActions', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
                res.end();
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        });
    });
});
router.get('/loadOrderdetailsByOrderType/:HeaderId/:OrderType', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('HeaderId', sql.VarChar(100), req.params.HeaderId);
        request.input('OrderType', sql.VarChar(100), req.params.OrderType);
        request.execute('GetAllOrderlinesByHeaderID', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'GetAllOrderlinesByHeaderID', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
                res.end();
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        });
    });
});





router.get('/loadbyId/:DispatchOrderID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('DispatchOrderID', sql.VarChar(100), req.params.DispatchOrderID);
        request.execute('GetDispatchHeaderByHeaderID', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'GetDispatchHeaderByHeaderID', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
                res.end();
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        });
    });
});

router.get('/GetActionStateRule/:ModuleID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ModuleID', sql.VarChar(100), req.params.ModuleID);
        request.execute('USP_WF_GetActionStateRule', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'USP_WF_GetActionStateRule', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
                res.end();
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        });
    });
});

router.get('/loadToPartnerByID/:RefType/:RefID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('RefType', sql.VarChar(100), req.params.RefType);
        request.input('RefID', sql.VarChar(100), req.params.RefID);
        request.execute('USP_GetPartnerIDAddress', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'USP_GetPartnerIDAddress', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
                res.end();
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        });
    });
});




//router.get('/carrier', function (req, res) {
//    var sqlquery = "SELECT CarrierID, CarrierName FROM Carrier ";
//    var con = new sql.Connection(settings.DBconfig(req));
//    con.connect().then(function () {
//        var reqest = new sql.Request(con);
//        reqest.query(sqlquery).then(function (data) {
//            res.write(JSON.stringify(data));
//        })
//            .catch(function (err) {
//                res.write(JSON.stringify({ data: "Error Occured: " + err }));
//            });
//    })
   
//});
router.get('/carrier', function (req, res) {
    db.executeSql(req,"select TypelookUpId , TypeName from TypelookUp  where typegroup= 'CarrierGateway' ", function (data, err) {

        if (err) {
            Error.ErrorLog(err, "select TypelookUpId , TypeName from TypelookUp  where typegroup= 'CarrierGateway' ", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();

    });
});
router.get('/getDimensionList', function (req, res) {
    db.executeSql(req, "select BoxDimensionID,DimensionName from BoxDimension", function (data, err) {

        if (err) {
            Error.ErrorLog(err, "select BoxDimensionID,DimensionName from BoxDimension", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();

    });
});



router.get('/AllPayTerms', function (req, res) {
    db.executeSql(req,"select TypelookUpId , TypeName from TypelookUp  where typegroup= 'PayTerms' ", function (data, err) {

        if (err) {

            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();

    });
});

router.get('/AllShipVia', function (req, res) {
    db.executeSql(req,"select TypelookUpId , TypeName from TypelookUp  where typegroup= 'ShipVia' ", function (data, err) {

        if (err) {

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
    db.executeSql(req,"select TypelookUpId , TypeName from TypelookUp  where typegroup= 'RefType' ", function (data, err) {

        if (err) {

            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();

    });
});

router.get('/loadAddressbyId/:AddressID', function (req, res) {
    var addressID = req.params.AddressID;
    db.executeSql(req,"select Address1 + ','+ address2 + ','+ City +','+ZipCode as Address from address  where AddressID=" + addressID, function (data, err) {

        if (err) {

            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write(JSON.stringify(data));
        }
        res.end();

    });
});

router.get('/loadTypeByCode/:RefCode', function (req, res) {
    var RefCode = req.params.RefCode;
    db.executeSql(req, "select TypeLookUpID from typelookup  where typegroup='RefType' and TypeCode=" + "'"+ RefCode +"'" , function (data, err) {

        if (err) {

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
        request.output('DispatchNumber', sql.VarChar(100));
        request.execute('usp_SaveDispatch', function (err, recordsets) {
            if (err) {
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
                res.end();
            }
            else {
                res.send({ result: request.parameters.result.value, DispatchNumber: request.parameters.DispatchNumber.value });
            }
            connection.close();
        })
    });
});

router.put('/:DispatchHeaderID', function (req, res) {
    var DispatchHeaderID = req.params.DispatchHeaderID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.input('DispatchHeaderID', sql.Int, DispatchHeaderID);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.output('DispatchNumber', sql.VarChar(100));
        request.execute('usp_UpdateDispatchByHeaderId', function (err, recordsets) {

            res.send({ result: request.parameters.result.value, DispatchNumber: request.parameters.DispatchNumber.value });
            connection.close();
        })
    });
});


router.get('/GetInventoryQuantity/:ItemMasterID/:NodeID/:PartnerLocationID', function (request, response) {
    var ItemMasterID = request.params.ItemMasterID;
    var NodeID = request.params.NodeID;
    var PartnerLocationID = request.params.PartnerLocationID;
    db.executeSql(request, 'select * from [dbo].[vw_ItemInventoryLocationWise]  where ItemMasterID=' + ItemMasterID + ' and NodeID=' + NodeID + ' and PartnerLocationId=' + PartnerLocationID, function (data, err) {
        if (err) {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.write(JSON.stringify(data));
        }
        response.end();

    });
});
router.get('/GetAllInventoryQuantity/:NodeID/:PartnerLocationID', function (request, response) {
    var ItemMasterID = request.params.ItemMasterID;
    var NodeID = request.params.NodeID;
    var PartnerLocationID = request.params.PartnerLocationID;
    db.executeSql(request, 'select * from [dbo].[vw_ItemInventoryLocationWise]  where  NodeID=' + NodeID + ' and PartnerLocationId=' + PartnerLocationID, function (data, err) {
        if (err) {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.write(JSON.stringify(data));
        }
        response.end();

    });
});
router.get('/ExportToExcel2/:orderType', function (req, res) {
    var OrderType = req.params.orderType;
    var nodeExcel = require('excel-export');
    var dateFormat = require('dateformat');
    //var contentDisposition = require('content-disposition')
    var sql = "SELECT DispatchNumber, DispatchDate, PartnersFrom.PartnerName as FromPartner, PartnersVendor.PartnerName as ToPartner, [Statuses].StatusName, TypeCode, FromAddressID"
        +" from DispatchHeader LEFT JOIN [Users] User_CreatedBy ON DispatchHeader.CreatedBy = User_CreatedBy.UserID"
        +" LEFT JOIN [Users] User_ModifyBy ON DispatchHeader.ModifyBy = User_ModifyBy.UserID"
        +" LEFT JOIN [ModuleStatusMap] MSM ON DispatchHeader.ModuleStatusMapID = MSM.ModuleStatusMapID"
        +" LEFT JOIN [Statuses]  ON MSM.StatusID = [Statuses].StatusID"
        +" LEFT JOIN [TypelookUp] On DispatchHeader.RefTypeID = [TypelookUp].TypelookUpID"
        +" INNER JOIN ModuleStatusMap _ModuleStatusMap ON _ModuleStatusMap.ModuleStatusMapID = DispatchHeader.ModuleStatusMapID"
        +" INNER JOIN [Statuses] _Status ON  _Status.StatusID = _ModuleStatusMap.StatusID"
        +" LEFT JOIN [Partners] PartnersFrom ON DispatchHeader.FromPartnerID = PartnersFrom.PartnerID"
        +" LEFT JOIN [Partners] PartnersVendor ON DispatchHeader.ToPartnerID = PartnersVendor.PartnerID"
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
        caption: 'Shipment#',
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
        caption: 'Dispatch Date',
        type: 'date',
        width: 20,
        headerStyle: styles.headerDark
    },
    {
        caption: 'From Partner',
        type: 'string',
        width: 20,
        headerStyle: styles.headerDark
    },
    {
        headerStyle: styles.headerDark,
        caption: 'To Partner',
        type: 'string',
        width: 15


    },
    {
        caption: 'Status',
        type: 'date',
        width: 20,
        headerStyle: styles.headerDark
    },
    {
        caption: 'Ref Type',
        type: 'string',
        width: 15,
        headerStyle: styles.headerDark
    },
    //{
    //    caption: 'To Address',
    //    type: 'date',
    //    width: 20,

    //    headerStyle: styles.headerDark
    //},
    {
        caption: 'From Address',
        type: 'string',
        width: 20,

        headerStyle: styles.headerDark
    }
    ];

    db.executeSql(req, sql, function (rows, err) {
        arr = [];
        for (i = 0; i < rows.length; i++) {
          
            DispatchNumber = rows[i].DispatchNumber;
            DispatchDate = rows[i].DispatchDate;
            FromPartner = rows[i].FromPartner;
            ToPartner = rows[i].ToPartner;
            StatusName = rows[i].StatusName;
            TypeCode = rows[i].TypeCode;
            FromAddressID = rows[i].FromAddressID;
           

            a = [DispatchNumber, (dateFormat(DispatchDate, "dd/mm/yyyy")), FromPartner, ToPartner, StatusName, TypeCode, FromAddressID];
            arr.push(a);

        }
        // console.dir(arr);
        conf.rows = arr;
        console.dir(conf);
        var result = nodeExcel.execute(conf);
        res.setHeader("Content-Disposition", "attachment;filename=" + OrderType + "Dispatch.xlsx");
       // res.setHeader('Content-Disposition: attachment; filename="My Report.doc"');
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
       // //
       // request.input('StartIndex', sql.Int, req.params.StartIndex);
       // request.input('PageSize', sql.Int, req.params.PageSize);
       // request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
       // request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
       // request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
       // request.output('TotalCount', sql.Int);
       // request.input('Status', sql.VarChar(100), req.params.status);
       // request.input("PartnerID", sql.Int, req.params.PartnerID);
       ////
        request.input('Status', sql.VarChar(100), OrderType);
        request.input('StartIndex', sql.Int, 0);
        request.input('PageSize', sql.Int, 25000);
        request.input("SortColumn", sql.VarChar(50), 'null');
        request.input("SortDirection", sql.VarChar(4), 'null');
        request.input("FilterValue", sql.VarChar(1000), 'null');
        //request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.output('TotalCount', sql.Int);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.input("PartnerID", sql.Int, 7);
        request.execute('GetDispatchOrdersWithPaging', function (err, recordsets, returnValue) {
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
                caption: 'Shipment#',
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
                caption: 'Dispatch Date',
                type: 'date',
                width: 20,
                headerStyle: styles.headerDark
            },
            {
                caption: 'From Partner',
                type: 'string',
                width: 20,
                headerStyle: styles.headerDark
            },
            {
                headerStyle: styles.headerDark,
                caption: 'To Partner',
                type: 'string',
                width: 15


            },
            {
                caption: 'Status',
                type: 'date',
                width: 20,
                headerStyle: styles.headerDark
            },
            {
                caption: 'Ref Type',
                type: 'string',
                width: 15,
                headerStyle: styles.headerDark
            },
            //{
            //    caption: 'To Address',
            //    type: 'date',
            //    width: 20,

            //    headerStyle: styles.headerDark
            //},
            {
                caption: 'From Address',
                type: 'string',
                width: 20,

                headerStyle: styles.headerDark
            }
            ];

            arr = [];

            for (i = 0; i < rows.length; i++) {
                DispatchNumber = rows[i].DispatchNumber;
                DispatchDate = rows[i].DispatchDate;
                FromPartner = rows[i].PartnerName;
                ToPartner = rows[i].VendorPartner;
                StatusName = rows[i].StatusName;
                TypeCode = rows[i].RefType;
                FromAddressID = rows[i].FromAddressID;


                a = [DispatchNumber, (dateFormat(DispatchDate, "dd/mm/yyyy")), FromPartner, ToPartner, StatusName, TypeCode, FromAddressID];
                arr.push(a);
            }

            conf.rows = arr;
            //console.dir(conf);
            var result = nodeExcel.execute(conf);
            res.setHeader("Content-Disposition", "attachment;filename=" + OrderType + "Dispatch.xlsx");
            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.end(result, 'binary');
            connection.close();
        });
    });
});

module.exports = router;