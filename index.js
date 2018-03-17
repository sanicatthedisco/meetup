var express = require("express");
var app = express();
var http = require("http").Server(app);
var path = require("path");
var io = require("socket.io")(http);
var mysql = require("mysql");

// init server

app.use(express.static(path.join(__dirname, "static")));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

http.listen(3000, function () {
    console.log("Listening on port 3000");
})

//socket stuff

var loginSuccess;
var foundFriend;
var clients = [];

io.on("connection", function(socket) {
    console.log("A user has connectd with the id of " + socket.id);
    clients.push(socket);
    socket.loggedIn = false;
    socket.friends = [];
    socket.group = [];
    socket.inGroup = false;
    
    socket.on("disconnect", function () {
        clients.splice(clients.indexOf(socket), 1);
    });
    
    socket.on("login request", function(credentials) {
        con.query("SELECT * FROM login_info", function(err, result, fields) {
            if (err) throw err;
            
            loginSuccess = false;
            
            for (var i = 0; i < result.length; i ++) {
                if (result[i]["username"] == credentials.username && result[i]["password"] == credentials.password) {
                    loginSuccess = true;
                    socket.name = result[i]["name"];
                    socket.username = credentials.username;
                    socket.loggedIn = true;
                }
            }
            
            if (loginSuccess) {
                //get user's friends
                var sql = "SELECT friend FROM friends WHERE username = '" + credentials.username + "'";
                con.query(sql, function(err, result) {
                    if (err) throw err;
                    for (var i = 0; i < result.length; i ++) {
                        socket.friends.push(result[i]["friend"]);
                    }
                    
                    //send info to client (inside of query so it waits for completion)
                    socket.emit("login success", {
                        username: credentials.username,
                        name: socket.name,
                        friends: socket.friends

                    });
                });
            } else {
                socket.emit("login failure", {
                    reason: "Incorrect username or password"
                });
            }
        });
    });
    
    socket.on("add friend request", function(data) {
        foundFriend = false;
        
        for (var i = 0; i < clients.length; i ++) {
            if (clients[i].loggedIn) {
                console.log(clients[i].username);
                console.log(data.friendName);
                if (clients[i].username == data.friendName && socket.loggedIn) {
                    foundFriend = true;
                    console.log("added " + data.friendName);
                    
                    //insert friend into sql database
                    var sql = "INSERT INTO friends (username, friend) VALUES ('" + socket.username + "','" + data.friendName + "')";
                    con.query(sql, function (err, result) {
                        if (err) throw err;
                    });
                    //do reverse for other friend
                    var sql = "INSERT INTO friends (username, friend) VALUES ('" + data.friendName + "','" + socket.username + "')";
                    con.query(sql, function (err, result) {
                        if (err) throw err;
                    });
                }
            }
        }
    });
    
    socket.on("add to group", function(friendUsername) {
        socket.inGroup = true;
        var friendSocket = getSocket(friendUsername, clients);
        if (!(friendSocket in socket.group) && !friendSocket.inGroup) {
            for (var i = 0; i < socket.group.length; i ++) {
                friendSocket.group.push(socket.group[i]); //add all members of group to friendSocket's group
                socket.group[i].group.push(friendSocket); //add friendSocket to all group member's groups
            }
            friendSocket.group.push(socket); //add myself to friendSocket's group (because groups dont include the socket)
            socket.group.push(friendSocket); //add friendSocket to my group
        } else {
            console.log("Tried to add a socket to a group where it already was or socket is already in group");
        }
        
        for (var i = 0; i < socket.group.length; i ++) {
            socket.group[i].emit("update group");
        }
    });
    
    socket.on("group info request", function() {
        socket.emit("group info", socket.group); 
    });
});

function getSocket(username, sockets) {
    for (var i = 0; i < sockets.length; i ++) {
        if (sockets[i].loggedIn) {
            if (sockets[i].username == username) {
                return sockets[i];
            }
        }
    }
    return null;
}

//sql stuff

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pass",
    database: "meetup"
});

con.connect(function(err) {
    if (err) throw err;
});