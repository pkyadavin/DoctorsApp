var express = require('express');
var router = express.Router();
var AdminDBConfig = require('../shared/Settings');
var AdminDB = require('../shared/DBAccess');


router.get('/logout', function (req, res) {

    AdminDB.executeAdminSql(`UPDATE ui set ui.Token='',ui.LogoutTime=getdate() from UserLoginInfo ui 
                    Inner Join Users u on u.userid=ui.userid where UPPER(u.username) = '${req.decoded.username}' and UPPER(u.email) = UPPER('${req.decoded.email}') and ui.Token ='${req.token}' `,
        function (data, err) {
            if (err) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            }
            else {
                res.json({ success: true, message: 'User logged out successfully.' });
            }
        });

});

router.get('/refreshtoken', function (req, res) {
    var app = req.app;
    var refreshtoken = jwt.sign(req.decoded, app.get('tokenKey'), {
        expiresIn: 60 * 60  // expires in 2 min
    });

    AdminDB.executeAdminSql(`UPDATE UserLoginInfo set Token='${refreshtoken}' where UserID = ${req.decoded.userid} and Token ='${req.token}' `,
        function (data, err) {
            if (err) {
                res.json({ success: false, message: 'refresh failed. User already loggedout.' });
            }
            else {
                res.json({ success: true, message: 'refresh successfull!', auth_token: refreshtoken });
            }
        });

});

module.exports = router;