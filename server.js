var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Lobby = require('./Lobby');
var Player = require('./prefabs/Player');


//Storing all of the lobbies created
var lobbies = {};
var numLobbies = {};

//Storing all of the players
var players = {};
var numPlayers = 0;

/*
Added a Player class - Name, X, Y, Dir, SocketID
We should start storing the players with key being the SocketID
and not Player Name.
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
    socket.dir = 1; //0 no change, 1 left, -1 right
    socket.name = "default";

    socket.on('onLogin', function(name){
        ++numPlayers;
        players[name] = socket;
        socket.name = name;
        console.log(name + " connected");
        socket.broadcast.emit('onPlayerConnect', {
            name: name,
            x: socket.x,
            y: socket.y,
            dir: socket.dir
        });
    });

    socket.on('requestUsers', function(name) {
        for(var key in players) {
            if(players.hasOwnProperty(key)) {
                if(players[key].name != name) {
                    console.log(players[key].name + " is being added to " + name + "'s game");
                    socket.emit('onPlayerConnect', {
                        name: players[key].name,
                        x: players[key].x,
                        y: players[key].y,
                        dir: players[key].dir
                    });
                }
            }
        }
        var connectionString = "Players Connected: ";
        for(var key in players) {
            if(players.hasOwnProperty(key)) {
                connectionString += " " + players[key].name;
            }
        }
        console.log(connectionString);
    });


    socket.on('disconnect', function(){
        delete players[this.name]
        console.log(this.name + " dicconnected")
        socket.broadcast.emit('onPlayerDisconnect', {
            name: this.name
        });
        --numPlayers;
    });

    //When player sends move packet, broadcast to channel (ie: this lobby)
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
