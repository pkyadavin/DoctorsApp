var sqlDB = require('mssql');
var settings = require('./Settings');

exports.executeSql = function (sql, callback) {
    var con = new sqlDB.Connection(settings.DBconfig(req));
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

exports.executeSql = function (req, sql, callback) {
    var con = new sqlDB.Connection(settings.DBconfig(req));
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

exports.executeAdminSql = function (sql, callback) {
    var con = new sqlDB.Connection(settings.AdminConfig);
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

