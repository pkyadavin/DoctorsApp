var express = require('express');
var router = express.Router();
var sql = require('mssql');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');
var db = require('../shared/DBAccess');
router.get('/:typegroup/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('typegroup', sql.VarChar(100), req.params.typegroup);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.input("PartnerID", sql.Int, req.params.PartnerID);
        request.output('TotalCount', sql.Int);
        request.execute('GetMetadataConfigWithPaging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetMetadataConfigWithPaging', JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
                res.end();
            }
            else {
                res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            }
            connection.close();
        })
    });
});



router.get('/get/:typeGroup', function (req, res) {
    var typeGroup = req.params.typeGroup;
    db.executeSql(req,"SELECT TypeLookUpID as TypeLookUpID ,[TypeCode] ,[TypeName] ,[Description] ,[IsActive] "+
                  ",case when IsActive=1 then 'fa fa-check-circle' else 'fa fa-times-circle' end [Active], [SortOrder] "+ 
        "FROM [TypeLookUp] where typegroup = '" + typeGroup+"' ORDER BY TypeName " , function (data, err) {
            if (err) {
                Error.ErrorLog(err, "SELECT TypeLookUpID as TypeLookUpID ,[TypeCode] ,[TypeName] ,[Description] ,[IsActive] " +
                    ",case when IsActive=1 then 'fa fa-check-circle' else 'fa fa-times-circle' end [Active], [SortOrder] " +
                    "FROM [TypeLookUp] where typegroup = '" + typeGroup + "'", "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {

                res.write(JSON.stringify(data));
            }
            res.end();



        });
});

router.post('/', function (req, res) {

    db.executeSql(req,`  INSERT INTO [TypeLookUp] ( TypeCode, TypeName, TypeGroup, [Description], SortOrder, IsActive, CreatedBy, CreatedDate, ModifyBy, ModifyDate ) 
          VALUES ('${req.body.TypeCode}' ,'${req.body.TypeName}' ,'${req.body.TypeGroup}', '${req.body.Description}' ,'${req.body.SortOrder}','${req.body.IsActive}' ,'${req.userlogininfo.UserID}' ,
                '${req.body.CreatedDate}' ,'${req.userlogininfo.UserID}','${req.body.ModifyDate}' )`, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `  INSERT INTO [TypeLookUp] ( TypeCode, TypeName, TypeGroup, [Description], SortOrder, IsActive, CreatedBy, CreatedDate, ModifyBy, ModifyDate ) 
          VALUES ('${req.body.TypeCode}' ,'${req.body.TypeName}' ,'${req.body.TypeGroup}', '${req.body.Description}' ,'${req.body.SortOrder}','${req.body.IsActive}' ,'${req.userlogininfo.UserID}' ,
                '${req.body.CreatedDate}' ,'${req.userlogininfo.UserID}','${req.body.ModifyDate}' )`, "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {

                res.write({ data: 0 });
            }
            res.end();


        });
});
router.post('/getall', function (req, res) {


    db.executeSql(req,`SELECT TypeLookUpID as TypeLookUpID ,[TypeCode] ,[TypeName] ,[Description] ,[IsActive] 
        ,case when IsActive=1 then 'fa fa-check-circle' else 'fa fa-times-circle' end [Active], [SortOrder], TypeGroup
        FROM [TypeLookUp] where typegroup IN (select items from dbo.Split('${req.body.join(',')}',',')) `, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `SELECT TypeLookUpID as TypeLookUpID ,[TypeCode] ,[TypeName] ,[Description] ,[IsActive] 
        ,case when IsActive=1 then 'fa fa-check-circle' else 'fa fa-times-circle' end [Active], [SortOrder], TypeGroup
        FROM [TypeLookUp] where typegroup IN (select items from dbo.Split('${req.body.join(',')}',',')) `, "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {

                res.write(JSON.stringify(data));
            }
            res.end();



        });
});
router.delete('/:Id', function (req, res) {

    db.executeSql(req,`DELETE FROM [TypeLookUp] where TypeLookUpID = '${req.params.Id}' `, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `DELETE FROM [TypeLookUp] where TypeLookUpID = '${req.params.Id}' `, "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {

                res.write(JSON.stringify(data));
            }
            res.end();



        });
});


router.put('/', function (req, res) {
    db.executeSql(req,`Update[TypeLookUp] SET [TypeCode] = '${req.body.TypeCode}', TypeName = '${req.body.TypeName}', [Description] = '${req.body.Description}'
        , SortOrder = '${req.body.SortOrder}', IsActive = '${req.body.IsActive}', ModifyBy = '${req.userlogininfo.UserID}', ModifyDate = GETUTCDATE()
        Where TypeLookUpID = '${req.body.TypeLookUpID}' `, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `Update[TypeLookUp] SET [TypeCode] = '${req.body.TypeCode}', TypeName = '${req.body.TypeName}', [Description] = '${req.body.Description}'
        , SortOrder = '${req.body.SortOrder}', IsActive = '${req.body.IsActive}', ModifyBy = '${req.userlogininfo.UserID}', ModifyDate = GETUTCDATE()
        Where TypeLookUpID = '${req.body.TypeLookUpID}'` , "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {

                res.write(1);
            }
            res.end();


        });
});

module.exports = router;