var express = require('express');
var router = express.Router();
var sql = require('mssql');
var dbHelper = require('../shared/DBAccess');
var dbSettings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');
router.get('/', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('search', sql.VarChar(2000), request.query.FilterValue);
        sqlRequest.input('StartIndex', sql.Int, request.query.StartIndex);
        sqlRequest.input('PageSize', sql.Int, request.query.PageSize);
        sqlRequest.input('SortCol', sql.VarChar(100), request.query.SortColumn);
        sqlRequest.input('SortOrder', sql.VarChar(4), request.query.SortDirection);
        sqlRequest.input('PartnerId', sql.Int, request.query.PartnerId);
        sqlRequest.input('UserId', sql.Int, request.query.UserId);
        sqlRequest.input('Status', sql.VarChar(100), request.query.tabType);


        sqlRequest.output('TotalCount', sql.Int);

        sqlRequest.execute('usp_trans_GetTransOrderByPaging', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "usp_trans_GetTransOrderByPaging", JSON.stringify(request.parameters), req);
            }
            response.send({ recordsets: recordsets, totalcount: sqlRequest.parameters.TotalCount.value })
            console.dir(recordsets);
            connection.close();
        })


    });
});


router.get('/get/:key', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('key', sql.Int, request.params.key);

        sqlRequest.execute('usp_trans_GetTransOrderByKey', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "usp_trans_GetTransOrderByKey", JSON.stringify(request.parameters), request);
            }
            response.send(recordsets);
            console.dir(recordsets);
            connection.close();
        })


    });
});


router.get('/Carriers', function (request, response) {
    dbHelper.executeSql(request, 'select CarrierID,CarrierNumber,CarrierName from Carrier', function (data, err) {
        if (err) {
            Error.ErrorLog(err, "select *from vw_GetCarrierByPartner", "", request);
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

router.get('/CarrierLanes', function (request, response) {
    dbHelper.executeSql(request, 'select *from vw_GetCarrierLanesByCarrier', function (data, err) {
        if (err) {
            Error.ErrorLog(err, "vw_GetCarrierLanesByCarrier", "", request);
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

router.get('/EquipmentTypes', function (request, response) {
    dbHelper.executeSql(request, 'select EquipmentTypeID,EquipmentNumber,EquipmentName,Volume,VolumeUOM,PayLoad,PayLoadUOM from EquipmentType', function (data, err) {
        if (err) {
            Error.ErrorLog(err, "select *from vw_GetCarrierByPartner", "", request);
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

router.get('/ReceivingActions1/:key', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('ModuleID', sql.Int, request.params.key);

        sqlRequest.execute('USP_WF_GetActionStateRule', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "USP_WF_GetActionStateRule", JSON.stringify(request.parameters), request);
                var i = error;
            }

            response.send(recordsets);
            console.dir(recordsets);
            connection.close();
        })


    });
});

router.get('/GetLoadLines', function (req, res) {
    var connection = new sql.Connection(dbSettings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('carrierLaneID', sql.Int, req.query.carrierLaneID);
        request.execute('usp_transorder_GetLoadLines', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'usp_transorder_GetLoadLines', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send(JSON.stringify(recordsets[0]));
            }
            connection.close();
        })
    });
});

router.get('/Lines/:key', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('HeaderId', sql.Int, request.params.key);

        sqlRequest.execute('usp_transorder_GetLines', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "usp_transorder_GetLines", JSON.stringify(request.parameters), request);
            }
            response.send(recordsets);
            connection.close();
            console.dir(recordsets);
        })


    });
});

router.get('/TaskQueue', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('search', sql.VarChar(2000), request.query.FilterValue);
        sqlRequest.input('StartIndex', sql.Int, request.query.StartIndex);
        sqlRequest.input('PageSize', sql.Int, request.query.PageSize);
        sqlRequest.input('SortCol', sql.VarChar(100), request.query.SortColumn);
        sqlRequest.input('SortOrder', sql.VarChar(4), request.query.SortDirection);
        sqlRequest.input('PartnerId', sql.Int, request.query.PartnerId);
        sqlRequest.input('UserId', sql.Int, request.query.UserId);


        sqlRequest.output('TotalCount', sql.Int);

        sqlRequest.execute('usp_receiving_taskqueue', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "usp_receiving_taskqueue", JSON.stringify(request.parameters), request);
            }
            response.send({ recordsets: recordsets, totalcount: sqlRequest.parameters.TotalCount.value })
            console.dir(recordsets);
            connection.close();
        })


    });
});



router.get('/GetPartnerDetailsByPO/:type/:RefId', function (request, response) {
    dbHelper.executeSql(request, `select top 1 POHeaderID,poh.PartnerID,p.PartnerName,a.AddressID as FromAddressId,poh.ShipViaTypeID,poh.PayTermTypeID,
                     isnull(a.Address1,'')+','+isnull(a.Address2,'')+','+isnull(a.City,'')+','+isnull(a.ZipCode,'')+','+isnull(s.StateName,'')+','+isnull(c.CountryName,'') as FromAddress from POHeader poh
                    inner join Partners p on p.PartnerId=poh.VendorPartnerId
                    left join PartnerAddressMap map on map.PartnerID=p.PartnerID
                    left join address a on a.AddressID=map.AddressID
                    left join state s on a.AddressID=s.StateID
                    left join country c on c.CountryID=s.CountryID
                    where POHeaderID=${request.params.RefId}`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `select top 1 POHeaderID,poh.PartnerID,p.PartnerName,a.AddressID as FromAddressId,poh.ShipViaTypeID,poh.PayTermTypeID,
                     isnull(a.Address1,'')+','+isnull(a.Address2,'')+','+isnull(a.City,'')+','+isnull(a.ZipCode,'')+','+isnull(s.StateName,'')+','+isnull(c.CountryName,'') as FromAddress from POHeader poh
                    inner join Partners p on p.PartnerId=poh.VendorPartnerId
                    left join PartnerAddressMap map on map.PartnerID=p.PartnerID
                    left join address a on a.AddressID=map.AddressID
                    left join state s on a.AddressID=s.StateID
                    left join country c on c.CountryID=s.CountryID
                    where POHeaderID=${request.params.RefId}`, "", request);
                response.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                response.write(JSON.stringify(data));
            }
            response.end();
        });
});

router.get('/GetPartnerDetailsBySTO/:type/:RefId', function (request, response) {
    dbHelper.executeSql(request, `select top 1 STOHeaderID,sto.FromPartnerID,p.PartnerName,a.AddressID as FromAddressId,
                     isnull(a.Address1,'')+','+isnull(a.Address2,'')+','+isnull(a.City,'')+','+isnull(a.ZipCode,'')+','+isnull(s.StateName,'')+','+isnull(c.CountryName,'') as FromAddress 
                     from stoheader sto
                    inner join Partners p on p.PartnerId=sto.fromPartnerId
                    left join PartnerAddressMap map on map.PartnerID=p.PartnerID
                    left join address a on a.AddressID=map.AddressID
                    left join state s on a.AddressID=s.StateID
                    left join country c on c.CountryID=s.CountryID
                    where stoHeaderID=${request.params.RefId}`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `select top 1 STOHeaderID,sto.FromPartnerID,p.PartnerName,a.AddressID as FromAddressId,
                     isnull(a.Address1,'')+','+isnull(a.Address2,'')+','+isnull(a.City,'')+','+isnull(a.ZipCode,'')+','+isnull(s.StateName,'')+','+isnull(c.CountryName,'') as FromAddress 
                     from stoheader sto
                    inner join Partners p on p.PartnerId=sto.fromPartnerId
                    left join PartnerAddressMap map on map.PartnerID=p.PartnerID
                    left join address a on a.AddressID=map.AddressID
                    left join state s on a.AddressID=s.StateID
                    left join country c on c.CountryID=s.CountryID
                    where stoHeaderID=${request.params.RefId}`, "", request);
                response.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                response.write(JSON.stringify(data));
            }
            response.end();
        });
});

router.get('/GetPartnerDetailsByIO/:type/:RefId', function (request, response) {
    dbHelper.executeSql(request, `select top 1 IOHeaderID,ioh.VendorPartnerID,p.PartnerName,a.AddressID as FromAddressId,
                     isnull(a.Address1,'')+','+isnull(a.Address2,'')+','+isnull(a.City,'')+','+isnull(a.ZipCode,'')+','+isnull(s.StateName,'')+','+isnull(c.CountryName,'') as FromAddress 
                     from IOHeader ioh
                    inner join Partners p on p.PartnerId=ioh.VendorPartnerID
                    left join PartnerAddressMap map on map.PartnerID=p.PartnerID
                    left join address a on a.AddressID=map.AddressID
                    left join state s on a.AddressID=s.StateID
                    left join country c on c.CountryID=s.CountryID
                    where IOHeaderID=${request.params.RefId}`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `select top 1 IOHeaderID,ioh.VendorPartnerID,p.PartnerName,a.AddressID as FromAddressId,
                     isnull(a.Address1,'')+','+isnull(a.Address2,'')+','+isnull(a.City,'')+','+isnull(a.ZipCode,'')+','+isnull(s.StateName,'')+','+isnull(c.CountryName,'') as FromAddress 
                     from IOHeader ioh
                    inner join Partners p on p.PartnerId=ioh.VendorPartnerID
                    left join PartnerAddressMap map on map.PartnerID=p.PartnerID
                    left join address a on a.AddressID=map.AddressID
                    left join state s on a.AddressID=s.StateID
                    left join country c on c.CountryID=s.CountryID
                    where IOHeaderID=${request.params.RefId}`, "", request);
                response.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                response.write(JSON.stringify(data));
            }
            response.end();
        });
});

router.get('/Location/:PartnerId', function (request, response) {
    dbHelper.executeSql(request, `select PartnerLocationID as LocationID,LocationName from PartnerLocation  where PartnerID=${request.params.PartnerId}`, function (data, err) {
        if (err) {
            Error.ErrorLog(err, `select PartnerLocationID as LocationID,LocationName from PartnerLocation  where PartnerID=${request.params.PartnerId}`, "", request);
            response.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            response.write(JSON.stringify(data));
        }
        response.end();
    });
});



router.post('/', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function (error) {
        var sqlRequest = new sql.Request(connection);
        console.dir(JSON.stringify(request.body));
        sqlRequest.input('in_model', sql.VarChar(10000), JSON.stringify(request.body));
        sqlRequest.execute('usp_transorder_saveorder', function (err, recordsets, returnValue) {

            if (err) {
                Error.ErrorLog(err, `usp_transorder_saveorder`, JSON.stringify(request.parameters), request);
                console.dir('here');
            }
            else {
                console.dir('there');
            }
            response.send(recordsets);
            connection.close();
        })
    });
});

router.post('/ValidateSN', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function (error) {
        var sqlRequest = new sql.Request(connection);
        console.dir(JSON.stringify(request.body));
        sqlRequest.input('in_model', sql.VarChar(10000), JSON.stringify(request.body));
        sqlRequest.execute('usp_SaveMRN', function (err, recordsets, returnValue) {

            if (err) {
                Error.ErrorLog(err, 'usp_SaveMRN', JSON.stringify(request.parameters), request);
                console.dir('here');
            }
            else {
                console.dir('there');
            }
            response.send(recordsets);
            connection.close();
        })
    });
});


router.get('/GetRefHeaderLines/:typecode/:refTypeID', function (req, res) {
    var connection = new sql.Connection(dbSettings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('TypeCode', sql.VarChar(100), req.params.typecode);
        request.input('RefTypeId', sql.Int, req.params.refTypeID);
        request.execute('usp_receiving_GetLinesForOrder', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'usp_receiving_GetLinesForOrder', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send(JSON.stringify(recordsets[0]));
            }
            connection.close();
        })
    });
});
router.get('/ExportToExcel/:orderType', function (req, res) {
    var OrderType = req.params.orderType;
    var nodeExcel = require('excel-export');
    var dateFormat = require('dateformat');
    var sql = "select  MRNNumber,RefrenceNumber,Remarks,BOLNumber,Partners_from.PartnerName as FromPartner,Partners_to.PartnerName as ToPartner,"
        + "  TypeLookUp_shipvia.TypeName as ShipVia, TypeLookUp_PayTerm.TypeName as PayType, TypeLookUp_ref.TypeName as RefType, UserName"
        + " from MRNHeader "
        + " left JOIN Partners Partners_from on MRNHeader.FromPartnerID = Partners_from.PartnerID"
        + " left JOIN Partners Partners_to on MRNHeader.ToPartnerID = Partners_to.PartnerID"
        + " left JOIN TypeLookUp TypeLookUp_ref on TypeLookUp_ref.TypeLookUpID = MRNHeader.MRNTypeID"
        + " left JOIN TypeLookUp TypeLookUp_shipvia  on TypeLookUp_shipvia.TypeLookUpID = MRNHeader.ShipViaID"
        + " left JOIN TypeLookUp TypeLookUp_PayTerm  on TypeLookUp_PayTerm.TypeLookUpID = MRNHeader.PaymentTermID"
        + " left JOIN Users  on Users.UserID = MRNHeader.CreatedBy order by MRNNumber asc";
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
        caption: 'MRNNumber',
        type: 'string',
        width: 20,
        headerStyle: styles.headerDark
    },
    {
        caption: 'RefrenceNumber',
        type: 'string',
        width: 35,
        headerStyle: styles.cellPink
    },
    {
        caption: 'Remarks',
        type: 'string',
        width: 30,
        headerStyle: styles.cellGreen
    },
    {
        headerStyle: styles.headerDark,
        caption: 'FromPartner',
        type: 'string',
        width: 15


    },
    {
        caption: 'ToPartner',
        type: 'string',
        width: 20,
        headerStyle: styles.headerDark
    },
    {
        caption: 'PayTerm',
        type: 'string',
        width: 15,
        headerStyle: styles.headerDark
    }, {

        caption: 'RefType',
        type: 'string',
        width: 15,
        headerStyle: styles.headerDark
    }, {
        caption: 'ShipVia',
        type: 'string',
        width: 15,
        headerStyle: styles.headerDark
    }, {
        caption: 'UserName',
        type: 'string',
        width: 15,
        headerStyle: styles.headerDark
    },
    {
        caption: 'BOLNumber',
        type: 'string',
        width: 15,
        headerStyle: styles.headerDark
    }
    ];


    dbHelper.executeSql(req, sql, function (rows, err) {
        arr = [];
        for (i = 0; i < rows.length; i++) {
            MRNNumber = rows[i].MRNNumber;
            RefrenceNumber = rows[i].RefrenceNumber;
            Remarks = rows[i].Remarks;
            FromPartner = rows[i].FromPartner;
            ToPartner = rows[i].ToPartner;
            PayType = rows[i].PayType;
            RefType = rows[i].RefType;
            Payterm = rows[i].Payterm;
            ShipVia = rows[i].ShipVia;
            UserName = rows[i].UserName;
            BOLNumber = rows[i].BOLNumber;

            a = [MRNNumber, RefrenceNumber, Remarks, FromPartner, ToPartner, PayType, RefType, ShipVia, UserName, BOLNumber];
            arr.push(a);

        }
        conf.rows = arr;
        var result = nodeExcel.execute(conf);
        res.setHeader("Content-Disposition", "attachment;filename=" + "Recieving.xlsx");
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.end(result, 'binary');
    });
});

module.exports = router;

