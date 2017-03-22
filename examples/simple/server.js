var http = require('http');
var express = require('express');
var path = require('path');

var app = express();
app.use('/', express.static(path.join(__dirname, '/public')));

var server = http.createServer(app);
server.listen(1000, function () {
  console.log('Server is listening at localhost:8080');
});
