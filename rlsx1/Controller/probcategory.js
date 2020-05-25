var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');

var helper = require('../UtilityLib/BlobHelper');

var multer = require('multer');
var upload = multer({ dest: '../Uploads/' })
var Error = require('../shared/ErrorLog');
router.get('/:StartIndex/:PageSize/:SortColumn/:SortDirection/:FilterValue', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect(function (error) {
        var request = new sql.Request(connection);
        request.input('StartIndex', sql.Int, req.params.StartIndex);
        request.input('PageSize', sql.Int, req.params.PageSize);
        request.input("SortColumn", sql.VarChar(50), req.params.SortColumn);
        request.input("SortDirection", sql.VarChar(4), req.params.SortDirection);
        request.input("FilterValue", sql.VarChar(1000), req.params.FilterValue);
        request.output('TotalCount', sql.Int);
        request.execute('GetProbCatByPaging', function (err, recordsets, returnValue) {
            if (Error) {
                Error.ErrorLog(err, "GetProbCatByPaging", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets, totalcount: request.parameters.TotalCount.value });
            connection.close();
        })
    });
});

router.get('/GetAllProbCategories/', function (req, res) {
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.execute('spGetProbCategoriesForNode', function (err, recordsets) {
            if (Error) {
                Error.ErrorLog(err, "spGetProbCategoriesForNode", JSON.stringify(request.parameters), req);
            }
            res.send({ recordsets: recordsets });
            console.dir(recordsets);
            connection.close();
        })
    });
});

var cpUpload = upload.fields([{ name: 'Image', maxCount: 1 }])
router.post('/UpdateCategoryIcon', cpUpload, function (req, res) {

    var savetodb = function () {
        var connection = new sql.Connection(settings.DBconfig(req));
        connection.connect().then(function () {
            var request = new sql.Request(connection);
            req.body.CreatedBy = req.userlogininfo.UserID;
            request.input('json', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
            request.input('ImageUrl', sql.NVarChar(500), req.ImageUrl);
            request.output('returnValue', sql.VarChar(20));            

            request.execute('USP_SaveProbCategory', function (err, data) {
                if (err) {
                    Error.ErrorLog(err, "USP_SaveProbCategory", JSON.stringify(request.parameters), req);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.write(JSON.stringify({ success: false, message: "Error Occured: " + err }));
                    res.end;
                }
                else {
                    res.send(JSON.stringify({ result: request.parameters.returnValue.value, data: data }));
                }
            })
        });
    }

    if (req.files['Image'] != undefined) {
        helper.uploadFile('consumer-files', req.files['Image'][0], function (error, result) {
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


router.delete('/:ID', function (req, res) {
    var ID = req.params.ID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('ID', sql.Int, ID);
        request.output('returnValue', sql.VarChar(100));
        request.execute('USP_deleteProbCategory', function (err, data) {
            if (err) {
                Error.ErrorLog(err, "USP_deleteProbCategory", JSON.stringify(request.parameters), req);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ data: request.parameters.returnValue.value }));//request.parameters.rid.value
            }
            res.end();
            connection.close();
        })
    });
});




module.exports = router;