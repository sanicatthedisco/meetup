var place = prompt("hi");

if (place == 1) {
    var myLocation = {lat: 40.805140, lng: -73.965169};
} else if (place == 2) {
    var myLocation = {lat: 40.820063, lng: -73.919886};
} else {
    var myLocation = {lat: 40.762423, lng: -73.925937};
}

var centroid = myLocation;
var locations = [];

var centroidRoadId;
var centroidRoadLocation;

var map;
var markers = [];

function initMap() {
    var nyc = {lat: 40.787867, lng: -73.975370};
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: myLocation
    });
    map.addListener("bluemarkerloc_changed", function () {
        createMarker(this.get("bluemarkerloc"), map, "blue");
    })
    map.addListener("redmarkerloc_changed", function () {
        createMarker(this.get("redmarkerloc"), map, "red");
    })
    createMarker(myLocation, map, "red");
}


function createMarker(pos, map, color) {
    var marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            strokeColor: color,
            scale: 10
        }
    });
    markers.push(marker);
}

function addBlueMarker(location) {
    map.set("bluemarkerloc", location)
}

function addRedMarker(location) {
    map.set("redmarkerloc", location)
}

function deleteMarkers() {
    for (var i = 0; i < markers.length; i ++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}