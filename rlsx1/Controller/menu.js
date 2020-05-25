var express = require('express');
var router = express.Router();
var db = require('mssql');
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');
router.get('/listUserMenus', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
  connection.connect().then(function () {
    debugger;
        var request = new sql.Request(connection);
        request.input('UID', sql.Int, req.userlogininfo.UserID);
        request.input('scope', sql.NVarChar, req.scope);
        request.execute('usp_UserMenu', function (err, recordsets, returnValue) {
            console.log(JSON.stringify(recordsets[0]));
            if (err) {
                Error.ErrorLog(err, "usp_UserMenu", JSON.stringify(recordsets), req);
                res.send({ error: err }); 
            }
            else {
                res.send(JSON.stringify(recordsets[0]));
            }
            connection.close();
        })
    });
});

router.get('/listWizardMenus', function (req, res) {

    db.executeSql(req, "SELECT DISTINCT m.ModuleID AS ID, m.Module AS Title, m.NavigateURL, m.LabelCode, m.[Order], m.ParentModuleID AS ParentID, ISNULL(dbo.fun_User_Wizard_Menu(m.ModuleID," + req.userlogininfo.UserID + " ), '[]') AS Childs FROM Module m WHERE m.ParentModuleID IS NULL AND m.ActiveFlag = 1 and m.ModuleID in (27,1) ORDER BY m.[Order]", function (data, err) {
        if (err) {
            Error.ErrorLog(err, "SELECT DISTINCT m.ModuleID AS ID, m.Module AS Title, m.NavigateURL, m.LabelCode, m.[Order], m.ParentModuleID AS ParentID, ISNULL(dbo.fun_User_Wizard_Menu(m.ModuleID," + req.userlogininfo.UserID + " ), '[]') AS Childs FROM Module m WHERE m.ParentModuleID IS NULL AND m.ActiveFlag = 1 and m.ModuleID in (27,1) ORDER BY m.[Order]", "", req);
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
