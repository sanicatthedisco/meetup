function initMap() {
    var nyc = {lat: 40.787867, lng: -73.975370};
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: nyc
    });
    
    createMarker(nyc, map);
}

function createMarker(pos, map) {
    var marker = new google.maps.Marker({
        position: pos,
        map: map
    });
}