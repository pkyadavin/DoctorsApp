var _ = require('lodash');
var sqldb = require('./sqldb');
var User = sqldb.User;
var OAuthClient = sqldb.OAuthClient;
var OAuthAccessToken = sqldb.OAuthAccessToken;
var OAuthAuthorizationCode = sqldb.OAuthAuthorizationCode;
var OAuthRefreshToken = sqldb.OAuthRefreshToken;

function getAccessToken(bearerToken, request) {  
  // sqldb.sequelize.connectionManager.config.username = request.requser;
  // sqldb.sequelize.connectionManager.pool.clear();
  return sqldb.OAuthAccessToken
    .findOne({
      where: {access_token: bearerToken},
      attributes: [['access_token', 'accessToken'], ['expires', 'accessTokenExpiresAt'],'scope'],
      include: [
        {
          model: User,
          attributes: ['UserID', 'username', 'languageid', 'home', 'tz'],
        }, OAuthClient
      ],
    })
    .then(function (accessToken) {
      if (!accessToken) return false;
      var token = accessToken.toJSON();
      token.user = token.User;
      token.client = token.OAuthClient;
      token.scope = token.scope
      return token;      
    })
    .catch(function (err) {
    });
}

function getClient(clientId, clientSecret, request) {  
  // sqldb.sequelize.connectionManager.config.username = request.requser; 
  // sqldb.sequelize.connectionManager.pool.clear();
  const options = {
    where: {client_id: clientId},
    attributes: ['id', 'client_id', 'redirect_uri', 'scope'],
  };
  if (clientSecret) options.where.client_secret = clientSecret;

  return sqldb.OAuthClient
    .findOne(options)
    .then(function (client) {
      if (!client) return new Error("client not found");
      var clientWithGrants = client.toJSON()
      clientWithGrants.grants = ['authorization_code', 'password', 'refresh_token', 'client_credentials']
      // Todo: need to create another table for redirect URIs
      clientWithGrants.redirectUris = [clientWithGrants.redirect_uri]
      delete clientWithGrants.redirect_uri
      return clientWithGrants
    }).catch(function (err) {
    });
}


function getUser(username, password, request) {
  // sqldb.sequelize.connectionManager.config.username = request.requser;
  // sqldb.sequelize.connectionManager.pool.clear();
  return sqldb.User
    .findOne({
      where: {username: username},
      attributes: ['UserID', 'username', 'password', 'scope', 'languageid', 'home', 'tz', 'IsFirstLoginAttempt', 'FailedLoginAttempt', 'PasswordUpdateDate', 'LastLoggedInDate'],
    })
    .then(function (user) {
      return user.password == password ? user.toJSON() : false;
    })
    .catch(function (err) {
    });
}

function revokeAuthorizationCode(code, request) {
  // sqldb.sequelize.connectionManager.config.username = request.requser;
  // sqldb.sequelize.connectionManager.pool.clear();
  return sqldb.OAuthAuthorizationCode.findOne({
    where: {
      authorization_code: code.code
    }
  }).then(function (rCode) {
    //if(rCode) rCode.destroy();
    /***
     * As per the discussion we need set older date
     * revokeToken will expected return a boolean in future version
     * https://github.com/oauthjs/node-oauth2-server/pull/274
     * https://github.com/oauthjs/node-oauth2-server/issues/290
     */
    var expiredCode = code
    expiredCode.expiresAt = new Date('2015-05-28T06:59:53.000Z')
    return expiredCode
  }).catch(function (err) {
  });
}

function revokeToken(token, request) {
  // sqldb.sequelize.connectionManager.config.username = request.requser;
  // sqldb.sequelize.connectionManager.pool.clear();
  return sqldb.OAuthRefreshToken.findOne({
    where: {
      refresh_token: token.refreshToken
    }
  }).then(function (rT) {
    if (rT) rT.destroy();
    /***
     * As per the discussion we need set older date
     * revokeToken will expected return a boolean in future version
     * https://github.com/oauthjs/node-oauth2-server/pull/274
     * https://github.com/oauthjs/node-oauth2-server/issues/290
     */
    var expiredToken = token
    expiredToken.refreshTokenExpiresAt = new Date('2015-05-28T06:59:53.000')
    return expiredToken
  }).catch(function (err) {
  });
}

function saveToken(token, client, user, request) {
  // sqldb.sequelize.connectionManager.config.username = request.requser;
  // sqldb.sequelize.connectionManager.pool.clear();
  return Promise.all([
    sqldb.OAuthAccessToken.create({
        access_token: token.accessToken,
        expires: token.accessTokenExpiresAt,
        client_id: client.id,
        user_id: user.UserID,
        scope: token.scope
      }),
      token.refreshToken ? sqldb.OAuthRefreshToken.create({ // no refresh token for client_credentials
        refresh_token: token.refreshToken,
        expires: token.refreshTokenExpiresAt,
        client_id: client.id,
        user_id: user.id,
        scope: token.scope
      }) : [],

    ])
    .then(function (resultsArray) {
      return _.assign(  // expected to return client and user, but not returning
        {
          client: client,
          user: user,
          access_token: token.accessToken, // proxy
          refresh_token: token.refreshToken, // proxy
        },
        token
      )
    })
    .catch(function (err) {
      console.log("revokeToken - Err: ", err)
    });
}

function getAuthorizationCode(code, request) {
  // sqldb.sequelize.connectionManager.config.username = request.requser;
  // sqldb.sequelize.connectionManager.pool.clear();
  return sqldb.OAuthAuthorizationCode
    .findOne({
      attributes: ['client_id', 'expires', 'user_id', 'scope'],
      where: {authorization_code: code},
      include: [User, OAuthClient]
    })
    .then(function (authCodeModel) {
      if (!authCodeModel) return false;
      var client = authCodeModel.OAuthClient.toJSON()
      var user = authCodeModel.User.toJSON()
      return reCode = {
        code: code,
        client: client,
        expiresAt: authCodeModel.expires,
        redirectUri: client.redirect_uri,
        user: user,
        scope: authCodeModel.scope,
      };
    }).catch(function (err) {
      console.log("getAuthorizationCode - Err: ", err)
    });
}

function saveAuthorizationCode(code, client, user, request) {
  // sqldb.sequelize.connectionManager.config.username = request.requser;
  // sqldb.sequelize.connectionManager.pool.clear();
  return sqldb.OAuthAuthorizationCode
    .create({
      expires: code.expiresAt,
      client_id: client.id,
      authorization_code: code.authorizationCode,
      user_id: user.id,
      scope: code.scope
    })
    .then(function () {
      code.code = code.authorizationCode
      return code
    }).catch(function (err) {
      console.log("saveAuthorizationCode - Err: ", err)
    });
}

function getUserFromClient(client, request) { 
  var options = {
    where: {client_id: client.client_id},
    include: [User],
    attributes: ['client_id', 'redirect_uri'],
  };
  if (client.client_secret) options.where.client_secret = client.client_secret;
  // sqldb.sequelize.connectionManager.config.username = request.requser;
  // sqldb.sequelize.connectionManager.pool.clear();
  return sqldb.OAuthClient
    .findOne(options)
    .then(function (client) {
      if (!client) return false;
      if (!client.User) return false;
      return client.User.toJSON();
    }).catch(function (err) {
      console.log("getUserFromClient - Err: ", err)
    });
}

function getRefreshToken(refreshToken, request) {
  if (!refreshToken || refreshToken === 'undefined') return false

  // sqldb.sequelize.connectionManager.config.username = request.requser;
  // sqldb.sequelize.connectionManager.pool.clear();
  return sqldb.OAuthRefreshToken
    .findOne({
      attributes: ['client_id', 'user_id', 'expires'],
      where: {refresh_token: refreshToken},
      include: [OAuthClient, User]

    })
    .then(function (savedRT) {
      var tokenTemp = {
        user: savedRT ? savedRT.User.toJSON() : {},
        client: savedRT ? savedRT.OAuthClient.toJSON() : {},
        refreshTokenExpiresAt: savedRT ? new Date(savedRT.expires) : null,
        refreshToken: refreshToken,
        refresh_token: refreshToken,
        scope: savedRT.scope
      };
      return tokenTemp;

    }).catch(function (err) {
      console.log("getRefreshToken - Err: ", err)
    });
}

function validateScope(token, client) {
  return 'profile'
}

function verifyScope(token, scope) {
    return token.scope === scope
}

module.exports = {
  getAccessToken: getAccessToken,
  getAuthorizationCode: getAuthorizationCode, //getOAuthAuthorizationCode renamed to,
  getClient: getClient,
  getRefreshToken: getRefreshToken,
  getUser: getUser,
  getUserFromClient: getUserFromClient,
  revokeAuthorizationCode: revokeAuthorizationCode,
  revokeToken: revokeToken,
  saveToken: saveToken,//saveOAuthAccessToken, renamed to
  saveAuthorizationCode: saveAuthorizationCode, //renamed saveOAuthAuthorizationCode,
  validateScope: validateScope,
  verifyScope: verifyScope,
}
