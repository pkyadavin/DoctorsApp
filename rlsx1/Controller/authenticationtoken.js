var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');

var app = express();
app.set('tokenKey', 'Mrityunjay');  
var Error = require('../shared/ErrorLog');
router.get('/logout', function (req, res) {

    db.executeSql(req,`UPDATE ui set ui.Token='',ui.LogoutTime=getdate() from UserLoginInfo ui 
                    Inner Join Users u on u.userid=ui.userid where UPPER(u.username) = UPPER('${req.decoded.username}') and UPPER(u.email) = UPPER('${req.decoded.email}') and ui.Token ='${req.token}' `,
        function (data, err) {

            var ddddd = data

            if (err) {
                Error.ErrorLog(err, `UPDATE ui set ui.Token='',ui.LogoutTime=getdate() from UserLoginInfo ui 
                    Inner Join Users u on u.userid=ui.userid where UPPER(u.username) = UPPER('${req.decoded.username}') and UPPER(u.email = '${req.decoded.email}') and ui.Token ='${req.token}' `, "", req);
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            }
            else {

                res.json({ success: true, message: 'User logged out successfully.' });

            }
        });

});

router.get('/refreshtoken', function (req, res) {

    var refreshtoken = jwt.sign(req.decoded, app.get('tokenKey'), {
        expiresIn: 60 * 60  // expires in 2 min
    });

    db.executeSql(req,`UPDATE UserLoginInfo set Token='${refreshtoken}' where UserID = ${req.decoded.userid} and Token ='${req.token}' `,
        function (data, err) {

            if (err) {
                Error.ErrorLog(err, `UPDATE UserLoginInfo set Token='${refreshtoken}' where UserID = ${req.decoded.userid} and Token ='${req.token}' `, "", req);
                res.json({ success: false, message: 'refresh failed. User already loggedout.' });
            }
            else {

                res.json({ success: true, message: 'refresh successfull!', auth_token: refreshtoken });
                

            }
        });

});

router.post('/password', function (req, res) {
        var userId = req.userlogininfo.UserID;
        db.executeSql(req, `select count(UserID) as IsExists from Users where UPPER(UserID) = UPPER('${userId}') and Password = '${req.body.oldPassword}' `, function (data, err) {
            if (err) {
                Error.ErrorLog(err, `select count(UserID) as IsExists from Users where UserID = '${userId}' and Password = '${req.body.oldPassword}' `, "", req);
                res.write(JSON.stringify({ data: "Error Occured: " + err }));
            }
            else {
                res.write(JSON.stringify(data));
            }
            res.end();
        });
});

router.post('/resetpassword', function (req, res) {
    var userId = req.userlogininfo.UserID;
    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('userId', sql.Int, userId);
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

module.exports = router;