var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var db = require('../shared/DBAccess');
var helper = require('../UtilityLib/BlobHelper');
var multer = require('multer');
var upload = multer({ dest: '../Uploads/' })
var Error = require('../shared/ErrorLog');

router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID/:Scope/:userGridType', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        debugger;
        console.log(req.params);
        console.log(req.userlogininfo);

        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input('languageid', sql.Int, req.userlogininfo.languageid);
        request.input('userType', sql.VarChar(50), req.userlogininfo.UserType);
        request.input('UserId', sql.Int, req.userlogininfo.UserID);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.input("Scope", sql.VarChar(50), req.params.Scope);
        request.input("userGridType", sql.VarChar(50), req.params.userGridType);
        request.output('TotalCount', sql.Int);
        request.output('access_rights', sql.NVarChar(sql.MAX));
        request.execute('usp_User_GetAll', function (err, recordsets, returnValue) {
            console.log(req.userlogininfo.UserType);
            connection.close();
            if (err) {
                Error.ErrorLog(err, "usp_User_GetAll", JSON.stringify(request.parameters), req);
                res.status(400).send({ error: err });
            }
            else{
                res.status(200).send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value, access_rights: request.parameters.access_rights.value });
            }
        })
    });
});

router.post('/resetpassword', function (req, res) {    
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('userId', sql.Int, req.userlogininfo.UserID);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_User_ChangePassword', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'usp_User_ChangePassword', JSON.stringify(request.parameters), req);
                res.send({ success: false, message: "Error Occured: " + err });
            }
            else {
                res.send({ success: true, message: request.parameters.result.value });
            }
            connection.close();
        })
    });
});
router.get('/:userid', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('UserId', sql.Int, req.params.userid);
        request.output('access_rights', sql.NVarChar(sql.MAX));
        request.execute('usp_User_GetById', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_User_GetById", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, access_rights: request.parameters.access_rights.value });
            console.dir(recordsets);
            connection.close();
        })
    });
});

router.delete('/:userid', function (req, res) {
    var userid = req.params.userid;
    db.executeSql(req,'delete from  [Users] where UserID=' + userid, function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'delete from  [Users] where UserID=' + userid, "", req);
            res.send({ error: err });
        }
        else {   
            res.writeHead(200, { "Content-Type": "application/json" });         
            res.write(JSON.stringify({ data: 'deleted' }));
        }        
        res.end();
    });
});

var cpUpload = upload.fields([{ name: 'UserImage', maxCount: 1 }])
router.post('/UpdateUser', cpUpload, function (req, res) {
  
    var savetodb = function () {
        req.body.UserRoles = JSON.parse(req.body.UserRoles);
        var connection = new sql.Connection(settings.DBconfig(req));
        connection.connect().then(function () {
            var request = new sql.Request(connection);
            request.input('Alldata', sql.NVarChar(5000), JSON.stringify(req.body));
            request.input('loggedInUserId', sql.Int, req.userlogininfo.UserID);
            request.input('ImageUrl', sql.NVarChar(500), req.ImageUrl);
            request.output('result', sql.NVarChar(5000));

            request.execute('usp_User_SaveDetail', function (err, recordsets, returnValue) {
                if (err) {
                    Error.ErrorLog(err, "usp_User_SaveDetail", JSON.stringify(request.parameters), req);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.write(JSON.stringify({ success: false, message: "Error Occured: " + err }));
                    res.end;
                }
                else {
                    res.send({ result: request.parameters.result.value });
                    console.dir(request.parameters.result.value);
                }
            })
        });
    }

    if (req.files['UserImage'] != undefined) {
        helper.uploadFile('consumer-files', req.files['UserImage'][0], function (error, result) {
            if (error) {
                req.ImageUrl = '';
                console.dir("Error Occured: " + err);
            }
            else {
                req.ImageUrl = result;
                savetodb();
            }
        });
    }
    else {
        req.ImageUrl = '';
        savetodb();
    }
});

var uUpload = upload.fields([{ name: 'userimage', maxCount: 1 }])
router.post('/profileimage', uUpload, function (req, res) {
    console.log(req);    
    helper.uploadFile('consumer-files', req.files['userimage'][0], function (error1, result1) {
        if (!error1) {
            var output = { result: 'Success', FileUrl: result1 };
            res.send(JSON.stringify(output));
        }
        else {
            res.send({ error: err });
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
        request.execute('usp_import_users', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_import_users", JSON.stringify(request.parameters), req);
            }
            console.dir(request.parameters.result.value);
            res.send({ result: request.parameters.result.value });
            connection.close();
        });
    });
});

router.put('/changePassword/:userId', function (req, res) {
    var userId = req.params.userId;
    console.log(JSON.stringify(req.body));
    console.log(userId);
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('userId', sql.Int, userId);
        request.input('Alldata', sql.VarChar(5000), JSON.stringify(req.body));
        request.output('result', sql.VarChar(5000));
        request.execute('usp_User_ChangePassword', function (err, recordsets) {
            Error.ErrorLog(err, "usp_User_ChangePassword", JSON.stringify(request.parameters), req);
            res.send({ result: request.parameters.result.value });
            connection.close();
        })
    });
});

router.post('/updateUserTheme/:UserID', function (req, res) {
    userId = req.params.UserID;
    db.executeSql(req, "update users set UserTheme= '" + req.body.UserTheme + "' ",
        function (data, err) {
            if (err) {
                Error.ErrorLog(err, "update users set UserTheme= '" + req.body.UserTheme + "' Where userID=" + userId, "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.write(1);
            }
            res.end();
        });
});


router.get('/AllCountry/:userId', function (req, res) {
    db.executeSql(req,`SELECT CountryID, CountryCode, CountryName, RegionName,
    CurrencyCode,
    CurrencySymbol,
    DollarExchangeRate,
    TeleCode,
    RegionID
    FROM Country WHERE IsActive = 1 Order by CountryName`, function (data, err) {
        if (err) {
            Error.ErrorLog(err, `SELECT CountryID, CountryCode, CountryName, RegionName,
            CurrencyCode,
            CurrencySymbol,
            DollarExchangeRate,
            TeleCode,
            RegionID
            FROM Country WHERE IsActive = 1 Order by CountryName`, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/AllState/:countryId', function (req, res) {
    var countryId = req.params.countryId;
    var sqlQuery;
    if (countryId == 0) {
        sqlQuery = "select StateID,StateName from State where CountryId = 0";
    }
    else {
        sqlQuery = "select StateID,StateName from State where CountryId=" + countryId;
    }

    db.executeSql(req,sqlQuery, function (data, err) {
        if (err) {
            Error.ErrorLog(err, sqlQuery, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/AllCity/:stateId', function (req, res) {
    var stateId = req.params.stateId;
    var sqlQuery;
    if (stateId == 0) {
        sqlQuery = "select CityID,Name as City from City where StateId = 0";
    }
    else {
        sqlQuery = "select CityID,Name as City from City where StateId = " + stateId;
    }

    db.executeSql(req,sqlQuery, function (data, err) {
        if (err) {
            Error.ErrorLog(err, sqlQuery, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/AllRole/:userId', function (req, res) {
    var userId = req.params.userId;
    db.executeSql(req,"select r.RoleID, r.RoleName from RoleType r left join UserInRole u on u.RoleTypeID = r.RoleID and u.UserID=" + userId + " where u.UserInRolesID is null ", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "select r.RoleID, r.RoleName from RoleType r left join UserInRole u on u.RoleTypeID = r.RoleID and u.UserID=" + userId + " where u.UserInRolesID is null ", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/SelectedUserRoles/:userId', function (req, res) {
    var userId = req.params.userId;
    db.executeSql(req,"select RoleID, RoleName from UserInRole ur left join RoleType rt on rt.RoleID = ur.RoleTypeID where UserID="+userId, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "select RoleID, RoleName from UserInRole ur left join RoleType rt on rt.RoleID = ur.RoleTypeID where UserID=" + userId, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/AllPartner/:userId', function (req, res) {
    var userId = req.params.userId;
    db.executeSql(req, "select a.PartnerID, a.PartnerName from Partners a left join PartnerUserMap u on u.PartnerID = a.PartnerID and u.UserID=" + userId +" where a.PartnerTypeID in (select TypeLookUpID from TypeLookUp where TypeCode = 'PTR001' and u.PartnerUserMapID is null", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "select a.PartnerID, a.PartnerName from Partners a left join PartnerUserMap u on u.PartnerID = a.PartnerID and u.UserID=" + userId + " where a.PartnerTypeID in (select TypeLookUpID from TypeLookUp where TypeCode = 'PTR001' and u.PartnerUserMapID is null", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/SelectedUserPartners/:userId', function (req, res) {
    var userId = req.params.userId;
    db.executeSql(req,"select ur.PartnerID, rt.PartnerName from PartnerUserMap ur left join Partners rt on rt.PartnerID = ur.PartnerID where rt.PartnerTypeID in (select TypeLookUpID from TypeLookUp where TypeCode = 'PTR001' and ur.UserID=" + userId, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "select ur.PartnerID, rt.PartnerName from PartnerUserMap ur left join Partners rt on rt.PartnerID = ur.PartnerID where rt.PartnerTypeID in (select TypeLookUpID from TypeLookUp where TypeCode = 'PTR001' and ur.UserID=" + userId, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/UserRole/:UserID', function (req, res) {
    var UserID = req.params.UserID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('UserID', sql.Int, UserID);
        request.execute('usp_User_PartnerRoleMapping', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_User_PartnerRoleMapping", JSON.stringify(request.parameters), req);
                res.write(JSON.stringify({ recordsets: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
            res.end();
        });
    });
});
module.exports = router;