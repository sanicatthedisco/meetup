var socket = io();

var userfield = document.getElementById("user");
var passfield = document.getElementById("password");
var submitButton = document.getElementById("submit-button");
var loginText = document.getElementById("login-text");
var errorText = document.getElementById("error");

function submitLogin() {
    socket.emit("login request", {username: userfield.value, password: passfield.value});
}

function remove(element) {
    element.parentNode.removeChild(element);
}

socket.on("login success", function(data) {
    userfield.hidden = true;
    passfield.hidden = true;
    submitButton.hidden = true;
    errorText.hidden = true;
    
    loginText.hidden = false;
    loginText.innerHTML = "Welcome, " + data.name;
});

socket.on("login failure", function(data) {
    errorText.hidden = false;
    errorText.innerHTML = data.reason;
});