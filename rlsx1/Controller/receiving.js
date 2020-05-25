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
        sqlRequest.input('ActionCode', sql.VarChar(50), request.query.actioncode);
        
        sqlRequest.output('TotalCount', sql.Int);

        sqlRequest.execute('usp_GetMRNHeaderswithPaging', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "usp_GetMRNHeaderswithPaging", JSON.stringify(request.parameters), request);
            }
            response.send({ recordsets: recordsets, totalcount: sqlRequest.parameters.TotalCount.value })
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.get('/GetItemAccessories/:ItemModelID', function (req, res) {
    var connection = new sql.Connection(dbSettings.DBconfig(req));
    connection.connect().then(function (error) {
        var request = new sql.Request(connection);
        request.input('ItemModelID', sql.VarChar(20), req.params.ItemModelID);
        request.execute('usp_GetAccessoryByModelID', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetAccessoryByModelID", JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            connection.close();
        })
    });
});

router.get('/get/:key', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('key', sql.Int, request.params.key);

        sqlRequest.execute('usp_GetMRNHeaderByKey', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "usp_GetMRNHeaderByKey", JSON.stringify(request.parameters), request);
            }
            response.send(recordsets);
            console.dir(recordsets);
            connection.close();
        })


    });
});

router.get('/Carriers', function (request, response) {
    dbHelper.executeSql(request, 'select *from vw_GetCarrierByPartner', function (data, err) {
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

router.get('/GetWorkflowID', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('RefType', sql.VarChar(100), request.query.RefType);
        sqlRequest.input('RefNumber', sql.VarChar(100), request.query.RefNumber);

        sqlRequest.execute('usp_GetMRNWorkFlowDetails', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "USP_WF_GetActionStateRule", JSON.stringify(request.parameters), request);
                response.send({ error: err });
            }
            else {
                response.send({ recordsets: recordsets });
            }
            connection.close();
            response.end();
        })
    });
});

router.get('/ReceivingActions/:key', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('WorkFlowID', sql.Int, request.params.key);

        sqlRequest.execute('USP_WF_GetActionStateRuleByWorkFlowID', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "USP_WF_GetActionStateRuleByWorkFlowID", JSON.stringify(request.parameters), request);
                var i = error;
            }

            response.send(recordsets);
            console.dir(recordsets);
            connection.close();
        })


    });
});

router.get('/Lines/:key', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('HeaderId', sql.Int, request.params.key);

        sqlRequest.execute('usp_GetMRNLines', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "usp_GetMRNLines", JSON.stringify(request.parameters), request);
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

router.get('/GetPartnerDetailsBySRO/:type/:RefId', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function (error) {
        var sqlRequest = new sql.Request(connection);
        sqlRequest.input('type', sql.VarChar(500), request.params.type);
        sqlRequest.input('RefId', sql.Int, request.params.RefId);
        sqlRequest.execute('usp_GetPartnerDetailsBySRO', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetPartnerDetailsBySRO", JSON.stringify(request.parameters), request);
                res.send({ error: err });
            }
            else {
                response.send({ recordsets: recordsets});
            }
            connection.close();
            response.end();           
        })
    });
});

router.get('/Location/:PartnerId', function (request, response) {
    dbHelper.executeSql(request, `select PartnerLocationID as LocationID,LocationName from PartnerLocation where parentpartnerlocationid is null and PartnerID=${request.params.PartnerId}`, function (data, err) {
        if (err) {
            Error.ErrorLog(err, `select PartnerLocationID as LocationID,LocationName from PartnerLocation where parentpartnerlocationid is null and PartnerID=${request.params.PartnerId}`, "", request);
            response.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            response.write(JSON.stringify(data));
        }
        response.end();
    });
});

router.get('/LocationByCode/:PartnerId/:LocationCode', function (request, response) {
    dbHelper.executeSql(request, `select PartnerLocationID ,LocationName from PartnerLocation where TenantLocationCode = '${request.params.LocationCode}' and PartnerID=${request.params.PartnerId}`, function (data, err) {
        if (err) {
            Error.ErrorLog(err, `select PartnerLocationID ,LocationName from PartnerLocation where TenantLocationCode = '${request.params.LocationCode}' and PartnerID=${request.params.PartnerId}`, "", request);
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
        sqlRequest.input('in_model', sql.VarChar(sql.MAX), JSON.stringify(request.body));
        sqlRequest.output('MRNNumber', sql.VarChar(100));
        
        sqlRequest.execute('usp_SaveMRNNew', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, `usp_SaveMRNNew`, JSON.stringify(request.parameters), request);
                console.dir('here');
            }
            else {
                console.dir('there');
            }
            response.send({ recordsets: recordsets, MRNNumber: sqlRequest.parameters.MRNNumber.value });
            connection.close();
        })
    });
});

router.post('/SavePutAway', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function (error) {
        var sqlRequest = new sql.Request(connection);
        console.dir(JSON.stringify(request.body));
        sqlRequest.input('PutAwayData', sql.VarChar(sql.MAX), JSON.stringify(request.body));        

        sqlRequest.execute('usp_SavePutAway', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, `usp_SavePutAway`, JSON.stringify(request.parameters), request);
                console.dir('here');
            }
            else {
                console.dir('there');
            }
            response.send({ result: "Success" });
            connection.close();            
        })       
    });
});

router.post('/Scan', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function (error) {
        var sqlRequest = new sql.Request(connection);
        var strjson = JSON.stringify(request.body);
        sqlRequest.input('in_model', sql.VarChar(sql.MAX), JSON.stringify(request.body));
        sqlRequest.output('MRNNumberList', sql.VarChar(1000));
        sqlRequest.execute('usp_SaveScanMRN', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, `usp_SaveScanMRN`, JSON.stringify(request.parameters), request);
                console.dir('here');
            }
            else {
                console.dir('there');
            }            
            response.send({ recordsets: recordsets, MRNNumberList: sqlRequest.parameters.MRNNumberList.value });
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
        sqlRequest.execute('usp_Receiving_validateSN', function (err, recordsets, returnValue) {

            if (err) {
                Error.ErrorLog(err, 'usp_Receiving_validateSN', JSON.stringify(request.parameters), request);
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


router.get('/GetRefHeaderLines/:typecode/:refTypeID/:PartnerID/:UserID', function (req, res) {
    var connection = new sql.Connection(dbSettings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('TypeCode', sql.VarChar(100), req.params.typecode);
        request.input('RefTypeId', sql.Int, req.params.refTypeID);
        request.input('PartnerID', sql.Int, req.params.PartnerID);
        request.input('UserID', sql.Int, req.params.UserID);
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

router.get('/GetRMALines/:Userid/:PartnerId/:RefType', function (req, res) {
    var connection = new sql.Connection(dbSettings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('Userid', sql.Int, req.params.Userid);
        request.input('PartnerId', sql.Int, req.params.PartnerId);
        request.input('RefType', sql.VarChar(100), req.params.RefType);
        request.execute('usp_GetRmaLine', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'usp_GetRmaLine', JSON.stringify(request.parameters), req);
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

router.get('/GetReceivingScanItem/:PartnerId/:ScanValue', function (req, res) {
    var connection = new sql.Connection(dbSettings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);        
        request.input('PartnerId', sql.Int, req.params.PartnerId);
        request.input('ScanValue', sql.VarChar(500), req.params.ScanValue);
        request.execute('usp_GetReceivingScanItem', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, 'usp_GetReceivingScanItem', JSON.stringify(request.parameters), req);
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

router.get('/getTypeLookUpByName/:typegroup', function (req, res) {

    var connection = new sql.Connection(dbSettings.DBconfig(req));
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

router.get('/GetMRNItem/:PartnerID/:ActionCode/:MRNNumber/:UserID', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('PartnerID', sql.Int, request.params.PartnerID);
        sqlRequest.input('ActionCode', sql.VarChar(50), request.params.ActionCode);
        sqlRequest.input('MRNNumber', sql.VarChar(50), request.params.MRNNumber);
        sqlRequest.input('UserID', sql.Int, request.params.UserID);        
        sqlRequest.execute('usp_GetScanItem', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "usp_GetScanItem", JSON.stringify(request.parameters), request);
            }
            response.send(recordsets);
            connection.close();
            console.dir(recordsets);
        })
    });
});

router.get('/ScanSerialItem/:PartnerID/:MRNNumber/:FilterValue/:ActionCode', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('PartnerID', sql.Int, request.params.PartnerID);
        sqlRequest.input('MRNNumber', sql.VarChar(50), request.params.MRNNumber);
        sqlRequest.input('FilterValue', sql.VarChar(200), request.params.FilterValue);
        sqlRequest.input('ActionCode', sql.VarChar(200), request.params.ActionCode);
        sqlRequest.execute('usp_ScanSerialItem', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "usp_ScanSerialItem", JSON.stringify(request.parameters), request);
            }
            response.send(recordsets);
            connection.close();
            console.dir(recordsets);
        })
    });
});

router.get('/ScanNonSerialItem/:PartnerID/:StatusCode/:FilterValue/:SalesReturnOrderNumber', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);
        sqlRequest.input('PartnerID', sql.Int, request.params.PartnerID);
        sqlRequest.input('StatusCode', sql.VarChar(50), request.params.StatusCode);
        sqlRequest.input('FilterValue', sql.VarChar(200), request.params.FilterValue);
        sqlRequest.input('SalesReturnOrderNumber', sql.VarChar(100), request.params.SalesReturnOrderNumber);
        sqlRequest.execute('usp_ScanNonSerialItem', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "usp_ScanNonSerialItem", JSON.stringify(request.parameters), request);
            }
            response.send(recordsets);
            connection.close();
            console.dir(recordsets);
        })
    });
});

router.put('/:Action', function (req, res) {
    
    var connection = new sql.Connection(dbSettings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);               
        request.input('Items', sql.VarChar(sql.MAX), JSON.stringify(req.body));  
        request.input('Action', sql.VarChar(50), req.params.Action);        
        request.execute('usp_UpdateContainer', function (err, recordsets) {
            if (err) {
                res.send({ result: err.message }); 
                Error.ErrorLog(err, "usp_UpdateContainer", JSON.stringify(request.parameters), req);
            }
            else {
                res.send({ result: "Success" });                
            }

            connection.close();
        })
    });
});

router.put('/', function (req, res) {

    var connection = new sql.Connection(dbSettings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('Items', sql.VarChar(sql.MAX), JSON.stringify(req.body));        
        request.execute('usp_UpdateMrnItemStatus', function (err, recordsets) {
            if (err) {
                res.send({ result: err.message });
                Error.ErrorLog(err, "usp_UpdateMrnItemStatus", JSON.stringify(request.parameters), req);
            }
            else {
                res.send({ result: "Success" });
            }

            connection.close();
        })
    });
});

router.get('/GetContainer/:Action/:PartnerID', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);
        
        sqlRequest.input('Action', sql.VarChar(50), request.params.Action);     
        sqlRequest.input('PartnerID', sql.Int, request.params.PartnerID);  
        sqlRequest.execute('usp_GetContainer', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "usp_GetContainer", JSON.stringify(request.parameters), request);
            }
            response.send(recordsets);
            connection.close();
            console.dir(recordsets);
        })
    });
});

router.get('/GetPutAwayContainer/:PartnerID/:UserID', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);
        sqlRequest.input('PartnerID', sql.Int, request.params.PartnerID);
        sqlRequest.input('UserID', sql.Int, request.params.UserID);
        sqlRequest.execute('usp_GetPutAwayList', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "usp_GetPutAwayList", JSON.stringify(request.parameters), request);
            }
            response.send(recordsets);
            connection.close();
            console.dir(recordsets);
        })
    });
});

router.get('/CheckContainer/:Container', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);
        
        sqlRequest.input('Container', sql.VarChar(100), request.params.Container);        
        sqlRequest.execute('usp_ChecKContainer', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "usp_ChecKContainer", JSON.stringify(request.parameters), request);
            }
            response.send(recordsets);
            connection.close();
            console.dir(recordsets);
        })
    });
});

router.get('/GenerateContainerNumber/:PartnerID', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function () {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('PartnerID', sql.Int, request.params.PartnerID);        
        sqlRequest.execute('usp_GenerateContainerNumber', function (error, recordsets, returnvalue) {
            if (error) {
                Error.ErrorLog(error, "usp_GenerateContainerNumber", JSON.stringify(request.parameters), request);
            }
            response.send(recordsets);
            connection.close();
            console.dir(recordsets);
        })
    });
});

module.exports = router;

