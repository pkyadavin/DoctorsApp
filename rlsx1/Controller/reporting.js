var express = require('express');
var router = express.Router();
var sql = require('mssql');
var dbHelper = require('../shared/DBAccess');
var dbSettings = require('../shared/Settings');
var Error = require('../shared/ErrorLog');
var pdf = require('html-pdf');
var options = { format: 'Letter' };

router.get('/RMAServiceCard/:ID', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function (error) {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('RMAOrderHeaderID', sql.Int, request.params.ID);
        sqlRequest.output('FileName', sql.VarChar(10000));
        sqlRequest.output('ReportHTMLOut', sql.VarChar(10000));
        sqlRequest.execute('usp_Report_RMAOrderServiceReport', function (err, recordsets, returnValue) {

            if (err) {
                Error.ErrorLog(err, `usp_Report_RMAOrderServiceReport`, JSON.stringify(request.parameters), request);
                console.dir(sqlRequest.parameters.ReportHTMLOut.value);
            }
            else {
            }
            console.dir('there');

            pdf.create(sqlRequest.parameters.ReportHTMLOut.value).toStream((err, pdfStream) => {
                if (err) {
                    // handle error and return a error response code
                    console.log(err)
                    return response.sendStatus(500)
                } else {
                    // send a status code of 200 OK
                    response.statusCode = 200

                    // once we are done reading end the response
                    pdfStream.on('end', () => {
                        // done reading
                        return response.end()
                    })

                    // pipe the contents of the PDF directly to the response
                    pdfStream.pipe(response)
                }
            })

        })
    });
});

router.get('/RMACustomerACK/:ID', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function (error) {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('RMAOrderHeaderID', sql.Int, request.params.ID);
        sqlRequest.output('FileName', sql.VarChar(10000));
        sqlRequest.output('ReportHTMLOut', sql.VarChar(10000));
        sqlRequest.execute('usp_Report_RMAOrderCustomerACKReport', function (err, recordsets, returnValue) {

            if (err) {
                Error.ErrorLog(err, `usp_Report_RMAOrderCustomerACKReport`, JSON.stringify(request.parameters), request);
                console.dir(sqlRequest.parameters.ReportHTMLOut.value);
            }
            else {
            }
            console.dir('there');

            pdf.create(sqlRequest.parameters.ReportHTMLOut.value).toStream((err, pdfStream) => {
                if (err) {
                    // handle error and return a error response code
                    console.log(err)
                    return response.sendStatus(500)
                } else {
                    // send a status code of 200 OK
                    response.statusCode = 200

                    // once we are done reading end the response
                    pdfStream.on('end', () => {
                        // done reading
                        return response.end()
                    })

                    // pipe the contents of the PDF directly to the response
                    pdfStream.pipe(response)
                }
            })

        })
    });
});

router.get('/AddressLabel/:SOID/:name', function (request, response) {
    var connection = new sql.Connection(dbSettings.DBconfig(request));
    connection.connect().then(function (error) {
        var sqlRequest = new sql.Request(connection);

        sqlRequest.input('SalesReturnOrderDetailID', sql.Int, request.params.SOID);
        sqlRequest.output('FileName', sql.VarChar(10000));
        sqlRequest.output('ReportHTMLOut', sql.VarChar(10000));
        sqlRequest.execute('usp_RMAAddressLabel', function (err, recordsets, returnValue) {

            if (err) {
                Error.ErrorLog(err, `usp_RMAAddressLabel`, JSON.stringify(request.parameters), request);
                console.dir(sqlRequest.parameters.ReportHTMLOut.value);
            }
            else {
                console.dir(sqlRequest.parameters.ReportHTMLOut.value);
            }
            pdf.create(sqlRequest.parameters.ReportHTMLOut.value).toStream((err, pdfStream) => {
                if (err) {
                    // handle error and return a error response code
                    console.log(err)
                    return response.sendStatus(500)
                } else {

                    // send a status code of 200 OK
                    response.statusCode = 200

                    // once we are done reading end the response
                    pdfStream.on('end', () => {
                        return response.end()
                    })

                    // pipe the contents of the PDF directly to the response
                    pdfStream.pipe(response)
                }
            })

        })
    });
});


module.exports = router;

