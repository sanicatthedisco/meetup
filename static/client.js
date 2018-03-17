var socket = io();

var userfield = document.getElementById("username");
var passfield = document.getElementById("password");
var submitButton = document.getElementById("submit");
var loginText = document.getElementById("login-text");
var errorText = document.getElementById("error");
var label = document.getElementById("label");

var friendfield = document.getElementById("friend");

var friends = document.getElementById("friend-list");
var group = document.getElementById("group-list");

var friendContainer = document.getElementById("friendscontainer");
var groupContainer = document.getElementById("groupcontainer");
var placesTable = document.getElementById("placestable");

var places;

function submitLogin() {
    socket.emit("login request", {username: userfield.value, password: passfield.value, location: myLocation});
}

function addFriend() {
    socket.emit("add friend request", {friendName: friendfield.value});
}

function remove(element) {
    element.parentNode.removeChild(element);
}

function updateFriendList(friendList) {
    friendContainer.hidden = false;
    friends.innerHTML = ''; //delete all child elements
    var li;
    var text;
    var button;
    for (var i = 0; i < friendList.length; i ++) {
        li = document.createElement("li");
        text = document.createElement("p");
        text.innerHTML = friendList[i];
        
        button = document.createElement("button");
        button.setAttribute("onClick", "javascript: addToGroup('" + friendList[i] + "');");
        button.innerHTML = "+";
        
        text.appendChild(button);
        li.appendChild(text);
        friends.appendChild(li);
    }
}

function updateGroup(groupMembers) {
    groupContainer.hidden = false;
    group.innerHTML = '';
    var li;
    var text;
    for (var i = 0; i < groupMembers.length; i ++) {
        li = document.createElement("li");
        text = document.createElement("p");
        text.innerHTML = groupMembers[i];
        li.appendChild(text);
        group.appendChild(li);
    }
}

function updatePlaces(places) {
    placesTable.innerHTML = '';
    var tr1 = document.createElement("tr");
    var tr2 = document.createElement("tr");
    var trs = [tr1, tr2];
    
    var tds = [];
    var td;
    var inner;
    for (var i = 0; i < 8; i ++) {
        td = document.createElement("td");
        inner = document.createElement("p");
        console.log(places);
        console.log(places[3]);
        inner.innerHTML = "<span id='name'>"+places[i].name+"</span><span id='rating'>"+places[i].rating+"</span>";
        td.appendChild(inner);
        
        if (i < 4) {
            tr1.appendChild(td);
        } else {
            tr2.appendChild(td);
        }
    }
    
    placesTable.appendChild(tr1);
    placesTable.appendChild(tr2);
    
}

function addToGroup(username) {
    socket.emit("add to group", username);
}

socket.on("login success", function(data) {
    userfield.hidden = true;
    passfield.hidden = true;
    submitButton.hidden = true;
    errorText.hidden = true;
    label.hidden = true;
    
    loginText.hidden = false;
    loginText.innerHTML = "Welcome, " + data.name;
    
    updateFriendList(data.friends);
});

socket.on("login failure", function(data) {
    errorText.hidden = false;
    errorText.innerHTML = data.reason;
});

socket.on("update group", function () {
    console.log("sending request for group info");
    socket.emit("group info request"); 
});

socket.on("update friends", function (friendList) {
    updateFriendList(friendList);
});

socket.on("group info", function(group) {
    updateGroup(group.map(s => s.username));
    
    locations = group.map(s => s.location);
    locations.push(myLocation);
    deleteMarkers();
    for (var i = 0; i < locations.length; i ++) {
        addRedMarker(locations[i]);
    } 
    var centroid = getCentroid(locations)
    $.getJSON('https://roads.googleapis.com/v1/nearestRoads?points=' + centroid.lat + ',' + centroid.lng + '&key=AIzaSyDL6o7CtQ4z8bruFgK2EvhYWgHPTdfU6gw', function(data) {
        centroidRoadId = data["snappedPoints"][0]["placeId"];
        centroidRoadLocation = {lat: data["snappedPoints"][0]["location"]["latitude"], lng: data["snappedPoints"][0]["location"]["longitude"]};
        addBlueMarker(centroidRoadLocation);
        
        var request = {
            location: centroidRoadLocation,
            radius: 500,
            type: ["restaurant"]
        };

        places = [];

        service.nearbySearch(request, function (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < 8; i ++) {
                    places.push({location: results[i].geometry.location, name: results[i].name, rating: results[i].rating});
                }
            }
            console.log(places);
            updatePlaces(places);
        });
    });
});

function getCentroid(coords) {
    var lats = coords.map(e => e.lat);
    var longs = coords.map(e => e.lng);
    console.log(longs);
    return {lat: avg(lats), lng: avg(longs)};
}

function avg(array) {
    var s = 0;
    for (var i = 0; i < array.length; i ++) {
        s = s + array[i];
    }
    return s / array.length;
}