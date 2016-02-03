var Lobby = function (startName, startMapID, startOwner) {

    var name = startName; //lobby name
    var mapID = startMapID; //map gets an ID
    var owner = startOwner.socketID; //Owners ID is stored here
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
            players[newPlayer.socketID] = newPlayer;
            ++numPlayers;
        }
    };

    var removePlayer= function(playerSocketID) {
        if(players[playerSocketID] !== undefined) {
            delete players[playerSocketID];
            --numPlayers;
            return true;
        }else {
            return false;
        }

    };

    // Define which variables and methods can be accessed
    return {
        getName: getName,
        getOwner: getOwner,
        setName: setName,
        setOwner: setOwner,
        addPlayer: addPlayer,
        removePlayer: removePlayer
    };
};

module.exports = Lobby;
