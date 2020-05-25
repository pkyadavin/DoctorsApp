var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');

router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.output('TotalCount', sql.Int);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.input('LanguageID', sql.Int, req.userlogininfo.languageid);
        request.output('access_rights', sql.NVarChar(sql.MAX));
        request.execute('usp_getB2BUser', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_getB2BUser', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value, access_rights: request.parameters.access_rights.value });
            }
            connection.close();
        })
    });
});

router.get('/getRegions', function (req, res) {
    db.executeSql(req, 'select RegionID,RegionName from Region ', function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'select RegionID,RegionName from Region ', "", req);
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

router.post('/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {

        var request = new sql.Request(connection);
        request.input('userID', sql.Int, req.body.UserID);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.VarChar(20));
        request.execute('usp_SaveB2BUser', function (err, recordsets, returnValue) {
            if (err) {
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

router.post('/Update', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {

        var request = new sql.Request(connection);
        request.input('userID', sql.Int, req.body.UserID);
        request.input('JsonData', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.VarChar(20));
        request.execute('usp_Update_B2BUser', function (err, recordsets, returnValue) {// old sp : [usp_UpdateB2BUser]
            if (err) {
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


router.delete('/Remove/:ID', function (req, res) {
    var id = req.params.ID;

    db.executeSql(req, 'delete from Grade where GradeId =' + id, function (err, data) {
        if (err) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ data: "Deleted" }));//request.parameters.rid.value
        }
        res.end();
    })
});
router.get('/getCountryServiceType', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.execute('usp_countryServiceType', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_countryServiceType', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: recordsets}));
            }
            res.end();
            connection.close() ;
        })
    });
});

router.get('/getSelectedCountryStateCity/:BillCountry/:ShipCountry/:BillState/:ShipState', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('BillCountry', sql.Int, req.params.BillCountry);
        request.input('ShipCountry', sql.Int, req.params.ShipCountry);
        request.input("BillState", sql.Int, req.params.BillState);
        request.input("ShipState", sql.Int, req.params.ShipState);
        request.execute('usp_GetSelectedCountryStateCity', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_countryServiceType', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: recordsets}));
            }
            res.end();
            connection.close() ;
        })
    });
});
router.get('/getCountry', function (req, res) {
    db.executeSql(req, 'select countryid id,countrycode code,countryname [name] from country where isactive=1', function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'select countryid id,countrycode code,countryname [name] from country where isactive=1', "", req);
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

router.get('/getStateByID/:countryid', function (req, res) {
    var countryid = req.params.countryid;
    db.executeSql(req, 'select stateid id,statecode code,statename [name] from state where countryid='+countryid+' and isactive=1', function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'select stateid id,statecode code,statename [name] from state where countryid='+countryid+' and isactive=1', "", req);
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
router.get('/getCityByID/:countryid/:stateid', function (req, res) {
    var countryid = req.params.countryid;
    var stateid=req.params.stateid;
    db.executeSql(req, 'select cityid id,citycode code,cityname [name] from city where stateid='+stateid+' and countryid='+countryid+' and isactive=1', function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'select cityid id,citycode code,cityname [name] from city where stateid='+stateid+' and countryid='+countryid+' and isactive=1', "", req);
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
router.get('/getServiceType', function (req, res) {
    var typegrp = 'RMA Type';
    db.executeSql(req, 'select typelookupid id,typecode code,typename [name] from typelookup where TypeGroup='+typegrp+' and isactive=1', function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'select typelookupid id,typecode code,typename [name] from typelookup where TypeGroup='+typegrp+' and isactive=1', "", req);
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
module.exports = router;