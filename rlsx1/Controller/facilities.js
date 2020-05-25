var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
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
        request.execute('GetFacilitiesWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetFacilitiesWithPaging', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            connection.close();
        })
    });
});

router.get('/loadbyID/:FacilityID/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('FacilityID', sql.Int, req.params.FacilityID);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.output('TotalCount', sql.Int);
        request.execute('GetFacilityByFacilityID', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetFacilityByFacilityID', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            }
            connection.close();
        });
    });
});

router.get('/', function (req, res) {
    db.executeSql(req,"SELECT TypeLookUpID, TypeName FROM TypeLookUp WHERE TypeGroup ='FacilityType'", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT TypeLookUpID, TypeName FROM TypeLookUp WHERE TypeGroup ='FacilityType'", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/getPartnerFacilityMap/:FacilityID', function (req, res) {
    db.executeSql(req, "Select PartnerID,PartnerCode,PartnerName,ContactName,ContactNumber From Partners Where IsActive=1 and PartnerID in (Select PartnerID From PartnerFacilityMap where FacilityID= " + req.params.FacilityID+")", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "Select PartnerID,PartnerCode,PartnerName,ContactName,ContactNumber From Partners Where IsActive=1 and PartnerID in (Select PartnerID From PartnerFacilityMap where FacilityID= " + req.params.FacilityID + ")", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});


router.post('/:FacilityID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.output('FacilityIdOutput', sql.Int);
        request.input('FacilityID', sql.Int, req.params.FacilityID);
        request.input("FacilityCode", sql.VarChar(20), req.body.FacilityCode);
        request.input("FacilityName", sql.VarChar(100), req.body.FacilityName);
        request.input('FacilityTypeID', sql.Int, req.body.FacilityTypeID);
        request.input("IsActive", sql.Int, ~~(req.body.IsActive));
        request.input('CreatedBy', sql.Int, req.body.CreatedBy);
        request.input('ModifyBy', sql.Int, req.body.ModifyBy);
        request.input('PartnerMap', sql.NVarChar(sql.MAX), req.body.PartnerMaps[0].PartnerMaps);
        
        request.execute('InsertUpdateFacility', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'InsertUpdateFacility', JSON.stringify(request.parameters), req);
                res.send({ recordsets: recordsets, FacilityId: request.parameters.FacilityIdOutput.value });
                console.dir(recordsets);
                console.dir(request.parameters.FacilityIdOutput.value);
            }
            else {
                res.send({ recordsets: recordsets, FacilityId: request.parameters.FacilityIdOutput.value });
            }
            connection.close();
        });
    });
});

router.post('/postFacilitiesAddress/:deletedAddressId/:FacilityId', function (req, res) {
    var deletedAddressId = req.params.deletedAddressId;
    var sqlupdate = "declare @AddressId int;";
    req.body.forEach(function (item) {
        item.FacilityID=item.FacilityID == 0 ? req.params.FacilityId : item.FacilityID;
        if (item.AddressID > 0) {
            sqlupdate += "update [Address] Set Address1= '" + item.Address1 + "', Address2 = '" + item.Address2 + "', City = '" + item.City + "', StateID = " + item.StateID + ", ZipCode = " + item.ZipCode + ", IsActive = " + ~~(item.IsActive) +
                " Where AddressID= " + item.AddressID + "; update FacilityAddressMap set ModifyBy=" + item.ModifyByID + ",ModifyDate='" + item.ModifyDate + "' Where AddressID= " + item.AddressID + " and FacilityID=" + item.FacilityID +"; ";
        }
        else {
            sqlupdate += "insert into Address(Address1, Address2, City, StateID, ZipCode, IsActive) " +
                "Values('" + item.Address1 + "', '" + item.Address2 + "', '" + item.City + "', " + item.StateID + ", " + item.ZipCode + ", " + ~~(item.IsActive) + ") " +
                "Select @AddressId = scope_identity(); " +
                "INSERT INTO FacilityAddressMap(FacilityID, AddressID, AddressTypeID, Description, CreatedBy, CreatedDate, ModifyBy, ModifyDate) values (" + item.FacilityID + ", @AddressId, " + item.AddressTypeID + ",'" + item.Description + "'," + item.CreatedByID + ",'" + item.CreatedDate + "', " + item.ModifyByID + ",'" + item.ModifyDate + "'); ";
        }
    });
    if (deletedAddressId != "0") {
        sqlupdate += "Delete From FacilityAddressMap Where AddressID in (" + deletedAddressId + "); "+
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

router.get('/getFacilitiesForModal/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.output('TotalCount', sql.Int);
        request.execute('usp_GetFacilities', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_GetFacilities', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            connection.close();
        })
    });
});


module.exports = router;