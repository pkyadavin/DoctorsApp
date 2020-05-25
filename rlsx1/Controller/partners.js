var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var helper = require('../UtilityLib/BlobHelper');
var multer = require('multer');
var upload = multer({ dest: '../Uploads/' })
var Error = require('../shared/ErrorLog');

router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:partnerType/:status/:PartnerID/:PIN/:ChildOnly', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    var pin = req.params.PIN
    if (pin == "undefined")
        pin = "";
    var chonly = (req.params.ChildOnly == false || req.params.ChildOnly.toLowerCase() == 'false') ? 0 : 1;
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(500), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("PartnerType", sql.VarChar(50), req.params.partnerType);
        request.input('status', sql.Int, req.params.status);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.input("PIN", sql.VarChar(50), pin);
        request.input("ChildOnly", sql.Bit, chonly);
        request.output('TotalCount', sql.Int);
        request.output('access_rights', sql.NVarChar(sql.MAX));
        request.execute('usp_Partner_GetAll', function (err, recordsets, returnValue) {
            console.dir(err);
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            if (err) {
                Error.ErrorLog(err, "usp_Partner_GetAll", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value, access_rights: request.parameters.access_rights.value });
            connection.close();
        })
    });
});

router.post('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:partnerType/:status/:PartnerID/:PIN/:ChildOnly', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    var pin = req.params.PIN
    if (pin == "undefined")
        pin = "";
    var chonly = (req.params.ChildOnly == false || req.params.ChildOnly.toLowerCase() == 'false') ? 0 : 1;
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(500), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("PartnerType", sql.VarChar(50), req.params.partnerType);
        request.input('status', sql.Int, req.params.status);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.input("PIN", sql.VarChar(50), pin);
        request.input("ChildOnly", sql.Bit, chonly);
        request.input("jsonData", sql.NVarChar(sql.MAX), req.body['jsonData']);
        request.output('TotalCount', sql.Int);
        request.output('access_rights', sql.NVarChar(sql.MAX));
        request.execute('usp_Partner_GetAll', function (err, recordsets, returnValue) {
            console.dir(err);
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            if (err) {
                Error.ErrorLog(err, "usp_Partner_GetAll", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value, access_rights: request.parameters.access_rights.value });
            connection.close();
        })
    });
});

router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(500), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);        
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.input("PartnerID", sql.Int, req.params.PartnerID);        
        request.output('TotalCount', sql.Int);
        request.execute('usp_GetSeasonalConfig', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_GetSeasonalConfig", JSON.stringify(request.parameters), req);
            }

            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
        })
    });
});

router.get('/ChildAccounts/:partnerType/:PartnerID/:Scope', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
   
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, 0);
        request.input('PageSize', sql.Int, 99999);
        request.input("SortColumn", sql.VarChar(500), 'PartnerID');
        request.input("SortDirection", sql.VarChar(4), 'desc');
        request.input("FilterValue", sql.VarChar(1000), null);
        request.input("PartnerType", sql.VarChar(50), req.params.partnerType);
        request.input('status', sql.Int, 0);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.input("Scope", sql.Int, req.params.Scope);
        request.output('TotalCount', sql.Int);
        request.execute('usp_Partner_GetAll', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_Partner_GetAll", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
        })
    });
});

router.get('/GetModuleControlValue', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.execute('usp_GetModuleControlValue', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_GetModuleControlValue', JSON.stringify(request.parameters), req);
            }
            res.send(recordsets);
            connection.close();
        })
    });
});

router.get('/getbyId/:partnerId/:typeId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('PartnerId', sql.Int, req.params.partnerId);
        request.input('languageid', sql.Int, req.userlogininfo.languageid);
        request.input('TypeId', sql.VarChar(50), req.params.typeId);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.output('access_rights', sql.NVarChar(sql.MAX));
        request.execute('usp_Partner_GetById', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_Partner_GetById", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, access_rights: request.parameters.access_rights.value });
            connection.close();
        })
    });
});

router.get('/getbyCode/:partnerCode', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('PartnerCode', sql.Int, req.params.partnerCode);
        request.input('languageid', sql.Int, req.userlogininfo.languageid);
        request.execute('usp_Partner_GetByCode', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_Partner_GetByCode", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets });
            connection.close();
        })
    });
});

router.get('/FAQ/:partnerID/:langCode', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('partnerID', sql.Int, req.params.partnerID);
        request.input('langCode', sql.NVarChar(50), req.params.langCode);
        request.execute('usp_partners_FAQ', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_partners_FAQ", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets });
            connection.close();
        })
    });
});

router.get('/getOrigionDestAddress/:partnerId/:typeId/:AddressID/:formName', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('PartnerID', sql.Int, req.params.partnerId);
        request.input('AddressID', sql.Int, req.params.AddressID);
        request.input('AddressTypeID', sql.Int, req.params.typeId);
        request.input('languageid', sql.Int, req.userlogininfo.languageid);
        request.input('formName', sql.VarChar(50), req.params.formName);
        request.execute('usp_Partner_OrigionDestAddress', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_Partner_OrigionDestAddress", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets });
            connection.close();
        })
    });
});

router.get('/getPartnerODPair/:partnerId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('PartnerID', sql.Int, req.params.partnerId);
        request.input('languageid', sql.Int, req.userlogininfo.languageid);

        request.execute('usp_PartnerODPair', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_PartnerODPair", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets });
            connection.close();
        })
    });
});

router.get('/getPartnerLane/:partnerId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('PartnerID', sql.Int, req.params.partnerId);
        request.input('languageid', sql.Int, req.userlogininfo.languageid);

        request.execute('usp_Partner_Lane', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_Partner_Lane", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets });
            connection.close();
        })
    });
});

router.get('/getAccountbyId/:partnerId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('accountID', sql.Int, req.params.partnerId);
     
        request.execute('USP_GetTMSAcountDetails', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "USP_GetTMSAcountDetails", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets });
            connection.close();
        })
    });
});

router.get('/GetRouteLocation', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.execute('GetRouteLocation', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetRouteLocation", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets });
            connection.close();
        })
    });
});

router.get('/GetPartnerODMap/:partnerId', function (req, res) {
    var partnerId = req.params.partnerId;
    db.executeSql(req, 'SELECT pop.*,CAST((CASE WHEN (plopm.PartnerODPairID IS NULL) THEN 0 ELSE 1 END) AS BIT) Selected    FROM PartnerODPair pop LEFT JOIN PartnerLaneODpairMap plopm on pop.PartnerODPairID = plopm.PartnerODPairID WHERE pop.PartnerID = ' + partnerId+' ', function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT pop.*,CAST((CASE WHEN (plopm.PartnerODPairID IS NULL) THEN 0 ELSE 1 END) AS BIT) Selected    FROM PartnerODPair pop LEFT JOIN PartnerLaneODpairMap plopm on pop.PartnerODPairID = plopm.PartnerODPairID WHERE pop.PartnerID = ' + partnerId+'", "", req);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/GetCarrierODPairByLaneId/:CarrierLaneID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('CarrierLaneID', sql.Int, req.params.CarrierLaneID);
        request.execute('GetCarrierODPairByLaneId', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetCarrierODPairByLaneId", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets });
            connection.close();
        })
    });
});

router.delete('/:partnerId', function (req, res) {
    var partnerId = req.params.partnerId;
    db.executeSql(req,'delete from Partners where PartnerID=' + partnerId, function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'delete from Partners where PartnerID=' + partnerId, "", req);
            res.status(401).send({ data: "Error Occured: " + err });
        }
        else {
            res.status(200).send({ data: 'deleted' });
        }
    });
});

router.post('/save/:partnerType', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('Partner', sql.NVarChar(sql.MAX), req.body[0].Partner);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('PartnerType', sql.VarChar(50), req.params.partnerType);
        request.output('result', sql.VarChar(5000));
        request.output('PartnerID', sql.Int);
        if (req.params.partnerType != 'PTR006') {

            request.execute('usp_Partner_SaveDetail', function (err, recordsets) {
                if (err) {
                    Error.ErrorLog(err, 'usp_Partner_SaveDetail', JSON.stringify(request.parameters), req);
                }
                res.send({ result: request.parameters.result.value, PartnerID: request.parameters.PartnerID.value });
                connection.close();
            })
        }
        else {
            request.execute('usp_Account_SaveDetail', function (err, recordsets) {
                if (err) {
                    Error.ErrorLog(err, 'usp_Account_SaveDetail', JSON.stringify(request.parameters), req);
                }
                res.send({ result: request.parameters.result.value, PartnerID: request.parameters.PartnerID.value });
                connection.close();
            })
        }
     
    });
});

router.post('/import/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));

    var jsonData = req.body;

    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(jsonData));
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LoginPartnerID', sql.Int, 4);
        request.output('result', sql.NVarChar(500));
        request.execute('usp_import_account', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_import_account", JSON.stringify(request.parameters), req);
            }
            console.dir(request.parameters.result.value);
            res.send({ result: request.parameters.result.value });
            connection.close();
        });
    });
});

router.post('/saveaddress/:deletedAddressId', function (req, res) {
    var deletedAddressId = req.params.deletedAddressId;
    var sqlupdate = "declare @AddressId int;";
    req.body.forEach(function (item) {
        if (item.AddressID > 0) {
            sqlupdate += "update Address Set Address1= '" + item.Address1 + "', Address2 = '" + item.Address2 + "', City = '" + item.City + "', StateID = " + item.StateID + ", ZipCode = '" + item.ZipCode + "', IsActive = " + ~~(item.IsActive) + ", ModifyBy=" + req.userlogininfo.UserID + ",ModifyDate=GETUTCDATE() " +
                         "Where AddressID= " + item.AddressID + "; update PartnerAddressMap set AddressTypeID =" + item.AddressTypeID + ", [Description] ='" + item.Description + "' Where AddressID= " + item.AddressID + " and PartnerID=" + item.PartnerID + "; ";
        }
        else {
            sqlupdate += "insert into Address(Address1, Address2, City, StateID, ZipCode, IsActive, CreatedBy, CreatedDate, ModifyBy, ModifyDate) " +
                "Values('" + item.Address1 + "', '" + item.Address2 + "', '" + item.City + "', " + item.StateID + ", '" + item.ZipCode + "', " + ~~(item.IsActive) + "," + req.userlogininfo.UserID + ",GETUTCDATE(), " + req.userlogininfo.UserID + ",GETUTCDATE()) " +
                "Select @AddressId = scope_identity(); " +
                "INSERT INTO PartnerAddressMap(PartnerID, AddressID, AddressTypeID, [Description]) values (" + item.PartnerID + ", @AddressId, " + item.AddressTypeID + ",'" + item.Description + "'); ";
        }
    });
    if (deletedAddressId != "0") {
        sqlupdate += "Delete From PartnerAddressMap Where AddressID in (" + deletedAddressId + "); " +
            "Delete From Address where AddressID in (" + deletedAddressId + "); ";
    }

    db.executeSql(req,sqlupdate, function (data, err) {
        if (err) {
            Error.ErrorLog(err, sqlupdate, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write({ data: 0 });
        }
        res.end();
    });
});

router.post('/postPartnerAddress/:deletedAddressId/:PartnerID', function (req, res) {
    var deletedAddressId = req.params.deletedAddressId;
    var sqlupdate = "declare @AddressId int;";
    req.body.forEach(function (item) {
        item.PartnerID = item.PartnerID == 0 ? req.params.PartnerID : item.PartnerID;
        if (item.AddressID > 0) {
            sqlupdate += "update Address Set Address1= '" + item.Address1 + "', Address2 = '" + item.Address2 + "', City = '" + item.City + "', StateID = " + item.StateID + ", CountryID = " + item.CountryID + ", ZipCode = '" + item.ZipCode + "', IsActive = " + ~~(item.IsActive) +
                " Where AddressID= " + item.AddressID + "; update PartnerAddressMap set AddressTypeID=" + item.AddressTypeID + ", Description='" + item.Description + "', ModifyBy=" + req.userlogininfo.UserID + ",ModifyDate=GETUTCDATE() Where AddressID= " + item.AddressID + " and PartnerID=" + item.PartnerID + "; ";
        }
        else {
            sqlupdate += "insert into Address(Address1, Address2, City, StateID, CountryID, ZipCode, IsActive, CreatedBy, CreatedDate, ModifyBy, ModifyDate) " +
                "Values('" + item.Address1 + "', '" + item.Address2 + "', '" + item.City + "', " + item.StateID + ", " + item.CountryID + ", '" + item.ZipCode + "', " + ~~(item.IsActive) + ", " + req.userlogininfo.UserID + ", GETUTCDATE()," + req.userlogininfo.UserID +",GETUTCDATE() ) " +
                "Select @AddressId = scope_identity(); " +
                "INSERT INTO PartnerAddressMap(PartnerID, AddressID, AddressTypeID, Description, CreatedBy, CreatedDate, ModifyBy, ModifyDate) values (" + item.PartnerID + ", @AddressId, 430,'" + item.Description + "'," + req.userlogininfo.UserID + ",GETUTCDATE(), " + req.userlogininfo.UserID + ",GETUTCDATE()); ";
        }
    });
    if (deletedAddressId != "0") {
        sqlupdate += "Delete From PartnerAddressMap Where AddressID in (" + deletedAddressId + "); " +
            "Delete From Address where AddressID in (" + deletedAddressId + "); ";
    }
    console.log(sqlupdate);
    db.executeSql(req, sqlupdate, function (data, err) {
        if (err) {
            Error.ErrorLog(err, sqlupdate, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {

            res.write({ data: 0 });
        }
        res.end();
    });
});

router.get('/:PartnerID/address/:AddressID/:loginPartnerID', function (req, res) {
    var addressid = req.params.AddressID;
    var partnerid = req.params.PartnerID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('PartnerID', sql.Int, partnerid);
        request.input('AddressID', sql.Int, addressid);
        request.input('languageid', sql.Int, req.userlogininfo.languageid);
        request.input('loginPartnerID', sql.Int, req.params.loginPartnerID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.execute('usp_Partner_Address', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_Partner_Address', JSON.stringify(request.parameters), req);
                res.write(JSON.stringify({ recordsets: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets});
            }
            res.end();
            connection.close();
        });
    });
});

router.get('/UserRole/:PartnerID', function (req, res) {
    var partnerid = req.params.PartnerID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('PartnerId', sql.Int, partnerid);
        request.execute('usp_Partner_UserRoleMapping', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_Partner_UserRoleMapping', JSON.stringify(request.parameters), req);
                res.write(JSON.stringify({ recordsets: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets[0] });
            }
            res.end();
            connection.close();
        });
    });
});

router.get('/ConfigMap/:PartnerID', function (req, res) {
    var partnerid = req.params.PartnerID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('PartnerId', sql.Int, partnerid);
        request.execute('usp_Partner_ConfigMap', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_Partner_ConfigMap', JSON.stringify(request.parameters), req);
                res.write(JSON.stringify({ recordsets: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets[0] });
            }
            res.end();
            connection.close();
        });
    });
});


router.get('/getAllPartner/:FacilityID', function (req, res) {
    db.executeSql(req, "Select PartnerID,PartnerCode, PartnerName, ContactName, ContactNumber, Email From Partners Where PartnerID not in (Select PartnerID from PartnerFacilityMap where FacilityID= "+ req.params.FacilityID+") and IsActive= 1", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "Select PartnerID,PartnerCode, PartnerName, ContactName, ContactNumber, Email From Partners Where PartnerID not in (Select PartnerID from PartnerFacilityMap where FacilityID= " + req.params.FacilityID + ") and IsActive= 1", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/ReasonRule/:PartnerID', function (req, res) {
    var partnerid = req.params.PartnerID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('PartnerId', sql.Int, partnerid);
        request.execute('usp_Partner_ReasonRuleMapping', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_Partner_ReasonRuleMapping", JSON.stringify(request.parameters), req);
                res.write(JSON.stringify({ recordsets: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets });
            }
            res.end();
            connection.close();
        });
    });
});


router.get('/getPartnerFacilityMap/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('PartnerID', sql.NVarChar(100), req.params.PartnerID);
        request.execute('GetFacilityByPartner', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetFacilityByPartner", JSON.stringify(request.parameters), req);
                res.write(JSON.stringify({ recordsets: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets });
            }
            res.end();
            connection.close();
        });
    });
});

router.get('/getPartnerByHub/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('PartnerID', sql.NVarChar(100), req.params.PartnerID);
        request.execute('GetPartnersByHub', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetPartnersByHub", JSON.stringify(request.parameters), req);
                res.write(JSON.stringify({ recordsets: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets });
            }
            res.end();
            connection.close();
        });
    });
});

module.exports = router;