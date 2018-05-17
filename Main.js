var map;
var marker = false; //is there an active marker on the screen?
var directionsService = null;
var dest = null;
var commuteTime = "0";
var currentOriginLocation = null;

/**
 * Called from html file
 * Creates a new instance for the map API and directions API.
 */
function initMap() {
    //create an instance of the map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.4085, lng: -75.700},
        zoom: 13
    });

    //create an instance of the directions API
    directionsService = new google.maps.DirectionsService();

    //Listen for any clicks on the map.
    google.maps.event.addListener(map, 'click', function(event) {
        //Get the location of where the user clicked
        var destLocation = event.latLng;

        //If there is no marker on the screen already
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
        //display and save the marker's coordinates
        markerLocation();
    });
}

/**
 * Called every time the marker's position changes. Display coordinates on the screen.
 */
function markerLocation(){
    //Get location.
    dest = marker.getPosition();

    //display the marker's coordinates on the screen
    document.getElementById('lat').value = dest.lat(); //latitude
    document.getElementById('lng').value = dest.lng(); //longitude
}

/**
 * When the calculate button is pressed
 * Calculates time to destination
 */
function calcRoute() {
    var travelMode = document.getElementById("travelMode").value;

    if (!dest){
        return;
    }
    //loop through the map coordinates in the given area
    for (var lat = 45.41; lat < 45.43; lat+=0.005){
        for (var long = -75.7; long < -75.65; long+=0.005) {
            currentOriginLocation = new google.maps.LatLng(lat, long);

            //directions request
            var request = {
                origin: currentOriginLocation,
                destination: dest,
                travelMode: travelMode
            };
            directionsService.route(request, function (result, status) {
                console.log(status);
                //direction results returned successfully
                if (status === 'OK') {
                    commuteTime = result.routes[0].legs[0].duration.text;
                    addMarker(result.request.origin.location, commuteTime);
                }
                //API was called too many times in 1 second
                else if (status==='OVER_QUERY_LIMIT'){
                    sleep(2000); //wait until allowed to make more API calls
                }
            });

        }
    }
}

/**
 * Adds a marker to the map
 * @param location Google LatLng location object
 * @param label Text to be displayed next to marker
 */
function addMarker(location, label) {
    new google.maps.Marker({
        position: location,
        label: label,
        map: map
    });
}

/**
 * Freezes all processes
 * @param milliseconds How long to freeze for
 */
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}