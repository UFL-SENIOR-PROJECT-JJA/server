var Player = function (name, startX, startY, startDir, socket) {

    var name = name;
    var x = startX;
    var y = startY;
    var dir = startDir;
    //stores the socket id for easy lookup
    var socket = socket;

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
        return name
    };

    var setX = function (newX) {
        x = newX;
    };

    var setY = function (newY) {
        y = newY;
    };

    var setDir = function (newDir) {
        dir = newDir;
    };

    var setName = function (newName) {
        name = newName;
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
        socket: socket
    }
}

module.exports = Player;
