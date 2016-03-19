var Player = function (pName, pSocketID, userSocket) {
    var name = pName;
    var socketID = pSocketID;
    var socket = userSocket;
    var x;
    var y;
    var dir;
    var lives = 3;
    //IF lobby ID  = 0, no lobby
    var lobbyID = 0;

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
        return name;
    };

    var getLives = function(){
      return lives;
    };
    //didnt call it setLives, b/c its not a real setter
    var modifyLives = function(livesDifference){
      lives += livesDifference;
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
        modifyLives: modifyLives,
        getLives: getLives,
        setDir: setDir,
        setName: setName,
        socketID: socketID,
        joinLobby: joinLobby,
        leaveLobby: leaveLobby,
        getLobby: getLobby,
        socket: socket
    };
};

module.exports = Player;
