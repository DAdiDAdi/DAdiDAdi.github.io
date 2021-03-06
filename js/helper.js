
var HTMLheaderName = '<h1 id="name">%data%</h1>';
var HTMLheaderRole = '<span class="role" id="role">%data%</span><hr>';

var HTMLcontactGeneric = '<li class="flex-item"><span class="orange-text">%contact%</span><span class="white-text">%data%</span></li>';
var HTMLmobile = '<li class="flex-item"><span class="orange-text">mobile</span><span class="white-text">%data%</span></li>';
var HTMLemail = '<li class="flex-item"><span class="orange-text">email</span><span class="white-text">%data%</span></li>';
var HTMLtwitter = '<li class="flex-item"><span class="orange-text">twitter</span><span class="white-text">%data%</span></li>';
var HTMLgithub = '<li class="flex-item"><span class="orange-text">github</span><span class="white-text">%data%</span></li>';
var HTMLblog = '<li class="flex-item"><span class="orange-text">blog</span><span class="white-text">%data%</span></li>';
var HTMLlocation = '<li class="flex-item"><span class="orange-text">location</span><span class="white-text">%data%</span></li>';

var HTMLbioPic = '<img src="%data%" class="biopic">';
var HTMLwelcomeMsg = '<span class="welcome-message">%data%</span>';

var HTMLskillsStart = '<h3 id="skills-h3">Skills at a Glance:</h3><ul id="skills" class="flex-box"></ul>';
var HTMLskills = '<li class="flex-item"><span class="white-text">%data%</span></li>';

var HTMLworkStart = '<div class="work-entry"></div>';
var HTMLworkEmployer = '<a href="#">%data%';
var HTMLworkTitle = ' - %data%</a>';
var HTMLworkDates = '<div class="date-text">%data%</div>';
var HTMLworkLocation = '<div class="location-text">%data%</div>';
var HTMLworkDescription = '<p><br>%data%</p>';

var HTMLprojectStart = '<div class="project-entry"></div>';
var HTMLprojectTitle = '<a id="" href="#">%data%</a>';
var HTMLprojectDates = '<div class="date-text">%data%</div>';
var HTMLprojectDescription = '<p><br>%data%</p>';
var HTMLprojectImageContainerOpen = '<div class="row-lightbox"></div>';
var HTMLprojectImage = '<a href="%data%" data-lightbox="%data%" data-title="%caption%"><img src="%data%" width="107" height="75"></a>';

var HTMLschoolStart = '<div class="education-entry"></div>';
var HTMLschoolName = '<a href="#"> %data%';
var HTMLschoolDegree = '  -- %data%</a>';
var HTMLschoolDates = '<div class="date-text">%data%</div>';
var HTMLschoolLocation = '<div class="location-text">%data%</div>';
var HTMLschoolMajor = '<em><br>Major: %data%</em>';

var HTMLonlineStart = '<div class="onlineEd-entry"></div>';
var HTMLonlineClasses = '<h3>Online Classes</h3>';
var HTMLonlineTitle = '<a href="#">%data%';
var HTMLonlineSchool = '  - %data%</a>';
var HTMLonlineDates = '<div class="date-text">%data%</div>';
var HTMLonlineDesciption = '<br><p>%data%</p>';

var internationalizeButton = '<button>Internationalize</button>';
var googleMap = '<div id="map"></div>';




var map;    // declares a global map variable

function initializeMap() {
  var locations;
  var mapOptions = {
    disableDefaultUI: true
  };
  //
  map = new google.maps.Map(document.querySelector('#map'), mapOptions);


  //  locationFinder() returns an array of every location string from the JSONs
  function locationFinder() {
    var locations = [];
    locations.push(bio.contacts.location);

    /* iterates through school locations, adds them to locations array*/
    education.schools.forEach(function(school){
      locations.push(school.location);
    });

    /* iterates through work locations, adds them to locations array. */
    work.jobs.forEach(function(job){
      locations.push(job.location);
    });

    return locations;
  }

  /*
  createMapMarker(placeData) reads Google Places search results to create map pins.
  placeData is the object returned from search results containing information
  about a single location.
  */
  function createMapMarker(placeData) {
    var self = this;
    // The next lines save location data from the search result object to local variables
    var lat = placeData.geometry.location.lat();  // latitude from the place service
    var lon = placeData.geometry.location.lng();  // longitude from the place service
    var name = placeData.formatted_address;   // name of the place from the place service
    var bounds = window.mapBounds;            // current boundaries of the map window

    // marker is an object with additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name
    });

    // infoWindows are the little helper windows that open when you click
    // or hover over a pin on a map. They usually contain more information
    // about a location.
    var infoWindow = new google.maps.InfoWindow({
      content: name
    });

    self.openInfoWindow = function(marker, infoWindow){
      if(infoWindow.marker != marker) {
        infoWindow.marker = marker;
      }
    }

    // Listens for a click on a marker and attaches that markers window.
    google.maps.event.addListener(marker, 'click', function() {
      self.openInfoWindow(this, infoWindow);
    });

    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    map.fitBounds(bounds);
    // center the map
    map.setCenter(bounds.getCenter());
  }

  /*
  callback(results, status) makes sure the search returned results for a location.
  If so, it creates a new map marker for that location.
  */
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMapMarker(results[0]);
    }
  }

  /*
  pinPoster(locations) takes in the array of locations created by locationFinder()
  and fires off Google place searches for each location
  */
  function pinPoster(locations) {
    var service = new google.maps.places.PlacesService(map);
      locations.forEach(function(place){
      var request = {
        query: place
      };
      service.textSearch(request, callback);
    });
  }

  // Sets the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();

  // locations is an array of location strings returned from locationFinder()
  locations = locationFinder();

  // pinPoster(locations) creates pins on the map for each location in
  // the locations array
  pinPoster(locations);

}


// Calls the initializeMap() function when the page loads
window.addEventListener('load', initializeMap);

// listen for resizing of the window and adjust map bounds
window.addEventListener('resize', function(e) {
  map.fitBounds(mapBounds);
});
