'use strict';


module.exports = function(sequelize, DataTypes) {
  const OAuthAccessToken = sequelize.define('OAuthAccessToken', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    access_token:DataTypes.STRING(256),
    expires:DataTypes.DATE,
    scope: DataTypes.STRING
  }, {
    tableName: 'oauth_access_tokens',
    timestamps: false,
    underscored: true,
  });
  OAuthAccessToken.associate = function associate(models) {
    OAuthAccessToken.belongsTo(models.OAuthClient, {
      foreignKey: 'client_id',
    });
    OAuthAccessToken.belongsTo(models.User, {targetKey: 'UserID',
      foreignKey: 'user_id',
    });
  }
  return OAuthAccessToken;
};