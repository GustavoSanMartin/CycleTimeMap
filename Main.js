var map;
var marker = false; //is there an active marker on the screen?
var origin = null;
var directionsService = null;
var dest = null;
var commuteTime = "0";
var currentOriginLocation = null;

function initMap() {


    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.4085, lng: -75.700},
        zoom: 13
    });

    origin = new google.maps.LatLng(45.4085, -75.700);
    directionsService = new google.maps.DirectionsService();

    //Listen for any clicks on the map.
    google.maps.event.addListener(map, 'click', function(event) {
        //Get the location that the user clicked.
        var destLocation = event.latLng;

        //If the marker hasn't been added.
        if(marker === false){
            //Create the marker.
            marker = new google.maps.Marker({
                position: destLocation,
                map: map,
                draggable: true //make it draggable
            });

            //drag listener for marker
            google.maps.event.addListener(marker, 'dragend', function(event){
                markerLocation();
            });
        } else{
            //Marker has already been added, so just change its location.
            marker.setPosition(destLocation);
        }
        //Get the marker's location.
        markerLocation();
    });


}

/**
 * every time the marker's position changes
 */
function markerLocation(){
    //Get location.
    var currentLocation = marker.getPosition();
    dest = currentLocation;
    //console.log(dest);
    //Add lat and lng values to a field that we can save.

    document.getElementById('lat').value = currentLocation.lat(); //latitude
    document.getElementById('lng').value = currentLocation.lng(); //longitude
}

/**
 * When the calculate button is pressed
 * Calculates time to destination
 */
function calcRoute() {

    var travelMode = document.getElementById("travelMode").value;
    //console.log(travelMode);
    //console.log(dest, "yo");
    if (!dest){
        return;
    }
    var count = 0;
    for (var lat = 45.41; lat < 45.43; lat+=0.005){
        for (var long = -75.7; long < -75.65; long+=0.005) {
            count++;
            console.log(count);
            currentOriginLocation = new google.maps.LatLng(lat, long);

            var request = {
                origin: currentOriginLocation,
                destination: dest,
                travelMode: travelMode
            };
            directionsService.route(request, function (result, status) {
                if (status === 'OK') {
                    commuteTime = result.routes[0].legs[0].duration.text;
                    console.log(commuteTime);
                    addMarker(result.request.origin.location, commuteTime);
                }
                else if (status==='OVER_QUERY_LIMIT'){
                    console.log("before");
                    sleep(2000);
                    console.log("after");
                }
            });

        }
    }


}
function addMarker(location, time) {
    console.log(time);
    new google.maps.Marker({
        position: location,
        label: time,
        map: map
    });
}
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

//Load the map when the page has finished loading.
google.maps.event.addDomListener(window, 'load', initMap);