var express = require('express');
var router = express.Router();
var settings = require('../shared/Settings');
/* GET users listing. */
var sql = require('mssql');
var Error = require('../shared/ErrorLog');
var db = require('../shared/DBAccess');
router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue/:PartnerID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.output('TotalCount', sql.Int);
        request.execute('GetFormManagerWithPagging', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, 'GetFormManagerWithPagging', JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
            console.dir(recordsets);
            console.dir(request.parameters.TotalCount.value);
        })
    });
});


router.get('/getformbyName/:formName/:languageId', function (req, res) {
    db.executeSql(req,"Select ff.FormFieldID, ff.FormName, fl.Value, ff.GridWidth, ff.DBFieldName, ff.isRequired, ff.isVisible, ff.isEnabled, ff.ShowinGrid, ff.ColumnAlias, fl.LanguageID, (Select is_nullable From Sys.all_columns where object_id=(Select OBJECT_ID(ff.TableName)) and name= ff.DBFieldName) as is_nullable From FormField ff "+
                       "Left outer join "+
                       "FormFieldLanguageMap fl "+ 
        "on ff.FormFieldID = fl.FormFieldID and LanguageID = " + req.params.languageId +
        "where ff.FormName = '" + req.params.formName + "'", function (data, err) {

            if (err) {

                Error.ErrorLog(err, "Select ff.FormFieldID, ff.FormName, fl.Value, ff.GridWidth, ff.DBFieldName, ff.isRequired, ff.isVisible, ff.isEnabled, ff.ShowinGrid, ff.ColumnAlias, fl.LanguageID, (Select is_nullable From Sys.all_columns where object_id=(Select OBJECT_ID(ff.TableName)) and name= ff.DBFieldName) as is_nullable From FormField ff " +
                    "Left outer join " +
                    "FormFieldLanguageMap fl " +
                    "on ff.FormFieldID = fl.FormFieldID and LanguageID = " + req.params.languageId +
                    "where ff.FormName = '" + req.params.formName + "'","", req);
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

router.post('/postformfields', function (req, res) {
    var sqlupdate = ";";
    var sqlInsertLanguage = ";";
    var sqlUpdateLanaguage = ";";
    var postType = req.body[0].PostType;
    req.body.forEach(function (item) {
        sqlupdate += "Update FormField set isRequired=" + ~~(item.isRequired) + ", isVisible=" + ~~(item.isVisible) + " , ShowinGrid=" + ~~(item.ShowinGrid) + " , isEnabled=" + ~~(item.isEnabled) + ", GridWidth='" + item.GridWidth + "' , ModifyBy=" + req.userlogininfo.UserID +", ModifyDate=GETUTCDATE() where FormFieldID=" + item.FormFieldID + ";";
        if(postType=="insert")
            sqlupdate += "insert into FormFieldLanguageMap(FormFieldID,LanguageID,Value) values(" + item.FormFieldID + "," + req.body[0].LanguageID + ",'" + item.Value+"');";
        else
            sqlupdate += "update FormFieldLanguageMap set Value='" + item.Value + "' where FormFieldID=" + item.FormFieldID + " and LanguageID=" + req.body[0].LanguageID+ ";";
    });

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

module.exports = router;