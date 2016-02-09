var Player = function (pName, pSocketID) {
    var name = pName;
    var socketID = pSocketID;
    var x;
    var y;
    var dir;
    //IF lobby ID  = 0, no lobby
    var lobbyID = 0;
    console.log("Creating new player with name " + name + " id: " + socketID);

  // Getters and setters
    var getX = function () {
        return x;
    };

    var getY = function () {
        return y;
    };

    var getDir = function () {
        return dir;
    };

    var getName = function () {
        console.log("Trying to get this.name " + name);
        return name;
    };
    var setX = function (x) {

        x = x;
    };

    var setY = function (y) {
        y = y;
    };

    var setDir = function (newDir) {
        dir = newDir;
    };

    var setName = function (newName) {
        name = newName;
    };

    var joinLobby = function(id) {
        lobbyID = id;
    };

    var leaveLobby = function() {
        lobbyID = 0;
    };

    var getLobby = function() {
        return lobbyID;
    };

    // Define which variables and methods can be accessed
    return {
        getX: getX,
        getY: getY,
        getDir: getDir,
        getName: getName,
        setX: setX,
        setY: setY,
        setDir: setDir,
        setName: setName,
        socketID: socketID,
        joinLobby: joinLobby,
        leaveLobby: leaveLobby,
        getLobby: getLobby
    };
};

module.exports = Player;
