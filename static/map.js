var myLocation = {lat: 40.814766, lng: -73.954857};

function initMap() {
    var nyc = {lat: 40.787867, lng: -73.975370};
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: myLocation
    });
    
    createMarker(myLocation, map);
}

function createMarker(pos, map) {
    var marker = new google.maps.Marker({
        position: pos,
        map: map
    });
}