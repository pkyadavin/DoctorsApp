var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('mssql');
var db = require('../shared/DBAccess');
var Error = require('../shared/ErrorLog');
router.get('/:AddressID', function (req, res) {
    var addressid = req.params.AddressID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
            var request = new sql.Request(connection);
            request.input('AddressID', sql.Int, addressid);
            request.execute('GetAddressByID', function (err, recordsets, returnValue) {
                if (err) {
                    Error.ErrorLog(err, "GetAddressByID", JSON.stringify(request.parameters), req);
                    //res.write(JSON.stringify({ recordsets: "Error Occured: " + err }));
                }
                else {
                    res.write(JSON.stringify(recordsets[0]));
                }
                connection.close();
                res.end();
            });
        });
});


router.get('/addressType/:TypeGroup', function (req, res) {
    var typeGroup = req.params.TypeGroup;
    db.executeSql(req,"Select TypeLookUpId, TypeName from TypeLookUp Where TypeGroup='" + typeGroup + "'", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "Select TypeLookUpId, TypeName from TypeLookUp Where TypeGroup='" + typeGroup + "'", "", req);
           // res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/addressColumn/:FormName', function (req, res) {
    var formName = req.params.FormName;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
            var request = new sql.Request(connection);
            request.input('formName', sql.VarChar(100), formName);
            request.execute('GetColumnByFormName', function (err, recordsets, returnValue) {
                if (err) {
                    Error.ErrorLog(err, "GetColumnByFormName", JSON.stringify(request.parameters), req);
                }
                else {
                    res.send({ recordsets: recordsets  });                    
                }
                connection.close();
                res.end();
            });
        });
});

router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:MapTableName/:MapTableColumn/:MapColumnValue', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("MapTableName", sql.VarChar(200), req.params.MapTableName); 
        request.input("MapTableColumn", sql.VarChar(20), req.params.MapTableColumn);
        request.input("MapColumnValue", sql.VarChar(20), req.params.MapColumnValue);
        request.output('TotalCount', sql.Int);
        request.execute('GetAddressWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "GetAddressWithPaging", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
        })
    });
});

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('address', sql.NVarChar(sql.MAX), req.body[0].address);
        request.input('cusid', sql.Int, req.body[0].cusid);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        var actionSP = "usp_CustomerAddress_post";
        request.execute(actionSP, function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, actionSP, JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                //res.writeHead(200, { "Content-Type": "application/json" });
                res.send({ });
            }
            connection.close();
        })
    });
});

module.exports = router;