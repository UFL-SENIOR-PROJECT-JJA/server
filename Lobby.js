var Lobby = function (io, startName, startMapID, startOwner) {

    var name = startName; //lobby name
    var mapID = startMapID; //map gets an ID
    var owner = startOwner.socketID; //Owners ID is stored here
    var lobbyID = owner;
    startOwner.joinLobby(owner);
    var players = {}; //Object to hold players
    players[owner] = startOwner; //Storing Owners Player Object
    var numPlayers = 1; //Starting with owner in the game
    var monsters = [];
    //stores the socket id for easy lookup



    var getName = function () {
        return name;
    };

    var getOwner = function () {
        return owner;
    };

    var setName = function (newName) {
        name = newName;
    };

    var setOwner = function (newOwner) {
        removePlayer(owner); //removing old owner via socketID
        owner = newOwner.socketID; //set new owner
        players[owner] = newOwner; //add new owner
    };

    var addPlayer = function(newPlayer, socket) {
        //Im passing a socket, so that I can communicate to me and others!
        if(numPlayers < 4 && players[newPlayer.socketID] === undefined) {
            newPlayer.joinLobby(lobbyID);
            socket.join(lobbyID);
            players[newPlayer.socketID] = newPlayer;

            ++numPlayers;

            alertPlayers("playerJoined", newPlayer);
            //emitPlayers(socket);
        }

    };

    var emitPlayers = function(socket) {
        for(var player in players) {
            if(players.hasOwnProperty(player)) {
                console.log("Adding player to my game: " + players[player].getName());
                socket.emit('onPlayerConnect', {
                    id: players[player].socketID,
                    name: players[player].getName(),
                    x: players[player].getX(),
                    y: players[player].getY(),
                    dir: players[player].getDir()
                });
            }
        }
    };

    var removePlayer = function(playerSocketID) {
        if(players[playerSocketID] !== undefined) {
            players[playerSocketID].leaveLobby();
            io.to(players[playerSocketID]).leave(lobbyID);
            delete players[playerSocketID];
            --numPlayers;
            return true;
        }else {
            return false;
        }

    };

    var closeLobby = function() {
        for(var player in players) {
            if(players.hasOwnProperty(player)) {
                io.to(players[player].socketID).emit("kicked");
            }
        }

        //
    }

    var alertPlayers = function(status, data) {
        if(status == "playerJoined") {
            var newPlayer = {
                id: data.socketID,
                name: data.getName(),
                x: data.getX(),
                y: data.getY(),
                dir: data.getDir()
            }
            io.to(lobbyID).emit("onPlayerConnect", newPlayer);
        }
    };

    var getLobbyID = function() {
        return lobbyID;
    }


    // Define which variables and methods can be accessed
    return {
        getName: getName,
        getOwner: getOwner,
        setName: setName,
        setOwner: setOwner,
        addPlayer: addPlayer,
        removePlayer: removePlayer,
        closeLobby: closeLobby,
        getLobbyID: getLobbyID,
        emitPlayers: emitPlayers
    };
};

module.exports = Lobby;
