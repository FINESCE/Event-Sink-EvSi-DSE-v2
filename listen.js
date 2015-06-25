http = require('http');
fs = require('fs');
server = http.createServer(function(req, res) {

  console.dir(req.param);

  if (req.method == 'POST') {
    console.log("POST");
    var body = '';
    req.on('data', function(data) {
      body += data;
    });
    req.on('end', function() {
      console.log("Body: " + body);
      readEvent(body);
    });
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end('post received');
  } else {
    console.log("GET");
    var html = '<html><body><form method="post" action="http://localhost:3000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(html);
  }

});

function readEvent(json) {

  var obj = JSON.parse(json);
  var contextResponses = obj['contextResponses'][0]['contextElement']['attributes'];
  contextResponses.forEach(function(item) {
    console.log(item['name'] + ": " + item['value']);
  });

}

port = 46665;
host = '127.0.0.1';
server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);

