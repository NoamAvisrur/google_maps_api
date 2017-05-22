var map;

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 31.645051,
            lng: 34.776718
        },
        zoom: 8
    });

    document.querySelector('#Location').addEventListener('click', function(e) {
        document.querySelector('.search_routes').classList.add("hide");
        document.querySelector('.add_markers').classList.add("hide");
        document.getElementById('right-panel').style.display = 'none';
        map.setZoom(12);
        showLocation();
    });

    document.querySelector('#Markers').addEventListener('click', function(e) {
        document.querySelector('.add_markers').classList.remove("hide");
        document.querySelector('.add_markers').classList.add("show");
        document.getElementById('right-panel').style.display = 'none';
        document.querySelector('.search_routes').classList.add("hide");
        map.setZoom(8);
    });

    document.querySelector('#Routes').addEventListener('click', function(e) {
        document.querySelector('.search_routes').classList.remove("hide");
        document.querySelector('.search_routes').classList.add("show");
        document.querySelector('.add_markers').classList.add("hide");
        map.setZoom(8);
        navigator.geolocation.getCurrentPosition(function(position) {
            var latlng = {lat: position.coords.latitude, lng: position.coords.longitude};
            geocoder.geocode({'location': latlng}, function(results, status) {
                mySpot = (results[1].formatted_address);
            })
        })
    });

    infoWindow = new google.maps.InfoWindow;

    function setNewMarker(){
        var marker = new google.maps.Marker({
            position: {
                lat: 31.974233,
                lng: 34.781822
            },
            map: map,
            title: 'Rishon LeTsiyon city!'
        });
    }    

    function showLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                infoWindow.setPosition(pos);
                infoWindow.setContent('you are here');
                infoWindow.open(map);
                map.setCenter(pos);
            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            handleLocationError(false, infoWindow, map.getCenter());
        }
    }
    directionsDisplay.setMap(map);
    
    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        if (document.getElementById('start').value === "My Location"){
            var selectedOrigin = mySpot;
        }else{
            var selectedOrigin = document.getElementById('start').value;
        }
        calculateAndDisplayRoute(directionsService, directionsDisplay, selectedOrigin);
    });

    function calculateAndDisplayRoute(directionsService, directionsDisplay, selectedOrigin) {
        setDirectionsPanel();
        directionsService.route({
            origin: selectedOrigin,
            destination: document.getElementById('end').value,
            travelMode: document.getElementById('mode').value,
        }, function(response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
    
    document.querySelector('#marker').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log(document.getElementById('address').value);
        geocodeAddress(geocoder, map);
    });
    
    function geocodeAddress(geocoder, resultsMap) {
        var address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location
                });
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
    }
    
    function setDirectionsPanel() {
        var p = new Promise (function(resolve,rejet){
            resolve( directionsDisplay.setPanel(document.getElementById('right-panel')));
        })
        p.then(function(){
            document.getElementById('right-panel').style.display = 'block';
        })    
    }
}
