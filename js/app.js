
var locations = [
  {title: 'Animal Kingdom', location: {lat: 28.359719, lng: -81.591313}},
  {title: 'Crayola Experience', location: {lat: 28.444446, lng: -81.392147}},
  {title: 'Disney Springs', location: {lat: 28.370256, lng: -81.520992}},
  {title: 'Epcot', location: {lat: 28.374694, lng: -81.549404}},
  {title: 'Fun Spot', location: {lat: 28.467182, lng: -81.455851}},
  {title: 'Gatorland', location: {lat: 28.355867, lng: -81.404632}},
  {title: 'Hollywood Studios', location: {lat: 28.357529, lng: -81.558271}},
  {title: 'Magic Kingdom Park', location: {lat: 28.417663, lng: -81.581212}},
  {title: 'SeaWorld', location: {lat: 28.411445, lng: -81.461695}},
  {title: 'The Holy Land Experience', location: {lat: 28.495359, lng: -81.433127}},
  {title: 'The Wizarding World of Harry Potter', location: {lat: 28.480228, lng: -81.470026}},
  {title: 'Universal Studios Florida', location: {lat: 28.473507, lng: -81.466775}},
  {title: 'Universal\'s Islands of Adventure', location: {lat: 28.471049, lng: -81.471848}},
];


var Location = function(data) {
	this.title = ko.observable(data.title);
	this.position = ko.observable(data.location);
	this.latitude = ko.observable(data.location.lat);
	this.longitude = ko.observable(data.location.lon);
}

// Foursquare API keys
var foursquare_client_id = "PJL50SVLNLN5UUXVEFUE1DGWEZIORWO0OZTVZAONZRSRWEJI";
var foursquare_client_secret = "YDP12OIE42GZU4H2GRALF404HTYC04T3UYZV4LCES2JODEML";


var viewModel = function() {

	var self = this;

	this.locationList = ko.observableArray([]);
	this.infoWindow = ko.observable();
	this.searchQuery = ko.observable();
	this.shouldShowSidebar = ko.observable(true);

	// add each location to the locationList
	locations.forEach(function(locationItem) {
		self.locationList.push( new Location(locationItem) );
	});

	// highlight location when list item is clicked
	this.highlightLocation = function(clickedLocation) {

		// determine which location was clicked
		self.locationList().forEach(function (locationItem, i) {
			//markers[i].close();
			if (locationItem.title() == clickedLocation.title()) {
				// center the map
				var position = markers[i].getPosition();
				map.panTo(position);

				// animate the marker
				toggleBounce(markers[i]);

				// show popup info window
				populateInfoWindow(markers[i], singleInfoWindow);
			}
		});
	}

	// toggle sidebar view when screen is minimized
	this.toggleSidebar = function () {
		if (this.shouldShowSidebar()) {
			this.shouldShowSidebar(false);
		}
		else {
			this.shouldShowSidebar(true);
		}
	}

	// filter locations by search input
	this.filterLocations = ko.computed(function() {
		var filter = self.searchQuery();

		// if no filter, display all locations
	    if (!filter) {
	    	// turn on all markers
	    	for (var i = 0; i < markers.length; i++) {
			  markers[i].setMap(map);
			}
			// display all locations
	        return self.locationList();
	    } else {

	    	// filter list by input search
	        return ko.utils.arrayFilter(self.locationList(), function(item, i) {

	            if ( item.title().toLowerCase().includes(filter.toLowerCase()) ) {
	            	// display marker for matching location title
	            	markers[i].setMap(map);
	            	return true;
	            }
	            else {
	            	// hide marker from map
	            	markers[i].setMap(null);
	            }
	        });
	    }
	});

}

ko.applyBindings(new viewModel());

