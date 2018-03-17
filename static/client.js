var socket = io();
var userfield = document.getElementById("user");
var passfield = document.getElementById("password");


function submitLogin() {
    socket.emit("login request", {username: userfield.value, password: passfield.value});
}