var map;
var myLat = 0;
var myLng = 0;
var me = new google.maps.LatLng(myLat, myLng);
var marker;
var mapOptions = {
        center: me,
        zoom: 8
};

function initialize() {
        map = new google.maps.Map(document.getElementById('map_canvas'),
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

//set up map
function renderMap()
{
        me = new google.maps.LatLng(myLat, myLng);
        
        map.panTo(me);
  
        //CREATE MARKER
        marker = new google.maps.Marker({
                position: me,
                title: "I am here",
        });
        marker.setMap(map);

        google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(marker.title);
                infowindow.open(map, marker);
        });
}
google.maps.event.addDomListener(window, 'load', initialize);


$(document).ready(function() {

        $.ajax({
                dataType: 'json',
                url: "https://api.forecast.io/forecast/200e4b0adde1dcf733e2eca4b88066ab/37.8267,-122.423",
                success: function($weatherData) {
                       console.log($weatherData);
                }
        });
});






