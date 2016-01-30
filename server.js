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
    //TODO: Add locations, direction, etc for lobby connection


    //Login to game, not into lobby(map)
    socket.on('onLogin', function(name, sendID){

        players[socket.id] = new Player(name, socket.id);
        ++numPlayers;

        console.log(name + " connected on socket: " + socket.id);
        console.log(players[socket.id].getName());
        var data = {
            id: socket.id,
            name: name,
            x: 37,
            y: 270,
            dir: 1
        };
        socket.broadcast.emit('onPlayerConnect', data);
        sendID(data);
    });

    socket.on('requestUsers', function(socketID) {
        for(var player in players) {
            if(players.hasOwnProperty(player)) {
                console.log("player: ");
                console.log(player);
                console.log(players[socket.id].getX());

                if(players[player].socketID != socketID) {
                    console.log(players[player].getName() + " is being added to " + players[socketID].getName() + "'s game");
                    socket.emit('onPlayerConnect', {
                        name: players[player].getName(),
                        x: players[player].getX(),
                        y: players[player].getY(),
                        dir: players[player].getDir()
                    });
                }
            }
        }
        var connectionString = "Players Connected: ";
        console.log(players);
        for(player in players) {
            console.log("this is what player is : " + player);
            if(players.hasOwnProperty(player)) {
                connectionString += " " + players[player].getName();
            }
        }
        console.log(connectionString);
    });


    //when player disconnect, they send a disconnect command
    socket.on('disconnect', function(){
        try {
            var disconnectingPlayer = players[this.id];
            console.log("This is a player trying to disconnect");
            console.log(players[this.id]);
            console.log( disconnectingPlayer.getName() + " dicconnected");
            socket.broadcast.emit('onPlayerDisconnect', {
                id: disconnectingPlayer.socketID,
                name: disconnectingPlayer.getName()
            });
            //remove the player from the servers connected list
            delete players[this.id];
            --numPlayers;
        }catch(e){
            console.log(e);
        }
    });

    //When player sends move packet, broadcast to channel (ie: this lobby)
    socket.on('onMove', function(data){
        console.log(data.name + ' moved');
        players[socket.id].setX(data.x);
        players[socket.id].setY(data.y);
        players[socket.id].setDir(data.dir);

        socket.broadcast.emit('onOtherPlayerMove', data);
    });

});

http.listen(3000, '0.0.0.0', function(){
    console.log('listening on *:3000');
});
