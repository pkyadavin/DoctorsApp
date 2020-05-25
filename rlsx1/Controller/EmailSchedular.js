var CronJob = require('cron').CronJob;
var sqlDB = require('mssql');
var settings = require('../shared/Settings');
var email = require("emailjs/email");
var server = email.server.connect({
    user: "tfsalert@cloudxtension.com",
    password: "MorTTRd24",
    host: "smtpout.secureserver.net",
    port: 25
   
});
var ConnectionConfig = {
    user: 'rlflexuser',
    password: 'RL2@CX#2016Dec',
    server: '10.91.0.203',//'dls0ec82yp.database.windows.net', // You can use 'localhost\\instance' to connect to named instance 
    database: 'ReverseLogix2.1',
    requestTimeout: 3000000,
    connectTimeout: 15000000,
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        connectTimeout: 15000000,
        requestTimeout: 3000000,
    }
}
var Emailjob = new CronJob('*/1 * * * *', function () {
    executeSql(settings.AdminConfig, "select TenantID, DBServer, DBUserName, DBServerName, DBPassword from tenant where ValidFrom<= GETUTCDATE() and ValidTo >= GETUTCDATE() and isActive= 1  and DBServer is not null and DBServerName is not null and DBPassword is not null",
        function (data, err) {
            var connection = {};
            if (err) {
            }
            else {
                data.forEach(function (item) {
                    connection[item.TenantID] = {};
                    connection[item.TenantID].database = item.DBServer;
                    connection[item.TenantID].password = item.DBPassword;
                    connection[item.TenantID].server = item.DBServerName;
                    connection[item.TenantID].user = item.DBUserName;
                    connection[item.TenantID].options = {
                        encrypt: true, // Use this if you're on Windows Azure
                        connectTimeout: 15000000,
                        requestTimeout: 3000000,
                    };
                   // connection[item.TenantID] = ConnectionConfig;
                    executeSql(connection[item.TenantID], "Select top 100 EmailLogid,ToAddress,Isnull(CCAddress,'') as CC,Isnull(BCCAddress,'') As BCC, " + item.TenantID +" As TenantID,Subject,Body from emaillog where  Subject is not null and  Body is not null and ToAddress is not null and IsPending=1 Order By CreatedAt ASC", function (querydata, err) {
                        if (err) {
                        } 
                        else {
                            querydata.forEach(function (item) {
                                sendMail('rl3demo@reverselogix.com', item.ToAddress, item.CC, item.BCC, item.Subject, item.Body, item.EmailLogid, connection[item.TenantID]);
                            });
                        };
                    });
                });
                };
            
        }
 )
  
},
function () { console.log('stop') },
    true,
    null,
    null,
    true
);
function sendMail(from, to, cc, bcc, subject, body, EmailLogId, connection) {
    server.send({
        Connection: connection,
        EmailLogId: EmailLogId,
        from: from,
        to: to,
        cc: cc,
        bcc: bcc,
        subject: subject,
        attachment:
        [
            { data: body, alternative: true }
        ]
    }, function (err, message) {
        if (err) {
            console.log(err || message);
        }
        else {
            executeSql(message.header.connection, "update EmailLog set IsPending=0 where EmailLogid='" + message.header.emaillogid + "'", function (data, err) {
                if (err) {
                }
                else {

                }
            })
        }
    })
}
function executeSql(connectionConfig, sql, callback) {
    var con = new sqlDB.Connection(connectionConfig);
    con.connect().then(function () {
        var req = new sqlDB.Request(con);
        req.query(sql).then(function (recordset) {
            con.close();
            callback(recordset);

        })
            .catch(function (err) {
                con.close();
                callback(null, err);

            });
    })
        .catch(function (err) {
            con.close();
            callback(null, err);

        });

};

