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

    var addPlayer = function(newPlayer) {
        if(numPlayers < 4 && players[newPlayer.socketID] === undefined) {
            newPlayer.joinLobby(lobbyID);
            io.to(newPlayer.socketID).join(lobbyID)
            players[newPlayer.socketID] = newPlayer;

            ++numPlayers;
        }
        testMessage();
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

    var testMessage = function() {
        io.to(lobbyID).emit("lobby");
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
        getLobbyID: getLobbyID
    };
};

module.exports = Lobby;
