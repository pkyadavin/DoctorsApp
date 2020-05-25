var oauthServer = require('../oauth2-rl');
var Request = oauthServer.Request;
var Response = oauthServer.Response;
var db = require('./sqldb')
var config = require('../config');
var oauth = require('./oauth')

module.exports = function(options){
  var options = options || {};
  return function(req, res, next) {
    // var _scope = req.headers["scope"];
    // req.scope = _scope=="manage"?"dbo":_scope;
    // req.requser = _scope=="manage"?"rl3v1user":_scope;

    // req.scope = "dbo";
    // req.requser = "dbo";

    var request = new Request({
      headers: {authorization: req.headers.authorization},
      method: req.method,
      query: req.query,
      body: req.body,
      scope:req.scope,
      requser:req.requser
    });
    var response = new Response(res);

    oauth.authenticate(request, response,options)
      .then(function (token) {
        // Request is authorized.        
        var userHeader = JSON.parse(req.headers["user"]);
        if (typeof userHeader !== 'undefined') {        
          req.userlogininfo = userHeader;          
          req.user = token;
          next();
        }
        else
        {
          res.status(401).send({ success: false, message: 'Invalid user information.' });
        }
      })
      .catch(function (err) {
        console.log(err);
        // Request is not authorized.
        res.status(err.code || 500).json(err)
      });
  }
}