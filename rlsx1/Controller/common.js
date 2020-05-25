var express = require('express');
var router = express.Router();
var settings = require('../shared/Settings');
/* GET users listing. */
var sql = require('mssql');
var Error = require('../shared/ErrorLog');
var db = require('../shared/DBAccess');
var helper = require('../UtilityLib/BlobHelper');
var multer = require('multer');
var upload = multer({ dest: '../Uploads/' })

router.get('/lookup/:email', function (req, res) {
    db.executeSql(req, `SELECT Email FROM Users Where Email = '${req.params.email}' AND IsActive = 1`, function (data, err) {
        if (err) {
            Error.ErrorLog(err, `SELECT Email FROM Users Where Email = '${req.params.email}' AND IsActive = 1`, JSON.stringify(request.parameters), req);
            res.status(400).send({ error: err });
        }
        else {
            res.status(200).send({ data: recordsets});
        }
    });
});

router.get('/languages', function (req, res) {
    db.executeSql(req, 'select LanguageID,Name,Code,IsDefault from [Language]  where IsActive = 1 ', function (data, err) {
        if (err) {
            Error.ErrorLog(err, 'select LanguageID,Name,Code,IsDefault from [Language]  where IsActive = 1 ', "", req);
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

router.get('/repairitems/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:partnerID/:requireQty', function (req, res) {
    var startwith = req.params.startwith;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input("StartIndex", sql.Int, req.params.StartIndex);
        request.input("PageSize", sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.output("TotalCount", sql.Int);
        request.input("partnerID", sql.VarChar(20), req.params.partnerID);
        request.input("requireQty", sql.VarChar(20), req.params.requireQty);
        request.execute('spGetRepairItems', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "spGetRepairItems", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            }
            connection.close();
        })
    });
});

router.get('/regions', function (req, res) {
    db.executeSql(req, "SELECT RegionID, RegionCode, RegionName from Region Where IsActive = 1", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT RegionID, RegionCode, RegionName from Region Where IsActive = 1", "", req);
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


router.get('/GetUOMs', function (req, res) {
    db.executeSql(req, "SELECT UOMID, UOMCode, UOMName, IsActive FROM UOMMaster Where IsActive = 1", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT UOMID, UOMCode, UOMName, IsActive FROM UOMMaster Where IsActive = 1", "", req);
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


router.get('/GetCarriers', function (req, res) {
    db.executeSql(req, "SELECT CarrierID, CarrierNumber, CarrierName FROM carrier", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT CarrierID, CarrierNumber, CarrierName FROM carrier", "", req);
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

router.get('/airports', function (req, res) {
    db.executeSql(req, "SELECT AirportID,   AirportCode, AirportName from Airport", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT AirportID,   AirportCode, AirportName from Airport", "", req);
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

router.get('/roles/:rt', function (req, res) {
    var extension = "";
    if (req.params.rt != "null")
        var extension = " AND UserType = '" + req.params.rt + "'";

    db.executeSql(req, "SELECT RoleID, RoleName, UserType from RoleType where IsActive=1", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT RoleID, RoleName from RoleType  where  IsActive=1", "", req);
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

router.get('/users', function (req, res) {
    db.executeSql(req, `select Users.UserID, TenantID, Initials, FirstName, MiddleName, LastName, Email, Password, 
    Scope, UserName, userimage, RoleType.RoleID, RoleType.RoleName
    from Users 
    inner join userrolemap on userrolemap.UserID = Users.UserID
    inner join RoleType on userrolemap.RoleTypeID = RoleType.RoleID `, function (data, err) {
        if (err) {
            Error.ErrorLog(err, `select Users.UserID, TenantID, Initials, FirstName, MiddleName, LastName, Email, Password, 
            Scope, UserName, userimage, RoleType.RoleID, RoleType.RoleName
            from Users 
            inner join userrolemap on userrolemap.UserID = Users.UserID
            inner join RoleType on userrolemap.RoleTypeID = RoleType.RoleID
            where Users.UserType = 'Internal'`, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/returnreasons', function (req, res) {
    db.executeSql(req, `
            SELECT RMAActionCodeID as ReasonID, RMAActionCode as ReasonCode, RMAActionName as ReasonName FROM RMAActionCode WHERE isActive = 1 AND
            RMAActionTypeID IN (SELECT TypeLookUpID FROM TypeLookUp WHERE TypeCode = 'RR001')`, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT RMAActionCodeID as ReasonID, RMAActionCode as ReasonCode, RMAActionName as ReasonName FROM RMAActionCode WHERE isActive = 1 AND RMAActionTypeID IN (SELECT TypeLookUpID FROM TypeLookUp WHERE TypeCode = 'RR001')", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/returnrules', function (req, res) {
    db.executeSql(req, `declare @AllAvailableEffectOn nvarchar(max)
                set @AllAvailableEffectOn=(SELECT TypeLookUpID, TypeCode, TypeName FROM TypeLookUp WHERE TypeGroup = 'RREfectTo' for json Auto)
                select RRR.ReturnReasonRuleMapID, RRR.RMAActionCodeID as ReasonID,RRR.RuleID, R.RuleCode, R.RuleName, RRR.RuleValue, RRR.RuleControlTypeID, 
                    RRR.RuleControlTypeID as ControlTypeID, case when RRR.isOverRidable=1 then 'Yes' else 'No' end isOverRidable, RRR.isMandatory, 
                    RRR.isActive, (Select RoleName,RoleID,count(RoleTypeID) AS TotalAssignUser From RoleType left outer join UserRoleMap on RoleType.RoleID = UserRoleMap.RoleTypeID group by RoleName,RoleID for json Auto) RoleControl, IsFixedRuleValue, RuleValueEffect, RuleValueEffectTO, R.UserInput
                ,@AllAvailableEffectOn as AllAvailableRules, RG.TypeName AS RuleGroup, CT.TypeName AS ControlTypeName
                from ReturnReasonRuleMap RRR INNER JOIN Rules R on RRR.RuleID = R.RuleID Left Join TypeLookUp RG on R.RuleGroupID =RG.TypeLookUpID Left Join TypeLookUp CT on RRR.RuleControlTypeID =CT.TypeLookUpID Order By RRR.RMAActionCodeID, R.SortOrder`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, "select RRR.ReturnReasonRuleMapID, RRR.RMAActionCodeID as ReasonID,RRR.RuleID, R.RuleCode, R.RuleName, RRR.RuleValue, RRR.RuleControlTypeID, case when RRR.isOverRidable=1 then 'Yes' else 'No' end isOverRidable, case when RRR.isMandatory=1 then 'Yes' else 'No' end isMandatory, RRR.isActive, (Select RoleID,RoleName From RoleType Where IsActive=1 for json Auto) RoleControl, IsFixedRuleValue, RuleValueEffect, RuleValueEffectTO, UserInput from ReturnReasonRuleMap RRR INNER JOIN Rules R on RRR.RuleID = R.RuleID Left Join TypeLookUp CT on RRR.RuleControlTypeID =CT.TypeLookUpID WHERE RRR.isActive = 1", "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});

router.get('/partners', function (req, res) {
    db.executeSql(req, `select PartnerID, PartnerName, PartnerCode, 0 as isDefault, TypeLookUp.TypeCode, TypeLookUp.TypeName as PartnerType, OrgSubType.TypeName as TypeName, ContactName, Email from Partners 
    INNER JOIN TypeLookUp ON TypeLookUp.TypeLookUpID = Partners.PartnerTypeID
    INNER JOIN TypeLookUp OrgSubType ON OrgSubType.TypeLookUpID = Partners.OrgSubTypeID 
    WHERE Partners.IsActive = 1  ORDER BY PartnerName `, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "select PartnerID, PartnerName, PartnerCode, 0 as isDefault from Partners where PartnerTypeID in (select TypeLookUpID from TypeLookUp where TypeCode = 'PTR001')", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/partners/assigned', function (req, res) {
    var startwith = req.params.startwith;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('userID', sql.Int, req.userlogininfo.UserID);

        request.execute('usp_assigned_pnb', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_assigned_pnb", JSON.stringify(request.parameters), req);
                
                res.status(500).send({ data: "Error Occured: " + err });
            }
            else {
                res.status(200).send({recordsets: recordsets[0]});
            }
            connection.close();
        })
    });
});

router.get('/partners/assigned/:userID', function (req, res) {
    var startwith = req.params.startwith;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('userID', sql.Int, req.params.userID);

        request.execute('usp_assigned_partners', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "usp_assigned_partners", JSON.stringify(request.parameters), req);
                
                res.status(500).send({ data: "Error Occured: " + err });
            }
            else {
                res.status(200).send({recordsets: recordsets[0]});
            }
            connection.close();
        })
    });
});

router.get('/brands', function (req, res) {
    db.executeSql(req, `select PartnerID, PartnerName, PartnerCode from Partners 
    INNER JOIN TypeLookUp ON TypeLookUp.TypeLookUpID = Partners.PartnerTypeID 
    WHERE TypeLookUp.TypeCode ='PTR005' ORDER BY PartnerName`, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "select PartnerID, PartnerName, PartnerCode, 0 as isDefault from Partners where PartnerTypeID in (select TypeLookUpID from TypeLookUp where TypeCode = 'PTR001')", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/typelookup/:typename', function (req, res) {
    var typename = req.params.typename;
    db.executeSql(req, "SELECT TypeLookUpID ,[TypeCode] ,[TypeName], [TypeGroup] FROM [TypeLookUp] where IsActive = 1 and typegroup = '" + typename + "'", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT TypeLookUpID ,[TypeCode] ,[TypeName], [TypeGroup] FROM [TypeLookUp] where IsActive = 1 and typegroup = '" + typename + "'", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});


router.get('/allitems/:FilterValue', function (req, res) {
    debugger;
    var connection =  new sql.Connection(settings.DBconfig(req));
    console.log('yiuyiuyii');
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.execute('GetAllItemMaster', function (err, recordsets, returnValue) {
            console.log(JSON.stringify(request.parameters));
            if (err) {
                Error.ErrorLog(err, 'GetAllItemMaster', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets });
            connection.close();
        })
    });
  });

  router.get('/allcolor/:FilterValue', function (req, res) {
    var connection =  new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.execute('GetAllColor', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetAllColor', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets });
            connection.close();
        })
    });
});


router.get('/SearchItemNumber/:startwith/:typecode/:refTypeID', function (req, res) {
    var startwith = req.params.startwith;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartWith', sql.VarChar(1000), req.params.startwith);
        request.input('TypeCode', sql.VarChar(100), req.params.typecode);
        request.input('RefTypeId', sql.Int, req.params.refTypeID);
        request.execute('SearchItemBytypecode', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "SearchItemBytypecode", JSON.stringify(request.parameters), req);
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

router.get('/SearchSerialNumber/:startwith/:ItemMasterId/:PartnerID', function (req, res) {
    var startwith = req.params.startwith;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartWith', sql.VarChar(1000), req.params.startwith);
        request.input('ItemMasterId', sql.VarChar(100), req.params.ItemMasterId);
        request.input('PartnerID', sql.VarChar(100), req.params.PartnerID);

        request.execute('SearchSerialNumberByItemId', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "SearchSerialNumberByItemId", JSON.stringify(request.parameters), req);
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

router.get('/GetUserTaskList/:PartnerID/:ListType', function (req, res) {
    
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var procedure = "";
        if (req.params.ListType == "Approver" || req.params.ListType == "Dispatcher")
            procedure = "usp_GetRMATaskList";
        else
            procedure = "usp_GetRMAReceivingTaskList";

        var request = new sql.Request(connection);
        request.input('PartnerID', sql.Int, req.params.PartnerID);
        request.input('ListType', sql.VarChar(50), req.params.ListType);        
        request.execute(procedure, function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, procedure, JSON.stringify(request.parameters), req);
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


router.post('/typelookups', function (req, res) {

    db.executeSql(req, `SELECT TypeLookUpID as TypeLookUpID ,[TypeCode] ,[TypeName] ,[Description], TypeGroup 
        FROM [TypeLookUp] where typegroup IN (select items from dbo.Split('${req.body.join(',')}',',')) `, function (data, err) {
            if (err) {
                Error.ErrorLog(err,  `SELECT TypeLookUpID as TypeLookUpID ,[TypeCode] ,[TypeName] ,[Description], TypeGroup 
        FROM [TypeLookUp] where typegroup IN (select items from dbo.Split('${req.body.join(',')}',',')) `,"", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {

                res.write(JSON.stringify(data));
            }
            res.end();



        });
});

router.get('/status/:moduleId', function (req, res) {
    var moduleId = req.params.moduleId;
    db.executeSql(req, "select s.StatusID, s.StatusCode, s.StatusName, ms.ModuleStatusMapID from ModuleStatusMap ms left join [Statuses] s on ms.StatusID = s.StatusID where ms.IsActive = 1 and ms.ModuleID = " + moduleId, function (data, err) {
        if (err) {
            Error.ErrorLog(err,  "select s.StatusID, s.StatusCode, s.StatusName, ms.ModuleStatusMapID from ModuleStatusMap ms left join [Statuses] s on ms.StatusID = s.StatusID where ms.IsActive = 1 and ms.ModuleID = " + moduleId, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/action/:moduleId', function (req, res) {
    var moduleId = req.params.moduleId;
    db.executeSql(req, "select r.ActionID, r.ActionCode, r.ActionName, mr.ModuleActionMapID from ModuleActionMap mr left join [Actions] r on mr.ActionID = r.ActionID where mr.IsActive = 1 and mr.ModuleID = " + moduleId + " order by mr.SortOrder", function (data, err) {
        if (err) {
            Error.ErrorLog(err,"select s.StatusID, s.StatusCode, s.StatusName, ms.ModuleStatusMapID from ModuleStatusMap ms left join [Statuses] s on ms.StatusID = s.StatusID where ms.IsActive = 1 and ms.ModuleID = " + moduleId, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/defaultpartner', function (req, res) {
    var sql = `select u.UserId, u.FullName as LogInUserName, u.Email as LogInUserEmail, isnull(u.UserImage,'') as UserImage,rt.RoleName,
    isnull(p.PartnerID, 0) as LogInUserPartnerID, p.PartnerCode as LogInUserPartnerCode , p.PartnerName as LogInUserPartnerName
                    from [users] u 
                    left Join UserRoleMap umap on u.userid = umap.userid
                    left Join PartnerUserRoleMap pmap on umap.UserRoleMapID = pmap.UserRoleMapID
                    left Join Partners p on p.PartnerID = pmap.PartnerID
					left join RoleType rt on umap.RoleTypeID= rt.RoleID                    
                    Where u.userid = ${req.userlogininfo.UserID} Order by pmap.isDefault desc`;
    db.executeSql(req, sql
        , function (data, err) {
            if (err) {

                Error.ErrorLog(err, sql, "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});

router.get('/newdefaultpartner', function (req, res) {

     var sql = `declare @roles varchar(50)='' select @roles=@roles+ CASE WHEN @roles='' THEN '' else ',' end+RoleType.RoleName from [users] u inner Join UserRoleMap umap on u.userid = umap.userid iNNER join RoleType on RoleType.RoleID=umap.RoleTypeID inner Join PartnerUserRoleMap pmap on umap.UserRoleMapID = pmap.UserRoleMapID AND pmap.isDefault=1 AND u.USERID = ${req.userlogininfo.UserID} select top 1 u.UserId, isnull(u.UserImage,'') as UserImage , p.PartnerID as LogInUserPartnerID, p.PartnerCode as LogInUserPartnerCode , p.PartnerName as LogInUserPartnerName,
                    ISNULL(a.Address1,'') + ISNULL('<br />'+a.Address2 ,'')+ ISNULL('<br />'+a.City,'')+' ZIP-'+ISNULL(A.ZipCode,'')+ ISNULL(', '+s.StateName,'')+' '+ISNULL(', '+C.CountryName,'') AS PartnerAddress,
                    isnull(a.Address1,'')+','+isnull(a.Address2,'')+','+isnull(a.City,'')+','+isnull(a.ZipCode,'')+','+isnull(s.StateName,'')+','+isnull(c.CountryName,'') as LogInUserPartnerAddress,
                    a.AddressID,u.Email,@roles as RoleName,CurrencySymbol,
                    PartOthDetFld1,PartOthDetFld2,PartOthDetFld3,PartOthDetFld4,PartOthDetFldVal1,PartOthDetFldVal2,PartOthDetFldVal3,PartOthDetFldVal4
                    from [users] u 
                    inner Join UserRoleMap umap on u.userid = umap.userid
                    inner Join PartnerUserRoleMap pmap on umap.UserRoleMapID = pmap.UserRoleMapID
                    inner Join Partners p on p.PartnerID = pmap.PartnerID
                    INNER JOIN Region R On R.RegionID=p.RegionID
					INNER JOIN Currency cur On R.CurrencyID=cur.CurrencyID
					left join PartnerAddressMap amap on amap.PartnerID=p.PartnerID
					left join address a on a.AddressID=amap.AddressID
					left join state s on a.AddressID=s.StateID
					left join country c on c.CountryID=s.CountryID
                    left join UserRoleMap urm on u.UserID= urm.UserID
					left join RoleType rt on urm.RoleTypeID= rt.RoleID
                    left join 
                    (
                    select 
                      PartnerID,
                      max(case when seq = 1 then Description end) PartOthDetFld1,
                      max(case when seq = 1 then ConfigValue end) PartOthDetFldVal1,
                      max(case when seq = 2 then Description end) PartOthDetFld2,
                      max(case when seq = 2 then ConfigValue end) PartOthDetFldVal2,
                      max(case when seq = 3 then Description end) PartOthDetFld3,
                      max(case when seq = 3 then ConfigValue end) PartOthDetFldVal3,
                      max(case when seq = 4 then Description end) PartOthDetFld4,
                      max(case when seq = 4 then ConfigValue end) PartOthDetFldVal4
                    from
                    (
                      select PartnerID, Description, ConfigValue,
                        row_number() over(partition by PartnerID
                                          order by Description) seq
                      from PartnerConfigMap --where PartnerID = p.PartnerID
                    ) d
                    group by PartnerID
                    ) PartnerHeads
                    ON PartnerHeads.PartnerID = p.PartnerID
                    Where u.userid = ${req.userlogininfo.UserID} Order by pmap.isDefault desc`;

    db.executeSql(req, `WITH CTE AS(select U.USERID,P.PARTNERID,p.PartnerCode,rt.RoleName,U.Email ,p.PartnerName ,ROW_NUMBER() OVER(PARTITION BY RoleName ORDER BY RoleName) row_num '+
' FROM [users] u inner Join UserRoleMap umap on u.userid = umap.userid '+
        'inner Join PartnerUserRoleMap pmap on umap.UserRoleMapID = pmap.UserRoleMapID '+
   ' inner Join Partners p on p.PartnerID = pmap.PartnerID '+
  '  INNER join UserRoleMap urm on u.UserID = urm.UserID '+
   ' INNER join RoleType rt on urm.RoleTypeID = rt.RoleID '+
        ' Where u.userid = ${req.userlogininfo.UserID }) ' +
        '  SELECT UserId, PartnerID as LogInUserPartnerID, PartnerName, PartnerCode as LogInUserPartnerCode, ' +
        '   RoleName, Email, PartnerName as LogInUserPartnerName FROM CTE WHERE row_num = 1'`, function (data, err) {

            if (err) {
                Error.ErrorLog(err, `WITH CTE AS(select U.USERID,P.PARTNERID,p.PartnerCode,rt.RoleName,U.Email ,p.PartnerName ,ROW_NUMBER() OVER(PARTITION BY RoleName ORDER BY RoleName) row_num ' +
                    ' FROM [users] u inner Join UserRoleMap umap on u.userid = umap.userid ' +
                    'inner Join PartnerUserRoleMap pmap on umap.UserRoleMapID = pmap.UserRoleMapID ' +
                    ' inner Join Partners p on p.PartnerID = pmap.PartnerID ' +
                    '  INNER join UserRoleMap urm on u.UserID = urm.UserID ' +
                    ' INNER join RoleType rt on urm.RoleTypeID = rt.RoleID ' +
                    ' Where u.userid = ${req.userlogininfo.UserID }) ' +
                    '  SELECT UserId, PartnerID as LogInUserPartnerID, PartnerName, PartnerCode as LogInUserPartnerCode, ' +
                    '   RoleName, Email, PartnerName as LogInUserPartnerName FROM CTE WHERE row_num = 1'`, "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});
router.get('/hierarchy/:moduleId', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('moduleID', sql.Int, req.params.moduleId);
        request.execute('GetModuleWFByModuleID', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "[GetModuleWFByModuleID]", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        })
    });
});

router.get('/usertype', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);        
        request.execute('usp_GetUserType', function (err, recordsets) {
            if (err) {
                Error.ErrorLog(err, "[usp_GetUserType]", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send({ recordsets: recordsets });
            }
            connection.close();
        })
    });
});

router.get('/RMAActionType', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.execute('usp_GetRMAActionType', function (err, recordsets) {
            connection.close();
            if (err) {
                Error.ErrorLog(err, "[usp_GetRMAActionType]", JSON.stringify(request.parameters), req);
                res.status(401).send({ data: "Error Occured: " + err });
            }
            else {
                res.status(200).send({ recordsets: recordsets });
            }
        })
    });
});

router.get('/InspectStatus', function (req, res) {
    var moduleId = req.params.moduleId;
    db.executeSql(req, "select r.ActionID, r.ActionCode, r.ActionName, mr.ModuleActionMapID from ModuleActionMap mr left join [Action] r on mr.ActionID = r.ActionID where r.IsActive = 1 and mr.ModuleID = " + moduleId + " order by mr.SortOrder", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "select r.ActionID, r.ActionCode, r.ActionName, mr.ModuleActionMapID from ModuleActionMap mr left join [Action] r on mr.ActionID = r.ActionID where r.IsActive = 1 and mr.ModuleID = " + moduleId + " order by mr.SortOrder", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/DashBoardCode', function (req, res) {
    var moduleId = req.params.moduleId;
    db.executeSql(req, `SELECT top 1 d.DashBoardCode from Users u
                        INNER JOIN UserRoleMap ur on u.UserID = ur.UserID
                        INNER JOIN RoleType r on ur.RoleTypeID = r.RoleID
                        INNER JOIN DashBoardMaster d on d.DashBoardMasterID = r.DashBoardMasterID
                        WHERE u.UserID = ${req.userlogininfo.UserID}  AND r.IsActive = 1 order by r.RoleID asc`, function (data, err) {
        if (err) {
            Error.ErrorLog(err, "select r.ActionID, r.ActionCode, r.ActionName, mr.ModuleActionMapID from ModuleActionMap mr left join [Action] r on mr.ActionID = r.ActionID where r.IsActive = 1 and mr.ModuleID = " + moduleId + " order by mr.SortOrder", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/Node', function (req, res) {
    db.executeSql(req, "select NodeID, Node from node where isactive=1", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "select NodeID, Node from node where isactive=1", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/Grade', function (req, res) {
    db.executeSql(req, "SELECT RMAActionCodeID, RMAActionName FROM RMAActionCode WHERE IsActive =1 AND RMAActionTypeID = (SELECT TOP 1 TypeLookUPID FROM TypeLookUp WHERE TypeCode='RR004') ORDER BY RMAActionName", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT RMAActionCodeID, RMAActionName FROM RMAActionCode WHERE IsActive =1 AND RMAActionTypeID = (SELECT TOP 1 TypeLookUPID FROM TypeLookUp WHERE TypeCode='RR004') ORDER BY RMAActionName", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/AllLocations', function (req, res) {
    db.executeSql(req, "select PartnerID,PartnerLocationID LocationID, LocationCode, LocationName from PartnerLocation where isactive=1", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "select PartnerID,PartnerLocationID LocationID, LocationCode, LocationName from PartnerLocation where isactive=1", "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.get('/Location/:PartnerId', function (req, res) {
    var PartnerId = req.params.PartnerId;
    db.executeSql(req, `
select FacilityLocationID as LocationID, LocationCode+'('+Facility.FacilityName+')' LocationCode from FacilityLocation
INNER JOIN 
PartnerFacilityMap
ON
PartnerFacilityMap.facilityId = FacilityLocation.facilityId
INNER JOIN
Facility
ON
Facility.FacilityID=FacilityLocation.facilityId
WHERE PartnerFacilityMap.PartnerID=${PartnerId}`
        , function (data, err) {
            if (err) {
                Error.ErrorLog(err, `
select FacilityLocationID as LocationID, LocationCode+'('+Facility.FacilityName+')' LocationCode from FacilityLocation
INNER JOIN 
PartnerFacilityMap
ON
PartnerFacilityMap.facilityId = FacilityLocation.facilityId
INNER JOIN
Facility
ON
Facility.FacilityID=FacilityLocation.facilityId
WHERE PartnerFacilityMap.PartnerID=${PartnerId}`, "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});
router.get('/PartnerLocation/:PartnerId', function (req, res) {
    var PartnerId = req.params.PartnerId;
    db.executeSql(req, `select PartnerLocationID as LocationID,LocationCode+'('+LocationName+')' LocationCode from PartnerLocation  where PartnerID=${PartnerId}`
        , function (data, err) {
            if (err) {
                Error.ErrorLog(err, `select PartnerLocationID as LocationID,LocationCode+'('+LocationName+')' LocationCode from PartnerLocation  where PartnerID=${PartnerId}`, "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});

var uUpload = upload.fields([{ name: 'UserImage', maxCount: 1 }])
router.post('/userimage', uUpload, function (req, res) {

    helper.uploadFile('consumer-files', req.files['UserImage'][0], function (error1, result1) {
        if (!error1) { req.ImageUrl = result1; }

        db.executeSql(req, `update users set UserImage = '${req.ImageUrl}' where UserID = ${req.userlogininfo.UserID} `, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `update users set UserImage = '${req.ImageUrl}' where UserID = ${req.userlogininfo.UserID}`, "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
                res.end();
            }
            else {
                res.send({ url: req.ImageUrl, result: 'Success' });
            }

        });

    });;
});

router.post('/resetLanding', function (req, res){
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('uid', sql.Int, req.userlogininfo.UserID);
        request.input('route', sql.NVarChar, req.body._route);
        console.log(req.body);
        request.execute('usp_ResetLanding', function (err, recordsets) {
            connection.close();
            if (err) {
                Error.ErrorLog(err, "[usp_ResetLanding]", JSON.stringify(request.parameters), req);
                res.status(401).send({ data: err });
            }
            else {
                res.status(200).send({ data: 'updated' });
            }
        })
    });
});

router.post('/resetTimezone', function (req, res){
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('uid', sql.Int, req.userlogininfo.UserID);
        request.input('tz', sql.Int, req.body.tz);
        console.log(req.body);
        request.execute('usp_ResetTimeZone', function (err, recordsets) {
            connection.close();
            if (err) {
                Error.ErrorLog(err, "[usp_ResetTimeZone]", JSON.stringify(request.parameters), req);
                res.status(401).send({ data: err });
            }
            else {
                res.status(200).send({ data: 'updated' });
            }
        })
    });
});

module.exports = router;