var map;
var singleInfoWindow;
// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
	// Constructor creates a new map - only center and zoom are required.
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 28.385233, lng: -81.563874},
	  zoom: 14,
	  mapTypeControl: false
	});

	singleInfoWindow = new google.maps.InfoWindow();

	// display listings on page load
	createMapMarkers(locations);
	showListings();
}


function createMapMarkers(locations) {
	// The following group uses the location array to create an array of markers on initialize.
	for (var i = 0; i < locations.length; i++) {
	  // Get the position from the location array.
	  var position = locations[i].location;
	  //var title = locations[i].title;
	  // Create a marker per location, and put into markers array.
	   var marker = new google.maps.Marker({
	    position: position,
	    latitude: locations[i].location.lat,
	    longitude: locations[i].location.lng,
	    title: locations[i].title,
	    animation: google.maps.Animation.DROP,
	    id: i
	  });
	  // Push the marker to our array of markers.
	  markers.push(marker);
	  // Create an onclick event to open an infowindow at each marker.
	  marker.addListener('click', function() {
		// center the map
		var position = this.getPosition();
		map.panTo(position);
		// show popup window
	    populateInfoWindow(this, singleInfoWindow);
	  });
	}
}


// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {

	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
	    infowindow.marker = marker;

		// Query Foursquare API for location details
		$.ajax({
		    url:'https://api.foursquare.com/v2/venues/search',
		    data: {
		    	client_id: "PJL50SVLNLN5UUXVEFUE1DGWEZIORWO0OZTVZAONZRSRWEJI",
		    	client_secret: "YDP12OIE42GZU4H2GRALF404HTYC04T3UYZV4LCES2JODEML",
		    	v: "20130815",
		    	ll: marker.latitude + "," + marker.longitude,
		    	query: marker.title
		    },
		    success:function(locationData) {
		    	// add location details to info window
		        console.dir(locationData.response.venues[0]);
		        var venue = locationData.response.venues[0];
		        var details = '<b>' + venue.name + '</b>';
		        details += '<p>' + venue.location.formattedAddress[0] + '<br>';
		        details += venue.location.formattedAddress[1] + '<br>';
		        details += venue.location.formattedAddress[2] + '</p>';
		        details += '<a href="' + venue.url + '" target="_blank">' + venue.url + '</a>';
		        if (venue.rating) {
		        	details += '<b> Rating: </b>' + venue.rating;
		        }
		        if (venue.popular) {
		        	details += '<b> Popular: </b>' + venue.popular;
		        }
		        console.log(details);
		        infowindow.setContent('<div>' + details + '</div>');
	    		infowindow.open(map, marker);
		        //$('article').text('Hello '+locationData.response.user.firstName);
		    },
		    error: function(jqXHR, textStatus, errorThrown){
		    	// show pleasant error
		        console.error(errorThrown);
		        var details = '<b>' + marker.title + '</b>';
		        details += '<p>Sorry there was an error loading additional information.</p>';
		        infowindow.setContent('<div>' + details + '</div>');
	    		infowindow.open(map, marker);
		    }
		});

	    // Make sure the marker property is cleared if the infowindow is closed.
	    infowindow.addListener('closeclick', function() {
	    	infowindow.marker = null;
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
