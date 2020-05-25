require('dotenv').config();
module.exports = {
    sql: {
      user: process.env.RL_USER,
      password: process.env.RL_PASSWORD,        
      server: process.env.RL_SERVER,
      database: process.env.RL_DB,
      dialect: 'mssql',
      requestTimeout: 10000,
      connectTimeout: 20000,
      pool:  {
            max: 10,
            min: 0,
            idleTimeoutMillis: 60000
             },
      options: {
              encrypt: true,
              }
    }
  }