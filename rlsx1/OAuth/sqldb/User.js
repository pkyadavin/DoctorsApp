'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User',  {
    UserID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    username: DataTypes.STRING(32),
    password: DataTypes.STRING(32),
    scope: DataTypes.STRING,
    languageid: DataTypes.STRING(32),
    home: DataTypes.STRING(32),
    tz: DataTypes.INTEGER
  }, {
    tableName: 'users', // oauth_users
    timestamps: false,
    underscored: true,
  });

  return User;
}