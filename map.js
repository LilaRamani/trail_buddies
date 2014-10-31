
function initialize() {
    var mapOptions = {
      center: { lat: -34.397, lng: 150.644},
      zoom: 8
  };
  var map = new google.maps.Map(document.getElementById('map_canvas'),
    mapOptions);
  MyLocation();
}
function MyLocation()
{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              myLat = position.coords.latitude;
              myLng = position.coords.longitude;
              renderMap();
            });
        }
        else {
          alert("Your Browser doesn't support geolocation");
        }
}
google.maps.event.addDomListener(window, 'load', initialize);
