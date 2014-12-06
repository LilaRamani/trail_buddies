var map;
var myLat = 41;
var myLng = -120;
var me = new google.maps.LatLng(myLat, myLng);
var GLOBALmarker;
var GLOBALinfowindow;
var mapOptions = {
        center: me,
        zoom: 8
};

function initialize() {
        map = new google.maps.Map(document.getElementById('map_canvas'),
        mapOptions);
        MyLocation();

        google.maps.event.addListener(map, 'rightclick', function(e) {
                placeMarker(e.latLng, map);
        });
}

function placeMarker(position, map) {

        clearUserMarker();

        GLOBALmarker = new google.maps.Marker({
                position: position,
                map: map
        });

        // set lat and lng values in add hike input field
        $('#hikeLat').val(GLOBALmarker.getPosition().lat());
        $('#hikeLng').val(GLOBALmarker.getPosition().lng());

        addInfoWindow(GLOBALmarker);

        map.panTo(position);

}

function clearUserMarker () {

        if (GLOBALmarker != undefined) {

                // delete all other markers added in this session
                GLOBALmarker.setMap(null);
                GLOBALmarker = null;
        }
}

function addInfoWindow(marker) {

        GLOBALinfowindow = new google.maps.InfoWindow({
                content: "<button data-toggle=\"modal\" data-target=\"#myModal\">Add hike</button>",
        });

        GLOBALinfowindow.open(map,marker);

        google.maps.event.addListener(marker, 'click', function() {
                GLOBALinfowindow.open(map,marker);
        });

        google.maps.event.addListener(GLOBALinfowindow, 'closeclick', function() {
                GLOBALinfowindow.close();
                clearUserMarker();
        });
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
        myMarker = new google.maps.Marker({
                position: me,
                title: "I am here",
        });
        myMarker.setMap(map);

        google.maps.event.addListener(myMarker, 'click', function() {
                GLOBALinfowindow.setContent(myMarker.title);
                GLOBALinfowindow.open(map, myMarker);
        });
}
google.maps.event.addDomListener(window, 'load', initialize);


/*$(document).ready(function() {

        $.ajax({
                dataType: 'json',
                url: "https://api.forecast.io/forecast/200e4b0adde1dcf733e2eca4b88066ab/37.8267,-122.423",
                success: function($weatherData) {
                       console.log($weatherData);
                }
        });
});*/

$(function () {
        $('[data-toggle="popover"]').popover()
})


// called when add hike "save changes" button is clicked
function submit_addhike() {
        //need to change some of the variable names so that the post request will work
        var formData = $('#addhikeform').serialize();
        console.log(formData);
        $.post( "http://ancient-lake-4187.herokuapp.com/sendLocation", formData, function( data ) {
                console.log( "data is back!");
                console.log( data );
        }, "json");
}



