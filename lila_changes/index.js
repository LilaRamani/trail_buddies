var map;
var myLat = 0;
var myLng = -100;
var me = new google.maps.LatLng(myLat, myLng);
var GLOBALmarker;
var GLOBALinfowindow;
var mapOptions = {
        center: me,
        zoom: 2
};

function initialize() {
        map = map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        MyLocation();
        $.get("http://ancient-lake-4187.herokuapp.com/", function(data) {
                for(var j = 0; j < data.length; j++) {
                        createHikeMark(data[j]);
                }
        }, "json");
        google.maps.event.addListener(map, 'rightclick', function(e) {
                placeMarker(e.latLng, map);
        });
}


//This is the new version of this function, which now it includes the button:
function createHikeMark(hike)
{
    var loc = new google.maps.LatLng(hike.lat, hike.lng);
    /*
    var marker = new google.maps.Marker({
        map: map,
        position: loc,
        title: hike.hike_name
        });
    */
    var participants = "";

    for (var i = 0; i < hike.participants.length; i++) {
    participants += hike.participants[i] + ", ";
    }


    var theContent = "<html><head><style>h2{text-align:center; color:green;}#invisible{display:none;}</style></head><body>" +"<p id='invisible'>" + hike._id +"ENDOFID" +  "</p>" + "<h2>"  + hike.hike_name+" </h2>" + "<p><b>" + "Participants:</b> " + 
    participants + "<p><b>Date of Hike: </b>" + hike.start_date + "<p><b>Time: </b>" + /*hike.hour + ":" hike.minute + " " + hike.am_pm +*/ "</p><p><b>Description: </b>" 
    + hike.descript + "</p></body></html>" + "<button data-toggle=\"modal\" data-target=\"#myModal2\">Join hike</button>";

     var marker = new google.maps.Marker({
       map: map,
       position: loc,
       title: hike.hike_name,
       holdThis: theContent
      });

    //Set initial content to include button 
    JOINinfowindow = new google.maps.InfoWindow({
    content: theContent,
    });


    google.maps.event.addListener(marker, 'click', function(){
        JOINinfowindow.close();
        var theID = findSubstring(118, "ENDOFID", marker.holdThis);

        $('#IdofHike').val(theID);
        console.log("The id is: " + theID);
            
        console.log($('#IdofHike'));
       
            JOINinfowindow.setContent(theContent);//Set content with button each time
        JOINinfowindow.open(map,this);
    });
}




//Takes in: startIndex: the index position of the string that is the first character of the desired substring,
//          firstUnwantedChar: the string value that includes the first unwanted character after the end of
//                             the DESIRED substring.
//e.g.: fullString = "Hello World", start index = 0, firstUnwantedSubstring = "orld", 
//  then the return value will be: "Hello W".
function findSubstring(startIndex, firstUnwantedSubstring, fullString) {
    var StartingIndexOfUnwantedString = fullString.indexOf(firstUnwantedSubstring);
    var desiredString = fullString.substring(startIndex, StartingIndexOfUnwantedString);
    return desiredString;
}

//Helper function for the 'click' event in createHikeMark function. 
//(For when someone clicks the "Join hike" button)
//Will set the values of the fields that appear on the form that pops up on the screen
//so that they are already populated with the information. 
function setJoinHikeFormData(hike) {
    console.log("Hike lat getting: " + hike.lat);
    $('#latOfHike').val(hike.lat);  
    $('#lngOfHike').val(hike.lng);
  
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
        //                content: "<button data-toggle=\"modal\" data-target=\"#myModal\">Add hike</button>",
                content: "<button data-toggle=\"modal\" data-target=\"#myModal\">Add hike</button>"
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
        map.setZoom(8);

        var image = 'small_blue_ball.png';
        var marker = new google.maps.Marker({
              position: me,
              map: map,
              icon: image
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
        $('[data-toggle="popover"]').popover();
})

// add open datepicker in add hike modal
$(function() {
        $( "#datepicker" ).datepicker({ minDate: 0});
});

// called when add hike "save changes" button is clicked
function submit_addhike() {
        //need to change some of the variable names so that the post request will work
        var formData = $('#addhikeform').serialize();
        console.log(formData);
        $.post( "http://ancient-lake-4187.herokuapp.com/sendLocation", formData, function( data ) {
                console.log( "data is back!");
                console.log( data );
        }, "json");
        clearUserMarker();
}


//called when "add hike" button is clicked from Join Hike
function submit_joinhike() {
    //need to change some of the variable names so that the post request will work                                                                                           
    var formData = $('#joinhikeform').serialize();


    console.log("Form data is: " + formData);
    $.post( "http://ancient-lake-4187.herokuapp.com/joinHikeTaylor", formData, function( data ) {

        console.log( "data is back here now");
        console.log( data );
        $.get("http://ancient-lake-4187.herokuapp.com/", function(data) {
                console.log("hey");
                for(var j = 0; j < data.length; j++) {
                        createHikeMark(data[j]);
                }
        }, "json");
    }, "json");
    clearUserMarker();
}