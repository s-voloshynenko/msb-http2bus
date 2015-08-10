'use strict';
var msb = require('msb');
var app = exports;

app.config = require('./lib/config');

app.start = function(cb) {
  var RouterWrapper = require('./lib/routerWrapper').RouterWrapper;
  app.router = new RouterWrapper();

  app.router.load(app.config.routes);

  app.createServer()
  .listen(app.config.port)
  .once('listening', function() {
    app.config.port = this.address().port;

    if (cb) { cb(); }
    console.log('http2bus listening on ' + app.config.port);
  });
};

app.createServer = function() {
  var http = require('http');
  var finalhandler = require('finalhandler');

  return http.createServer(function(req, res) {
    app.router.middleware(req, res, finalhandler(req, res));
  });
};

app.createRoutesProviderAgent = function(config) {
  return require('./lib/routesProvider/agent')
    .create(config)
    .load(config.routes)
    .start();
};
