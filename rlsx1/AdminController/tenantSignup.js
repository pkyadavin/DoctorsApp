var express = require('express');
var router = express.Router();
var sql = require('mssql');
var AdminDBConfig = require('../shared/Settings');
var AdminDB = require('../shared/DBAccess');
var helper = require('../UtilityLib/BlobHelper');
var multer = require('multer');
var upload = multer({ dest: '../Uploads/' })
var Error = require('../shared/ErrorLog');


//For tab 1 
router.get('/countries', function (req, res) {
    AdminDB.executeAdminSql('Select CountryID,CountryCode,CountryName, CurrencyCode,TeleCode from Country order by CountryName ', function (data, err) {
        if (err) {
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
//fro tab 1
router.get('/domains', function (req, res) {
    AdminDB.executeAdminSql(`Select TenantID, ISNULL(Domain, '') as Domain, ISNULL(CPDomain, '') as CPDomain FROM Tenant
                            INNER JOIN TypeLookUp ON TypeLookUpID = Tenant.StatusID
                            where TypeLookUp.TypeCode NOT IN ('TS005')`, function (data, err) {
        if (err) {
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
//For tab 1
router.get('/states/:id', function (req, res) {
    var id = req.params.id;
    AdminDB.executeAdminSql('select StateID,StateName,CountryID from State where CountryID=' + id + ' order by StateName asc', function (data, err) {
        if (err) {
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
//For tab 2
router.get('/typelookup', function (req, res) {
    var typelookup = req.params.typegroup;
    AdminDB.executeAdminSql('select TypeLookupID,TypeName from typelookup where typegroup=\'itemmaster\' and IsActive=1', function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});
//For heading
router.get('/headerNameDescList', function (req, res) {
    AdminDB.executeAdminSql('Select AdminConfigSetupID,SectionCode,SectionKey,SectionKeyValue,SortOrder From  AdminConfigSetup', function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

//For tab 3
router.get('/orderListSubHeading', function (req, res) {
    AdminDB.executeAdminSql('SELECT ParentOrderListID,OrderName FROM orderlist WHERE ParentOrderListID IN (SELECT OrderListID FROM orderlist)  and IsActive = 1 ', function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});
//For tab 3
router.get('/orderListHeading', function (req, res) {
    var typelookup = req.params.typegroup;
    AdminDB.executeAdminSql('SELECT OrderListID, OrderName, OrderListCode FROM orderlist WHERE ParentOrderListID IS NULL', function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});


//for step 4
router.get('/getAllCurrency', function (req, res) {
    AdminDB.executeAdminSql(`SELECT CurrencyID, CurrencyCode, isnull(CurrencyName, '') as CurrencyName, isnull(Country, '') as Country From Currency Order By CurrencyName, Country `, function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/getbyid/:tenantID', function (req, res) {
    var TenantID = req.params.tenantID;
    AdminDB.executeAdminSql(`select Tenant.TenantID, TenantName, TenantCode, upper(ClaimType) ClaimType, EmailId, ValidFrom, ValidTo, NoofUsers, Domain, CPDomain, XMLData, CreatedBy, 
            Tenant.CreatedDate, Tenant.ModifiedBy, Tenant.ModifiedDate, isnull(LogoUrl,'') as LogoUrl
            , DBServer, DBUserName, DBPassword, DBServerName, isActive, CurrencyID,IsCallCenterSupport, FeatureIDs, Comment, Mobile,UpdatedFeatureIDs, FTP, FTPUser
            , FTPPassword,ISNULL(IsInvoiceGeneration,0) AS IsInvoiceGeneration, isnull(IsActivated,0) as IsActivated, D.Status from  Tenant left outer join DBProvisioningLog D on Tenant.TenantID = D.TenantID where Tenant.TenantID= ${TenantID} `, function (data, err) {
            if (err) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {                
                var tenantData = data;
                var to_json = require('xmljson').to_json;
                to_json(tenantData[0].XMLData, function (error, result) {
                    tenantData[0]['jsondata'] = result;
                    tenantData[0]['tenantFTP'] = { FTP: tenantData[0].FTP, FTPUser: tenantData[0].FTPUser, FTPPassword: tenantData[0].FTPPassword, UpdateToCustomer: false };
                   
                });

                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(tenantData));

            }
            res.end();


        });
});

router.get('/getCurrencyById/:CurrencyId', function (req, res) {
    currencyid = req.params.CurrencyId;
    AdminDB.executeAdminSql('SELECT CurrencyID,CurrencyCode,CurrencyName,Country From Currency where CurrencyID=' + currencyid, function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

//for tab4 timezone
router.get('/getAllTimeZone', function (req, res) {

    AdminDB.executeAdminSql('Select TimeZoneId,TimeZoneName,TimeZoneDescription From TimeZone', function (data, err) {
        if (err) {
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

router.get('/getTimeZoneById/:TimeZoneId', function (req, res) {
    timeZoneId = req.params.TimeZoneId;
    AdminDB.executeAdminSql('Select TimeZoneId,TimeZoneName,TimeZoneDescription From TimeZone where TimeZoneId=' + timeZoneId, function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }

        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});


//for tab4 language
router.get('/getAllLanguage', function (req, res) {

    AdminDB.executeAdminSql('Select LanguageID,Name,Code,IsActive From Language where IsActive=1', function (data, err) {
        if (err) {
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

//For tab 5
router.get('/facilitytype', function (req, res) {
    var typelookup = req.params.typegroup;
    AdminDB.executeAdminSql('Select TypeLookUpID as id,TypeCode,TypeName,Description,SortOrder From TypeLookUp where TypeGroup=\'FacilityType\' AND IsActive=1', function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});


//For tab 6
router.get('/partnertype', function (req, res) {
    var typelookup = req.params.typegroup;
    AdminDB.executeAdminSql('Select TypeLookUpID as id,TypeCode,TypeName,Description,SortOrder From TypeLookUp where TypeGroup=\'PartnerType\' AND IsActive=1', function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

//remove

router.get('/AvailableRMATab', function (req, res) {
    AdminDB.executeAdminSql('Select TypeLookUpID,TypeCode,TypeName,Description,SortOrder From TypeLookUp where TypeGroup=\'FacilityType\' AND IsActive=1', function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});





//For tab 6
router.get('/nodes', function (req, res) {
    AdminDB.executeAdminSql('Select NodeID as id,Node,Description,IsActive from Node where IsActive=1', function (data, err) {
        if (err) {
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

//For tab 8

router.get('/itemStatus', function (req, res) {
    var typelookup = req.params.typegroup;
    AdminDB.executeAdminSql('Select TypeLookUpID as id,TypeCode,TypeName,Description,SortOrder From TypeLookUp where TypeGroup=\'ItemStatus\' AND IsActive=1', function (data, err) {
        if (err) {
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

//For tab 10

router.get('/actionsGroupBySystem', function (req, res) {
    AdminDB.executeAdminSql('SELECT ActionID,ActionCode,ActionName,ActionsGroup,Description,SortOrder,IsActive From Actions WHERE ActionsGroup =\'System\' AND IsActive=1', function (data, err) {
        if (err) {
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




//For tab 10
router.get('/actionsGroupByOutTask', function (req, res) {
    AdminDB.executeAdminSql('SELECT * FROM (SELECT ActionID, ActionCode, ActionName, ActionsGroup, Description, SortOrder, IsActive From Actions WHERE ActionsGroup = \'OutTask\'and IsActive= 1 ) h order by h.SortOrder', function (data, err) {
        if (err) {
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
//For tab 10

router.get('/actionsGroupByInTask', function (req, res) {
    AdminDB.executeAdminSql('SELECT * FROM (SELECT ActionID, ActionCode, ActionName, ActionsGroup, Description, SortOrder, IsActive From Actions WHERE ActionsGroup = \'InTask\'and IsActive= 1 ) h order by h.SortOrder', function (data, err) {
        if (err) {
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

//For tab 10

router.get('/ValidateEmail/:email', function (req, res) {
    AdminDB.executeAdminSql(`select top 1 isnull(email,'') emailid 
                            from Tenant inner join users on users.TenantID = Tenant.TenantID
                            where emailid = '${req.params.email}' or email = '${req.params.email}'`, function (data, err) {
        if (err) {
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


router.get('/getproductFeatures/:TenantID', function (req, res) {
    AdminDB.executeAdminSql(`select *, case when dbo.fn_CheckFeature(FeatureCode, ${req.params.TenantID}) = 0 then 0 else 1 end  IsSelected, [dbo].[fn_CheckUpdatedFeature](FeatureCode, ${req.params.TenantID}) AS 'UpdatedFeatures' 
                            from ProductFeature order by sortorder`, function (data, err) {
            if (err) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.write(JSON.stringify(data));

            }
            res.end();


        });
});

router.get('/getTypeLookUpByName/:typegroup', function (req, res) {

    var connection = new sql.Connection(AdminDBConfig.AdminConfig);
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

router.post('/tenantlogin', function (req, res) {
    var connection = new sql.Connection(AdminDBConfig.AdminConfig);
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('username', sql.NVarChar(100), req.body.username);
        request.input('password', sql.NVarChar(500), req.body.password);
        request.execute('usp_tenantLogin', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_tenantLogin", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ data: recordsets });
            }
            connection.close();
        })
    });
});

router.post('/checkcompanyexists', function (req, res) {
    var connection = new sql.Connection(AdminDBConfig.AdminConfig);
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('companyname', sql.NVarChar(100), req.body.companyname);
        request.execute('usp_IsCompanyExists', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_IsCompanyExists", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ data: recordsets });
            }
            connection.close();
        })
    });
});

router.post('/forgotpassword', function (req, res) {
    var connection = new sql.Connection(AdminDBConfig.AdminConfig);
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('email', sql.NVarChar(100), req.body.email);
        request.execute('usp_tenantForgotPassword', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_tenantForgotPassword", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ data: recordsets });
            }
            connection.close();
        })
    });
});

router.post('/tenantverify', function (req, res) {
    var connection = new sql.Connection(AdminDBConfig.AdminConfig);
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('email', sql.NVarChar(100), req.body.email);
        request.input('otp', sql.NVarChar(100), req.body.otp);
        request.input('mobileotp', sql.NVarChar(100), req.body.mobileotp);
        
        request.execute('usp_tenantVerify', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_tenantLogin", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ data: recordsets });
            }
            connection.close();
        })
    });
});

router.post('/tenantresendverify', function (req, res) {
    var connection = new sql.Connection(AdminDBConfig.AdminConfig);
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('email', sql.NVarChar(100), req.body.email);
        request.execute('usp_tenantResendVerify', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_tenantResendVerify", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ data: recordsets });
            }
            connection.close();
        })
    });
});
router.post('/checktenantverify', function (req, res) { 
    var connection = new sql.Connection(AdminDBConfig.AdminConfig);
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('email', sql.NVarChar(100), req.body.email);
        request.execute('usp_chktenantVerify', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_chktenantVerify", JSON.stringify(request.parameters), req);
                res.send({ error: err });
            }
            else {
                res.send({ data: recordsets });
            }
            connection.close();
        })
    });
});
var cpUpload = upload.fields([{ name: 'LogoImage', maxCount: 1 }])
router.post('/', cpUpload, function (req, res) {
   
    var savetodb = function () {
        req.body.registrationsteps = JSON.parse(req.body.registrationsteps);
        var connection = new sql.Connection(AdminDBConfig.AdminConfig);
        connection.connect().then(function () {
            var request = new sql.Request(connection);
            request.input('Tenant', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
            request.input('LogoUrl', sql.NVarChar(500), req.LogoUrl);
            request.output('result', sql.VarChar(20));
            request.execute('usp_Tenant_SaveDetail', function (err, recordsets, returnValue) {
                if (err) {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.write(JSON.stringify({ data: "Error Occured: " + err }));
                }
                else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.write(JSON.stringify({ data: request.parameters.result.value }));
                }
                res.end();
            })
        });
    }

    if (req.files['LogoImage'] != undefined) {
        helper.uploadFile('consumer-files', req.files['LogoImage'][0], function (error, result) {
            if (!error) {
                req.LogoUrl = result;
                savetodb();
            }
        });
    }
    else {
        req.LogoUrl = '';
        savetodb();
    }
});




module.exports = router;