var config = require('./config');

http = require('http');
fs = require('fs');

// prepare database

var mongoose = require('mongoose');
var EventSchema = mongoose.Schema({
    eventObject: Object,
    source: String,
    timestamp: String
});
mongoose.connect(config['mongo']['url']);
var db = mongoose.connection;

// listen to POST on /

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
      saveEvent(body);
    });
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end('post received');
  }

});

// create meaningful output to the console

function readEvent(json) {

  var obj = JSON.parse(json);
  var contextResponses = obj['contextResponses'][0]['contextElement']['attributes'];
  contextResponses.forEach(function(item) {
    console.log(item['name'] + ": " + item['value']);
  });

}

// save event to MongoDB

function saveEvent(json) {

  var obj = JSON.parse(json);
  var mobj = new EventSchema({
    eventObject: obj,
    source: config['info']['source'],
    timestamp: Date.now().toString()
  });
  mobj.save(function (err) {
    if (err) console.log('Error: %s', err.toString());
  });

}

// fire up server

port = config['server']['port'];
host = '127.0.0.1';
server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);
