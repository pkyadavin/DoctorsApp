var express = require('express');
var router = express.Router();
var sql = require('mssql');
var AdminDBConfig = require('../shared/Settings');
var AdminDB = require('../shared/DBAccess');


router.post('/', function (req, res) {
    var app = req.app;
    AdminDB.executeAdminSql(`select top 1 u.userid, u.username, u.[password], u.firstname, u.lastname, u.email
                            , cs1.Value as [IdleTimeOutInSec], cs2.Value as [WarningTimeOutInSec] 
                    from [users] u 
                    inner join configsetup cs1 on cs1.Code = 'TIMEOUT01'
                    inner join configsetup cs2  on cs2.Code = 'TIMEOUT02'
                    Where UserType='SYSTEM' and UPPER(u.UserName) = UPPER('${req.body.userName}') COLLATE SQL_Latin1_General_CP1_CS_AS `,
        function (user, err) {
            var currentUser;
            if (err) {
                res.json({ success: false, message: 'Server Error, Please try again later. ' });
            }
            else {
                if (!user || user.length == 0) {
                    res.json({ success: false, message: 'Authentication failed. User not found.' });
                }
                else if (user) {
                    // check if password matches
                    currentUser = user[0];
                    if (currentUser.password != req.body.password) {
                        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                    }
                    else {
                        var profile = {
                            username: currentUser.username,
                            first_name: currentUser.firstname,
                            last_name: currentUser.lastname,
                            email: currentUser.email,
                            IdleTimeOutInSec: currentUser.IdleTimeOutInSec,
                            WarningTimeOutInSec: currentUser.WarningTimeOutInSec,
                            userid: currentUser.userid

                        };
                        // if user is found and password is right // create a token
                        var token = jwt.sign(profile, app.get('tokenKey'), {
                            expiresIn: 60 * 60 * 24 * 2 // expires in 2 day
                        });

                        let ipv4 = ip.getLocalIP4();
                        let agent = req.headers['user-agent'];
                        agent = agent.substring(0, 100);
                        AdminDB.executeAdminSql(`INSERT INTO UserLoginInfo (UserID, IPAddress, Agent, SessionID, LoginTime, Token, LogoutTime)
                                        VALUES( ${currentUser.userid}, '${ipv4}', '${agent}', null, getdate(), '${token}', null) `,
                            function (user, err) {
                                if (err) {
                                    res.json({ success: false, message: "Server Error, Please try again later. " });
                                }
                                else {
                                    // return the information including token as JSON   
                                    res.json({ success: true, message: 'login successfull!', auth_token: token });
                                }
                            });
                    }
                }
            }
        });

});

router.post('/forgotpassword', function (req, res) {

    var connection = new sql.Connection(AdminDBConfig.AdminConfig);
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('data', sql.NVarChar(sql.MAX), JSON.stringify(req.body));
        request.output('result', sql.NVarChar(500));
        request.execute('usp_SendPassword', function (err, recordsets, returnValue) {
            if (err) {
                res.send({ success: false, message: "Error Occured : " + err });
            }
            else {
                var result = request.parameters.result.value;
                if (result != 'Success') {
                    res.send({ success: false, message: result });
                }
                else {
                    res.send({ success: true, recordsets: recordsets, result: request.parameters.result.value });
                }
            }
        })
    });
});

router.post('/password', function (req, res) {
    var userId = req.body.userid;
    AdminDB.executeAdminSql(`select count(UserID) as IsExists from Users where UPPER(UserID) = UPPER('${userId}') and Password = '${req.body.oldPassword}' `, function (data, err) {
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
    var userId = req.body.userid;
    var connection = new sql.Connection(AdminDBConfig.AdminConfig);
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