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

app.get('/login', function(req, res){
    console.log("GET");
    res.send({success: true});
});

io.on('connection', function(socket){
    console.log('a user connected');
    //todo, add variables NAME, X, Y, Dir to socket
    //TODO: Add locations, direction, etc for lobby connection

    //Login to game, not into lobby(map)
    socket.on('onLogin', function(name, sendID){

        players[socket.id] = new Player(name, socket.id);
        ++numPlayers;
        var data = {
            id: socket.id,
            name: name,
            x: 37,
            y: 270,
            dir: 1
        };
        //socket.broadcast.emit('onPlayerConnect', data);
        sendID(data);
    });

    socket.on('requestLobbyUsers', function() {
        var requestingPlayer = players[socket.id];
        var lobby = lobbies[requestingPlayer.getLobby()];
        lobby.emitPlayers(socket);

        var connectionString = "Players Connected: ";
        console.log(players);
        for(player in players) {
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
            var lobbyID = players[socket.id].getLobby();
            playerLeaveLobby(socket);
            sendLobbyList(socket, lobbyID);
            socket.broadcast.emit('onPlayerDisconnect', {
                id: disconnectingPlayer.socketID,
                name: disconnectingPlayer.getName()
            });
            //remove the player from the servers connected list
            delete players[this.id];
            --numPlayers;
        }catch(e){
            console.log("Failed in disconnect method");
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

    socket.on('removeRemoteBullet', function(data){
        console.log("removing bullet with ID: " + data.uID);
        //foward bullet data to client so it can make a client side bullet
        socket.broadcast.emit('onDeleteBullet', data);
    });

    socket.on('onBulletFired', function(data){
        console.log(data.name + ' fired a bullet');
        //foward bullet data to client so it can make a client side bullet
        socket.broadcast.emit('onReceiveBullet', data);
    });

    socket.on('createLobby', function(data, sendLobbyID) {
        //Lobby Name - We need to assign a lobby ID
        //TODO: Later, we should add ability to select game style, map, and amount of players
        var lobbyData = createLobby(this, data);
        sendLobbyID(
            {
                lobbyName: players[this.id].getName(),
                lobbyID: this.id,
                owner: players[this.id].getName()
            }
        );
        socket.broadcast.emit('updatedLobbies', getLobbyList());
        socket.join(socket.id);
        console.log("This lobby has been made:" + lobbyData.getName());
        sendLobbyList(socket, this.id);
    });

    socket.on('requestForLobbies', function(){
        console.log('requesting a lobby' + lobbies);
        socket.emit('updatedLobbies', getLobbyList());
        //need to return an array of lbby id's not actual lobby objects
    });

    socket.on('playerLeaveLobby', function(data) {
        playerLeaveLobby(socket);
    });

    socket.on('playerJoinLobby', function(lobbyID, joinLobby) {
        //data has to be lobby id
        socket.join(lobbyID);
        joinLobby({
            lobbyName: lobbies[lobbyID].getName(),
            lobbyID: lobbyID,
            owner: players[lobbies[lobbyID].getOwner()].getName()
        });
        lobbies[lobbyID].addPlayer(players[socket.id], socket);
    });

    socket.on('lobbyGetPlayers', function(lobbyID) {
        sendLobbyList(socket, lobbyID)
    })
});


function createLobby(playerSocket, data) {
    lobbies[playerSocket.id] = new Lobby(io, players[playerSocket.id].getName(), 1, players[playerSocket.id]);
    return lobbies[playerSocket.id];
}

function getLobbyList() {
    var tempLobbies = [];
    for(var lobby in lobbies) {
        if(players.hasOwnProperty(lobby)){
            tempLobbies.push(lobbies[lobby].getLobbyID());
        }
    }
        return tempLobbies;
}

function sendLobbyList(socket, lobbyID) {
    io.to(lobbyID).emit('lobbyPlayers', lobbies[lobbyID].emitPlayers(this));
}

function playerLeaveLobby(socket) {
    var lobbyID = players[socket.id].getLobby();
    if(lobbyID === socket.id){

        lobbies[lobbyID].closeLobby();
    }
    lobbies[lobbyID].removePlayer(socket.id);
}

http.listen(3000, '0.0.0.0', function(){
    console.log('listening on *:3000');
});
