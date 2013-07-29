var express = require('express');
var fs = require('fs');

var INDEX='index.html';

var app = express.createServer(express.logger());

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  var fileContent = fs.readFileSync(INDEX).toString();
  response.send(fileContent);
});

var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log("Listening on " + port);
});
