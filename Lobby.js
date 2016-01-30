var Lobby = function (startName, startMapID, startOwner) {

    var name = startName;
    var mapID = startMapID;
    var owner = startOwner;
    var players = [];
    //stores the socket id for easy lookup

    var getName = function () {
        return name
    };

    var getOwner = function () {
        return owner;
    };

    var setName = function (newName) {
        name = newName;
    };

    var setName = function (newOwner) {
        owner = newOwner;
    };

    var addPlayer = function(newPlayer) {

    };

    var removePlayer= function(name) {
        this.name = name;
    }

    // Define which variables and methods can be accessed
    return {
        getName: getName,
        getOwner: getOwner,
        setName: setName,
        setOwner: setOwner
    }
}

module.exports = Lobby;
