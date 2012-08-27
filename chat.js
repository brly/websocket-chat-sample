
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(3000);

function handler (req, res) {
  fs.readFile('index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200, {"Content-type" : "text/html"});
    res.end(data);
  });
}

var count = 0;
io.sockets.on('connection', function (socket) {
  count++;
  socket.emit('counter', count);
  socket.broadcast.emit('counter', count);
  
  socket.on('message', function(message) {
    // message
    socket.emit('update_message', message);
    socket.broadcast.emit('update_message', message);
  });
  
  socket.on('disconnect', function() {
    count--;
    socket.broadcast.emit('counter', count);
  });
});
