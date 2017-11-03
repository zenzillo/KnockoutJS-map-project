
var locations = [
  {title: 'Magic Kingdom Park', location: {lat: 28.417663, lng: -81.581212}},
  {title: 'Epcot', location: {lat: 28.374694, lng: -81.549404}},
  {title: 'Disney Springs', location: {lat: 28.370256, lng: -81.520992}},
  {title: 'Hollywood Studios', location: {lat: 28.357529, lng: -81.558271}},
  {title: 'Animal Kingdom', location: {lat: 28.359719, lng: -81.591313}}
];


var Location = function(data) {
	this.title = ko.observable(data.title);
	this.position = ko.observable(data.location);
	this.latitude = ko.observable(data.location.lat);
	this.longitude = ko.observable(data.location.lon);
}


var viewModel = function() {

	var self = this;

	this.locationList = ko.observableArray([]);
	this.infoWindow = ko.observable();

	// add each location to the locationList
	locations.forEach(function(locationItem) {
		self.locationList.push( new Location(locationItem) );
	});

	// highlight locaction when list location is clicked
	this.highlightLocation = function(clickedLocation) {
		// determine which location was clicked
		self.locationList().forEach(function (locationItem, i) {
			//markers[i].close();
			if (locationItem.title() == clickedLocation.title()) {
				// center the map
				var position = markers[i].getPosition();
				map.panTo(position);

				// animate the marker
				// show popup info window
				populateInfoWindow(markers[i], singleInfoWindow);
			}
		});
	}


}

ko.applyBindings(new viewModel());

