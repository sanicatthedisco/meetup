var socket = io();

var userfield = document.getElementById("user");
var passfield = document.getElementById("password");
var submitButton = document.getElementById("submit-button");
var loginText = document.getElementById("login-text");
var errorText = document.getElementById("error");

var friendfield = document.getElementById("friend");

var friends = document.getElementById("friend-list");
var group = document.getElementById("group-list");

function submitLogin() {
    socket.emit("login request", {username: userfield.value, password: passfield.value});
}

function addFriend() {
    socket.emit("add friend request", {friendName: friendfield.value});
}

function remove(element) {
    element.parentNode.removeChild(element);
}

function updateFriendList(friendList) {
    friends.innerHTML = ''; //delete all child elements
    var li;
    var text;
    var button;
    for (var i = 0; i < friendList.length; i ++) {
        li = document.createElement("li");
        text = document.createTextNode(friendList[i]);
        
        button = document.createElement("button");
        button.onclick = function() {addToGroup(friendList[i]);};
        button.innerHTML = "Add to group";
        
        li.appendChild(text);
        li.appendChild(button);
        friends.appendChild(li);
    }
}

function updateGroup(groupMembers) {
    group.innerHTML = '';
    var li;
    var text;
    for (var i = 0; i < groupMembers.length; i ++) {
        li = document.createElement("li");
        text = document.createTextNode(groupMembers[i]);
        li.appendChild(text);
        group.appendChild(li);
    }
}

function addToGroup(friend) {
    socket.emit("add to group", friend);
}

socket.on("login success", function(data) {
    userfield.hidden = true;
    passfield.hidden = true;
    submitButton.hidden = true;
    errorText.hidden = true;
    
    loginText.hidden = false;
    loginText.innerHTML = "Welcome, " + data.name;
    
    updateFriendList(data.friends);
});

socket.on("login failure", function(data) {
    errorText.hidden = false;
    errorText.innerHTML = data.reason;
});

socket.on("update group", function () {
   socket.emit("group info request"); 
});

socket.on("group info", function(group) {
   updateGroup(group); 
});