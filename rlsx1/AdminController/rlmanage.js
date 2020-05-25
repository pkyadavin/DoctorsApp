var express = require('express');
var router = express.Router();
var sqlDB = require('mssql');
var settings = require('../shared/Settings');
require('dotenv').config();

var db = function(db){
    return {
        user: process.env.RL_OWNER_USER,
        password: process.env.RL_OWNER_PASSWORD,
        server: process.env.RL_SERVER, 
        database: db?db:'master',
        requestTimeout: 3000000,
        connectTimeout: 15000000,
        options: {
            encrypt: true, // Use this if you're on Windows Azure
            connectTimeout: 15000000,
            requestTimeout: 3000000,
        }
    }
}

var schemadb = function(user){
    return {
        user: user,
        password: process.env.RL_PASSWORD,
        server: process.env.RL_SERVER, 
        database: process.env.RL_DB,
        requestTimeout: 3000000,
        connectTimeout: 15000000,
        options: {
            encrypt: true, // Use this if you're on Windows Azure
            connectTimeout: 15000000,
            requestTimeout: 3000000,
        }
    }
}

router.post('/env/prepare/:cus', function (req, res){
    var rlConfig=new db('master');
    var con = new sqlDB.Connection(rlConfig);
    con.connect()
    .then(function () {
        var request = new sqlDB.Request(con);
        request.query(`IF NOT EXISTS(SELECT name FROM sys.sql_logins WHERE name = '${req.params.cus}') BEGIN CREATE LOGIN ${req.params.cus} WITH PASSWORD = '${process.env.RL_PASSWORD}'; END`).then(function (err, recordsets, returnValue) {           
            con.close();
            if(err)
            {
                res.status(401).send({ data: error });
            }
            else
            {
                res.status(200).send({ data: 'created' });
            }
        })
    })
    .catch(function (err) {
        res.status(401).send({ data: 'catch: '+err });
    });
})

router.post('/env/init/:cus', function (req, res){
    var rlConfig=new db(process.env.RL_DB);
    var con = new sqlDB.Connection(rlConfig);
    con.connect()
    .then(function () {
        var request = new sqlDB.Request(con);
        request.input('schema', sqlDB.VarChar(50), req.params.cus);
        request.execute('usp_InitENV', function (err, recordsets, returnValue){
            con.close();
            if(err)
            {
                res.status(401).send({ data: err });
            }
            else
            {
                res.status(200).send({ data: 'created' });
            }
        })
    })
    .catch(function (err) {
        res.status(401).send({ data: 'catch: '+err });
    });
})

router.post('/env/process/:cus', function (req, res){
    var rlConfig=new schemadb(req.params.cus);
    var con = new sqlDB.Connection(rlConfig);
    con.connect()
    .then(function () {
        var request = new sqlDB.Request(con);
        request.input('schema', sqlDB.VarChar(50), req.params.cus);
        request.execute('usp_ProcessENV', function (err, recordsets, returnValue){
            con.close();
            if(err)
            {
                res.status(401).send({ data: err });
            }
            else
            {
                res.status(200).send({ data: 'created' });
            }
        })
    })
    .catch(function (err) {
        res.status(401).send({ data: 'catch: '+err});
    });
})

router.post('/env/conclude/:cus', function (req, res){
    var rlConfig=new db(process.env.RL_DB);
    var con = new sqlDB.Connection(rlConfig);
    con.connect()
    .then(function () {
        var request = new sqlDB.Request(con);
        request.input('schema', sqlDB.VarChar(50), req.params.cus);
        request.execute('usp_ConcludeENV', function (err, recordsets, returnValue){
            con.close();
            if(err)
            {
                res.status(401).send({ data: err });
            }
            else
            {
                res.status(200).send({ data: 'created' });
            }
        })
    })
    .catch(function (err) {
        res.status(401).send({ data: 'catch: '+err });
    });
})

module.exports = router;