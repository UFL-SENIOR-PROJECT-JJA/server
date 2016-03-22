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
    socket.on('onLogin', function(name, sendID){

        players[socket.id] = new Player(name, socket.id, this);
        ++numPlayers;
        var data = {
            id: socket.id,
            name: name,
            x: 37,
            y: 270,
            dir: 1
        };
        //callback to client, give them their connection information
        sendID(data);
    });

    socket.on('requestLobbyUsers', function(addPlayers) {
        var requestingPlayer = players[socket.id];
        var lobby = lobbies[requestingPlayer.getLobby()];
        getPlayersPrefabs(this, lobby.getLobbyID(), addPlayers);

    });

    //when player disconnect, they send a disconnect command
    socket.on('disconnect', function(){
        try {
            var disconnectingPlayer = players[this.id];
            console.log(players[this.id].getName() + "trying to disconnect");
            var lobbyID = players[socket.id].getLobby();
            if(lobbyID !== undefined) {
                        playerLeaveLobby(socket);
                        sendLobbyList(socket, lobbyID);
            };

            socket.broadcast.emit('onPlayerDisconnect', {
                id: disconnectingPlayer.socketID,
                name: disconnectingPlayer.getName()
            });
            //remove the player from the servers connected list
            console.log( disconnectingPlayer.getName() + " dicconnected");
            delete players[this.id];
            --numPlayers;
        }catch(e){
            console.log("Failed in disconnect method");
        }
    });

    //When player sends move packet, broadcast to channel (ie: this lobby)
    socket.on('onMove', function(data){
        console.log(data.name + ' moved');
        players[socket.id].setX(data.x);
        players[socket.id].setY(data.y);
        players[socket.id].setDir(data.dir);

        //socket.broadcast.emit('onOtherPlayerMove', data);  this would be to everyone
        socket.broadcast.to(players[socket.id].getLobby()).emit('onOtherPlayerMove', data);
    });

    socket.on('removeRemoteBullet', function(data){
        console.log("removing bullet with ID: " + data.uID);
        //foward bullet data to client so it can delete a client side bullet
        //socket.broadcast.emit('onDeleteBullet', data);
        socket.broadcast.to(players[socket.id].getLobby()).emit('onDeleteBullet', data);
    });

    socket.on('updatePlayerLives', function(data){
        console.log("modifying lives of : " + data.name + " by: " + data.numLives);
        players[socket.id].modifyLives(data.numLives);
        data.numLives = players[socket.id].getLives();
        //foward live data to client so it can make a client side reflect live changes
        //socket.broadcast.emit('onUpdateLives', data);
        socket.broadcast.to(players[socket.id].getLobby()).emit('onUpdateLives', data);
    });

    socket.on('onBulletFired', function(data){
        console.log(data.name + ' fired a bullet');
        //foward bullet data to client so it can make a client side bullet
        //socket.broadcast.emit('onReceiveBullet', data);
        socket.broadcast.to(players[socket.id].getLobby()).emit('onReceiveBullet', data);
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
        sendLobbyList(this, lobbyID)
    });

    socket.on('startLobby', function(lobbyID) {
        console.log("This is the lobbyID sent: " + lobbyID);
        startLobby(this, lobbyID);
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
    console.log("sending the updated lobbyList");
    console.log(lobbies[lobbyID]);
    io.to(lobbyID).emit('lobbyPlayers', lobbies[lobbyID].getPlayers(socket));
}

function getPlayersPrefabs(socket, lobbyID, addPlayers) {
    console.log("sending playerPrefabs");
    console.log(lobbies[lobbyID]);
    addPlayers(lobbies[lobbyID].getPlayers(socket));
}

function startLobby(socket, lobbyID) {
    console.log("telling users of lobby to start");
    lobbies[lobbyID].lobbyStarted = true;
    io.to(lobbyID).emit('startGame');
}

function playerLeaveLobby(socket) {
    var lobbyID = players[socket.id].getLobby();
    if(lobbyID === socket.id){
        lobbies[lobbyID].closeLobby();
    }else {
        lobbies[lobbyID].removePlayer(socket.id);
    }
}

http.listen(3000, '0.0.0.0', function(){
    console.log('listening on *:3000');
});
