var oauthServer = require('../oauth2-rl');
var Request = oauthServer.Request;
var Response = oauthServer.Response;
var config = require('../config');
var db = require('./sqldb');

var oauth = require('./oauth')
const rateLimit = require("express-rate-limit");



module.exports = function (app) {

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });

  app.all('/oauth/token', limiter, function (req, res, next) {
    // var _scope = req.headers["scope"];
    // req.scope = _scope=="manage"?"dbo":_scope;
    // req.requser = _scope=="manage"?"rl3v1user":_scope;

    // req.scope = "dbo";
    // req.requser = "dbo";

    var request = new Request(req);
    var response = new Response(res);

    oauth
      .token(request, response)
      .then(function (token) {
        // Todo: remove unnecessary values in response
        return res.json(token)
      }).catch(function (err) {
        console.log('/oauth/token/error:' + err);
        return res.status(500).json(err)
      })
  });
  app.all('/v2/oauth/token', limiter, function (req, res, next) {
    // var _scope = req.headers["scope"];
    // req.scope = _scope == "manage" ? "dbo" : _scope;
    // req.requser = _scope == "manage" ? "rl3v1user" : _scope;

    // req.scope = "dbo";
    // req.requser = "dbo";

    var request = new Request(req);
    var response = new Response(res);

    oauth
      .token(request, response)
      .then(function (token) {
        // Todo: remove unnecessary values in response
        var retVar = { access_token: token.access_token, expires_at: token.accessTokenExpiresAt }
        return res.json(retVar)
      }).catch(function (err) {
        console.log('/oauth/token/error:' + err);
        return res.status(500).json(err)
      })
  });
  app.post('/authorise', function (req, res) {
    var request = new Request(req);
    var response = new Response(res);

    return oauth.authorize(request, response).then(function(success) {
        res.json(success)
    }).catch(function(err){
      res.status(err.code || 500).json(err)
    })
  });

  app.get('/authorise', function (req, res) {
    return db.OAuthClient.findOne({
      where: {
        client_id: req.query.client_id,
        redirect_uri: req.query.redirect_uri,
      },
      attributes: ['id', 'name'],
    })
      .then(function (model) {
        if (!model) return res.status(404).json({ error: 'Invalid Client' });
        return res.json(model);
      }).catch(function (err) {
        return res.status(err.code || 500).json(err)
      });
  });
}