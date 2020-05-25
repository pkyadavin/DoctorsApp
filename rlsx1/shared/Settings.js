require('dotenv').config();
var dbConfig = function (req) {
    return {              
        user: req.requser,
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
    };
}
exports.DBconfig = dbConfig;
var adminConfig = {
    user: process.env.RL_USER,
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
exports.AdminConfig = adminConfig;
