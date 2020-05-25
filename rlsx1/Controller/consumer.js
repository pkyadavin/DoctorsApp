var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('mssql');
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
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.output('TotalCount', sql.Int);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.execute('GetConsumerWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetConsumerWithPaging', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            connection.close();
        })
    });
});

router.get('/:consumerId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ConsumerId', sql.Int, req.params.consumerId);
        request.execute('GetConsumerDetailsbyID', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetConsumerDetailsbyID', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets });
            connection.close();
        })
    });
});

router.get('/devices/:ID', function (req, res) {
    db.executeSql(req, `select DISTINCT UPPER(i.SerialNumber) AS Device, imo.ModelName, im.SKUCode, im.ItemNumber, i.*
		from ItemInfo i 	
		INNER JOIN ItemMaster im ON i.ItemMasterID = im.ItemMasterID    
		INNER JOIN ItemModel imo ON imo.ItemModelID = im.ItemModelID	
		INNER JOIN ItemCategory ic ON ic.ItemCategoryID = imo.ItemCategoryID
		INNER JOIN ItemMasterTypeMap itm ON itm.ItemMasterID = im.ItemMasterID
		INNER JOIN TypeLookUp it ON it.TypeLookUpID = itm.TypeLookUpID
		WHERE it.TypeCode ='ITY002' AND it.TypeGroup ='ItemMaster'
		AND i.ConsumerID = ${req.params.ID} AND i.isActive = 1 AND im.IsActive = 1 AND imo.IsActive = 1 AND ic.IsActive = 1 AND itm.IsActive = 1`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `select DISTINCT UPPER(i.SerialNumber) AS Device, imo.ModelName, im.SKUCode, im.ItemNumber, i.*
		from ItemInfo i 	
		INNER JOIN ItemMaster im ON i.ItemMasterID = im.ItemMasterID    
		INNER JOIN ItemModel imo ON imo.ItemModelID = im.ItemModelID	
		INNER JOIN ItemCategory ic ON ic.ItemCategoryID = imo.ItemCategoryID
		INNER JOIN ItemMasterTypeMap itm ON itm.ItemMasterID = im.ItemMasterID
		INNER JOIN TypeLookUp it ON it.TypeLookUpID = itm.TypeLookUpID
		WHERE it.TypeCode ='ITY002' AND it.TypeGroup ='ItemMaster'
		AND i.ConsumerID = ${req.params.ID} AND i.isActive = 1 AND im.IsActive = 1 AND imo.IsActive = 1 AND ic.IsActive = 1 AND itm.IsActive = 1`, "", req);
                res.send({ error: err });
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});

router.post('/:CustomerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.output('CustomerIdOutput', sql.Int);
        request.input('CustomerID', sql.Int, req.params.CustomerID);
        request.input("FirstName", sql.VarChar(50), req.body.FirstName);
        request.input("MiddleName", sql.VarChar(50), req.body.MiddleName);
        request.input("LastName", sql.VarChar(50), req.body.LastName);
        request.input("EmailID", sql.VarChar(200), req.body.EmailID);
        request.input("Phone", sql.VarChar(50), req.body.Phone);
        request.input("Fax", sql.VarChar(50), req.body.Fax);
        request.input("MobileNumber", sql.VarChar(50), req.body.MobileNumber);
        request.input("ContactPerson", sql.VarChar(100), req.body.ContactPerson);
        request.input("ContactPhoneNumber", sql.VarChar(50), req.body.ContactPhoneNumber);
        request.input('CustomerLevelID', sql.Int, req.body.CustomerLevelID);
        request.input('PrefferedDeliveryMethodID', sql.Int, req.body.PrefferedDeliveryMethodID);
        request.input('ContactMethodID', sql.Int, req.body.ContactMethodID);
        request.input("IsActive", sql.Int, ~~(req.body.IsActive));
        request.input('CreatedBy', sql.Int, req.body.CreatedBy);
        request.input('ModifyBy', sql.Int, req.body.ModifyBy);
        request.input("Address1", sql.VarChar(50), req.body.Address1);
        request.input("Address2", sql.VarChar(50), req.body.Address2);
        request.input("City", sql.VarChar(50), req.body.City);
        request.input("ZipCode", sql.VarChar(50), req.body.ZipCode);
        request.input("Landmark", sql.VarChar(50), req.body.Landmark);
        request.input('StateID', sql.Int, req.body.StateID);
        request.input('AddressID', sql.Int, req.body.AddressID);
        request.execute('InsertUpdateConsumer', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'InsertUpdateConsumer', JSON.stringify(request.parameters), req);
                res.send({ recordsets: recordsets, CustomerID: request.parameters.CustomerIdOutput.value });
                console.dir(recordsets);
                console.dir(request.parameters.CustomerIdOutput.value);
                connection.close();
            }
            else {
                res.send({ recordsets: recordsets, CustomerID: request.parameters.CustomerIdOutput.value });
            }
        });
    });
});

router.post('/postConsumerAddress/:deletedAddressId/:CustomerID', function (req, res) {
    var deletedAddressId = req.params.deletedAddressId;
    var sqlupdate = "declare @AddressId int;";
    req.body.forEach(function (item) {
        item.CustomerID = item.CustomerID == 0 ? req.params.CustomerID : item.CustomerID;
        if (item.AddressID > 0) {
            sqlupdate += "update [Address] Set Address1= '" + item.Address1 + "', Address2 = '" + item.Address2 + "', City = '" + item.City + "', StateID = " + item.StateID + ", ZipCode = " + item.ZipCode + ", IsActive = " + ~~(item.IsActive) +
                " Where AddressID= " + item.AddressID + "; update CustomerAddressMap set AddressTypeID=" + item.AddressTypeID + ", Description='" + item.Description + "', ModifyBy=" + item.ModifyByID + ",ModifyDate=GETUTCDATE() Where AddressID= " + item.AddressID + " and CustomerID=" + item.CustomerID + "; ";
        }
        else {
            sqlupdate += "insert into Address(Address1, Address2, City, StateID, ZipCode, IsActive) " +
                "Values('" + item.Address1 + "', '" + item.Address2 + "', '" + item.City + "', " + item.StateID + ", " + item.ZipCode + ", " + ~~(item.IsActive) + ") " +
                "Select @AddressId = scope_identity(); " +
                "INSERT INTO CustomerAddressMap(CustomerID, AddressID, AddressTypeID, Description, CreatedBy, CreatedDate, ModifyBy, ModifyDate) values (" + item.CustomerID + ", @AddressId, " + item.AddressTypeID + ",'" + item.Description + "'," + item.CreatedByID + ",'" + item.CreatedDate + "', " + item.ModifyByID + ",'" + item.ModifyDate + "'); ";
        }
    });
    if (deletedAddressId != "0") {
        sqlupdate += "Delete From CustomerAddressMap Where AddressID in (" + deletedAddressId + "); " +
            "Delete From Address where AddressID in (" + deletedAddressId + "); ";
    }

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

router.delete('/:CustomerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('CustomerID', sql.Int, req.params.CustomerID);
        request.output('TotalCount', sql.Int);
        request.execute('deleteCustomer', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'deleteCustomer', '', req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
            connection.close();
        })
    });
});

module.exports = router;
