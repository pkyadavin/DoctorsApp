
var sqlDB = require('mssql');

var DBconfig = {
    user: 'rlflexuser',
    password: 'RL2@CX#2016Dec', 
    server: 'rl21testvm.cloudapp.net', 
    database: 'ReverseLogix_03_Admin',
    requestTimeout: 3000000,
    connectTimeout: 15000000,
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        connectTimeout: 15000000,
        requestTimeout: 3000000,
    },
    pool: {
        max: 20,
        min: 10,
        idleTimeoutMillis: 3000
    }

}


var executeSql = function (sql, callback) {
    var con = new sqlDB.Connection(DBconfig);
    con.connect().then(function () {
        var req = new sqlDB.Request(con);
        req.query(sql).then(function (recordset) {
            callback(recordset);
            con.close();
        })
            .catch(function (err) {
                callback(null, err);
                con.close();
            });
    })
        .catch(function (err) {
            callback(null, err);
            con.close();
        });

};

exports.executeSql = executeSql;
exports.DBconfig = DBconfig;
