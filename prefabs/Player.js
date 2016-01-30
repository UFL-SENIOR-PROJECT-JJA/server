var Player = function (name, socketID) {
    console.log("Creating new player with name " + name + " id: " + socketID);

    var x;
    var y;
    var dir;

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
        console.log("Trying to get this.name " + name)
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
        socketID: socketID
    };
};

module.exports = Player;
