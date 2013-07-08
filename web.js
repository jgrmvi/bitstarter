var express = require('express');
var fs = require('fs');

var INDEX='index.html';

var app = express.createServer(express.logger());

var fileContent = fs.readFileSync(INDEX).toString();

app.get('/', function(request, response) {
  response.send(fileContent);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
