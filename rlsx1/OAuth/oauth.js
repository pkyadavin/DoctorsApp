var oauthServer = require('../oauth2-rl');
var config = require('../config')

var oauth = new oauthServer({
  model: require('./model.js')
});

module.exports = oauth;