var config = require('./../../config')
var Sequelize = require('sequelize');

var db = {
  sequelize: new Sequelize(
    config.sql.database,
    config.sql.user,
    config.sql.password,
    {
      host: config.sql.server,
      dialect: config.sql.dialect,
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      dialectOptions: {
        encrypt: true
      }
    }
  )
};

db.OAuthAccessToken = db.sequelize.import('./OAuthAccessToken');
db.OAuthAuthorizationCode = db.sequelize.import('./OAuthAuthorizationCode');
db.OAuthClient = db.sequelize.import('./OAuthClient');
db.OAuthRefreshToken = db.sequelize.import('./OAuthRefreshToken');
db.OAuthScope = db.sequelize.import('./OAuthScope');
db.User = db.sequelize.import('./User');
db.Thing = db.sequelize.import('./Thing');

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = db;