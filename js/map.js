var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 28.385233, lng: -81.563874},
	  zoom: 14,
	  mapTypeControl: false
	});

	var largeInfowindow = new google.maps.InfoWindow();

	// display listings on page load
	createMapMarkers(locations);
	showListings();
}


function createMapMarkers(locations) {
		// The following group uses the location array to create an array of markers on initialize.
	for (var i = 0; i < locations.length; i++) {
	  // Get the position from the location array.
	  var position = locations[i].location;
	  var title = locations[i].title;
	  // Create a marker per location, and put into markers array.
	   var marker = new google.maps.Marker({
	    position: position,
	    title: title,
	    animation: google.maps.Animation.DROP,
	    id: i
	  });
	  // Push the marker to our array of markers.
	  markers.push(marker);
	  // Create an onclick event to open an infowindow at each marker.
	  marker.addListener('click', function() {
	  	var infowindow = new google.maps.InfoWindow();
	    populateInfoWindow(this, infowindow);
	  });
	}
}


// This function will loop through the markers array and display them all.
function showListings() {
	var bounds = new google.maps.LatLngBounds();
	// Extend the boundaries of the map for each marker and display the marker
	for (var i = 0; i < markers.length; i++) {
	  markers[i].setMap(map);
	  bounds.extend(markers[i].position);
	}
	map.fitBounds(bounds);
}
