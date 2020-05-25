var express = require('express');
var router = express.Router();
var sql = require('mssql');
var db = require('../shared/DBAccess');
var settings = require('../shared/Settings');

var app = express();


var Error = require('../shared/ErrorLog');




router.post('/', function (req, res) {
    var OperatorStr = ' <> ';
    if (req.body.UserType === 'cpexternal') {
        OperatorStr = ' = ';
    }

    db.executeSql(req,`select top 1 u.userid, u.username, u.[password],u.UserTheme, u.firstname, u.lastname, u.email, cs1.Value as [IdleTimeOutInSec], 
                    cs2.Value as [WarningTimeOutInSec] , isnull(u.UserImage, '') as UserImage, ISNULL(pur.PartnerID, 0) as PartnerID, ISNULL(p.PartnerName, '') as PartnerName,
                    t.TenantID, t.ValidTo, t.NoofUsers, t.ClaimType, DATEDIFF(DAY, GETDATE(),t.ValidTo) AS 'ValidDay'
                    from [users] u 
                    inner join configsetup cs1 on cs1.ConfigGroup = 'Login' and cs1.Code = 'TIMEOUT01'
                    inner join configsetup cs2  on cs2.ConfigGroup = 'Login' and cs2.Code = 'TIMEOUT02'
                    left join UserRoleMap ur on u.UserID=ur.UserID
                    left join PartnerUserRoleMap pur on ur.UserRoleMapID = pur.UserRoleMapID AND isDefault = 1
                    left join Partners p on p.PartnerID=pur.PartnerID
                    cross join Tenant t 
                    Where t.isActive = 1 AND UPPER(u.UserName) = UPPER('${req.body.userName}') COLLATE SQL_Latin1_General_CP1_CS_AS AND u.UserType ${OperatorStr} 'CPExternal' `,
        function (user, err) {
            var currentUser;
            if (err) {
                Error.ErrorLog(err, `select top 1 u.userid, u.username, u.[password],u.UserTheme, u.firstname, u.lastname, u.email, cs1.Value as [IdleTimeOutInSec], 
                    cs2.Value as [WarningTimeOutInSec] , isnull(u.UserImage, '') as UserImage, ISNULL(pur.PartnerID) as PartnerID, ISNULL(p.PartnerName, '') as PartnerName,
                    t.TenantID, t.ValidTo, t.NoofUsers, t.ClaimType, DATEDIFF(DAY, GETDATE(),t.ValidTo) AS 'ValidDay'
                    from [users] u 
                    inner join configsetup cs1 on cs1.ConfigGroup = 'Login' and cs1.Code = 'TIMEOUT01'
                    inner join configsetup cs2  on cs2.ConfigGroup = 'Login' and cs2.Code = 'TIMEOUT02' 
                    left join UserRoleMap ur on u.UserID=ur.UserID
                    left join PartnerUserRoleMap pur on ur.UserRoleMapID = pur.UserRoleMapID AND isDefault = 1
                    left join Partners p on p.PartnerID=pur.PartnerID
                    cross join Tenant t 
                    Where t.isActive = 1 AND UPPER(u.UserName) = UPPER('${req.body.userName}') COLLATE SQL_Latin1_General_CP1_CS_AS AND u.UserType ${OperatorStr} 'CPExternal' `, "", req);
                res.json({ success: false, message: `Server Error, Please try again later. ` });
            }
            else {
                if (!user || user.length == 0) {
                    if (req.body.UserType === 'cpexternal') {
                        CheckCustomerApproval(req.body.userName, req, res);
                    }
                    else {
                        res.json({ success: false, message: 'Authentication failed. User not found.' });
                    }
                }
                else if (user) {
                    // check if password matches
                    currentUser = user[0];
                    if (currentUser.password != req.body.password) {
                        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                    }
                    else if (currentUser.ValidDay <= 0)
                    {
                        res.json({ success: false, message: 'your 30-day trial has expired.  <a href=\"https://reverselogix.io/\" target=\"_blank\"><u>Buy now</u></a> to use it forever.' });
                    }
                    else {
                        var profile = {
                            username: currentUser.username,
                            IdleTimeOutInSec: currentUser.IdleTimeOutInSec,
                            WarningTimeOutInSec: currentUser.WarningTimeOutInSec,
                        };
                        // if user is found and password is right // create a token
                        var token = jwt.sign(profile, app.get('tokenKey'), {
                            expiresIn: 60 * 60 * 24 * 2 // expires in 2 day
                        });
                        
                        let ipv4 = ip.getLocalIP4();
                        let agent = req.headers['user-agent'];
                        agent = agent.substring(0, 100);
                        db.executeSql(req,`INSERT INTO UserLoginInfo (UserID, IPAddress, Agent, SessionID, LoginTime, Token, LogoutTime)
                                        VALUES( ${currentUser.userid}, '${ipv4}', '${agent}', null, getdate(), '${token}', null) `,
                            function (user, err) {
                                if (err) {
                                    Error.ErrorLog(err, `INSERT INTO UserLoginInfo (UserID, IPAddress, Agent, SessionID, LoginTime, Token, LogoutTime)
                                        VALUES( ${currentUser.userid}, '${ipv4}', '${agent}', null, getdate(), '${token}', null) `, "", req);
                                    res.json({ success: false, message: "Server Error, Please try again later. " });
                                }
                                else {
                                    // return the information including token as JSON   
                                    res.json({ success: true, message: 'login successfull!', theme: currentUser.UserTheme, auth_token: token, ImageUrl: currentUser.UserImage, email: currentUser.email, fullname: currentUser.firstname + ' ' + currentUser.lastname, ClaimType: currentUser.ClaimType, NoOfUser: currentUser.NoofUsers, ValidDay: currentUser.ValidDay });
                                }
                            });
                    }
                }
            }
        });

});


router.post('/forgotpassword', function (req, res) {

    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('data', sql.NVarChar(sql.MAX), req.body.userName);
        request.output('result', sql.NVarChar(500));
        request.execute('usp_SendPassword', function (err, recordsets, returnValue) {
            if (err) {
                res.send({ success: false, message: "Error Occured : " + err });
            }
            else {
                var result = request.parameters.result.value;
                var rs = request.parameters.result.value.split('_');

                if (rs[0] == 'INVALID')
                    res.send({ success: false, recordsets: recordsets, message: rs[1] });
                else
                    res.send({ success: true, recordsets: recordsets, result: rs[1] });
            }
        })
    });
});

router.get('/LogForgotpassword/:UserName', function (req, res) {



    var connection = new sql.Connection(settings.DBconfig(req));
    connection.connect().then(function () {
        var request = new sql.Request(connection);
        request.input('UserName', sql.NVarChar(sql.MAX), req.params.UserName);
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

CheckCustomerApproval = function (UserName, req, res) {
    db.executeSql(req, `SELECT (CASE WHEN IsApproved IS NULL THEN 'User pending for approval. ' 
			WHEN IsApproved = 0 THEN 'User Name (' + UserName +') Rejected by System Administrator. ' ELSE '' END)  as [Message] 
			FROM CPCustomer WHERE UPPER(UserName) = UPPER('${UserName}') COLLATE SQL_Latin1_General_CP1_CS_AS `,
        function (user, err) {
            if (err) {
                Error.ErrorLog(err, `SELECT (CASE WHEN IsApproved IS NULL THEN 'User pending for approval. ' 
			                        WHEN IsApproved = 0 THEN 'User Name (' + UserName +') Rejected by System Administrator. ' ELSE '' END) as [Message]
			                        FROM CPCustomer WHERE UPPER(UserName) = UPPER('${UserName}') COLLATE SQL_Latin1_General_CP1_CS_AS  `, "", req);
                res.json({ success: false, message: "Server Error, Please try again later. " });
            }
            else {
                if (!user || user.length == 0) {
                    res.json({ success: false, message: 'Authentication failed. User not found.' });
                }
                else if (user) {
                    var customer = user[0];
                    res.json({ success: false, message: 'Authentication failed. ' + customer.Message });
                }
            }
        });

}

module.exports = router;