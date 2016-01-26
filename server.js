var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var player = {};

/*
onMove brings in x, y, dir

*/

app.get('/', function(req, res){
  console.log("GET");

  res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){
  console.log('a user connected');
  //todo, add variables NAME, X, Y, Dir to socket
  socket.x = 37;
  socket.y = 270;
  socket.dir = 1; //0 left, 1 right
  socket.name = "default";

  socket.on('onLogin', function(name){
    player[name] = socket;
    socket.name = name;
    console.log(name + " connected")
    socket.broadcast.emit('onPlayerConnect', {
      name: name
    });
  });



  socket.on('onMove', function(data){
    console.log(data.name + ' moved ');
    socket.x = data.x;
    socket.y = data.y;
    socket.dir = data.dir;

    socket.broadcast.emit('onOtherPlayerMove', data);
  });

});

http.listen(3000, '0.0.0.0', function(){
  console.log('listening on *:3000');
});
