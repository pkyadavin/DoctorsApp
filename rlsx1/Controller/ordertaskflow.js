var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');
router.get('/taskflow/:ID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ModuleID', sql.Int, req.params.ID);
        request.execute('usp_TaskFlow_GetByModule', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_TaskFlow_GetByModule", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send(recordsets);
            }
            connection.close();
        })
    });
});

router.get('/rules/:moduleId', function (req, res) {
    var moduleId = req.params.moduleId;
    db.executeSql(req,"select r.RuleID, r.RuleCode, r.RuleName, mr.ModuleRuleMapID, 0 as isSelected from ModuleRuleMap mr "+
        "left join [rules] r on mr.RuleID = r.RuleID and RuleTypeID in (select TypeLookUpID from TypeLookUp where TypeName = 'WrokFlow' and TypeGroup = 'RuleType') where mr.IsActive = 1 and mr.ModuleID = " + moduleId, function (data, err) {
            if (err) {
                Error.ErrorLog(err, "select r.RuleID, r.RuleCode, r.RuleName, mr.ModuleRuleMapID, 0 as isSelected from ModuleRuleMap mr " +
                    "left join [rules] r on mr.RuleID = r.RuleID and RuleTypeID in (select TypeLookUpID from TypeLookUp where TypeName = 'WrokFlow' and TypeGroup = 'RuleType') where mr.IsActive = 1 and mr.ModuleID = " + moduleId, "", req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});

router.post('/:ID', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('TaskFlows', sql.NVarChar(sql.MAX), req.body[0].TaskFlow);
        request.input('ModuleID', sql.Int, req.params.ID);
        request.input('UserID', sql.Int, req.userlogininfo.UserID);
        request.execute('usp_TaskFlow_Post', function (err, recordsets, returnValue) {
            if (err) {
                Error.ErrorLog(err, "usp_TaskFlow_Post", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.send(recordsets);
            }
            connection.close();
        })
    });
});

router.get('/action/:moduleId', function (req, res) {
    var moduleId = req.params.moduleId;
    db.executeSql(req,"select r.ActionID, r.ActionCode, r.ActionName, mr.ModuleActionMapID, IsNull(mwf.ActionOrder,mr.SortOrder) SortOrder, 0 as IsTask, '' as currState, '' as nextState, 0 as IsRule" + 
        " from ModuleActionMap mr" +
        " left join" +
        " ( select ModuleActionMapID, ActionOrder from ModuleWorkFlowDetail where ModuleWorkFlowID in (select ModuleWorkFlowID from ModuleWorkFlow where ModuleID=" + moduleId + " and IsActive=1)" +
        " ) as mwf on mwf.ModuleActionMapID = mr.ModuleActionMapID" +
        " left join [Actions] r on mr.ActionID = r.ActionID" +
        " where mr.IsActive = 1 and mr.ModuleID = " + moduleId + " order by SortOrder", function (data, err) {
            if (err) {
                Error.ErrorLog(err, "select r.ActionID, r.ActionCode, r.ActionName, mr.ModuleActionMapID, IsNull(mwf.ActionOrder,mr.SortOrder) SortOrder, 0 as IsTask, '' as currState, '' as nextState, 0 as IsRule" +
                    " from ModuleActionMap mr" +
                    " left join" +
                    " ( select ModuleActionMapID, ActionOrder from ModuleWorkFlowDetail where ModuleWorkFlowID in (select ModuleWorkFlowID from ModuleWorkFlow where ModuleID=" + moduleId + " and IsActive=1)" +
                    " ) as mwf on mwf.ModuleActionMapID = mr.ModuleActionMapID" +
                    " left join [Actions] r on mr.ActionID = r.ActionID" +
                    " where mr.IsActive = 1 and mr.ModuleID = " + moduleId + " order by SortOrder", JSON.stringify(request.parameters), req);
            res.write(JSON.stringify({ data: "Error Occured: " + err }));
        }
        else {
            res.write(JSON.stringify(data));
        }
        res.end();
    });
});


module.exports = router;