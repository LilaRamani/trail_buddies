
/****************************************************************  
 *                                                              *
 *                                                              *
 *                   Google Maps functions                      *
 *                                                              *
 *                                                              *
 ****************************************************************/

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
        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

        MyLocation();

        getHikes();

        google.maps.event.addListener(map, 'rightclick', function(e) {
                placeMarker(e.latLng, map);
        });

        google.maps.event.addListener(map, 'dblclick', function(e) {
                map.set("disableDoubleClickZoom", true);
                placeMarker(e.latLng, map);
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





/****************************************************************  
 *                                                              *
 *                                                              *
 *                   Trail Buddies functions                    *
 *                                                              *
 *                                                              *
 ****************************************************************/


// returns false if device has no touch screen capabilities, true if it does
// some IE bugs
function is_touch_device() {
  return 'ontouchstart' in window // works on most browsers 
      || 'onmsgesturechange' in window; // works on ie10
};


function getHikes() {

        $.get("http://ancient-lake-4187.herokuapp.com/", function(data) {
                for(var j = 0; j < data.length; j++) {
                        createHikeMark(data[j]);
                }
        }, "json");
}

function createHikeMark(hike)
{
        var loc = new google.maps.LatLng(hike.lat, hike.lng);
        var marker = new google.maps.Marker({
                map: map,
                position: loc,
                title: hike.hike_name
        });
        var participants = "";

        for (var i = 0; i < hike.participants.length; i++) {
            participants += hike.participants[i] + ", ";
        }

        var content = marker.title + "</br>" + "With: " + participants + "</br>" +
                              hike.descript;

        var infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', function() {
                infowindow.close();
                infowindow.setContent(content);
                infowindow.open(map, this);
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


$(function () {
        $('[data-toggle="popover"]').popover()
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



// add open datepicker in add hike modal
$(function() {
        $("#datepicker").datepicker({ minDate: 0});
});

$(function() {
        $("#datepickerfiltermin").datepicker({ minDate: 0});
});

$(function() {
        $("#datepickerfiltermax").datepicker({ minDate: 0});
});



$("#filterdatebutton").click( function() {

        var minDate = new Date($("#datepickerfiltermin").val());
        var maxDate = new Date($("#datepickerfiltermax").val());


        
      
        
        if ((maxDate == "Invalid Date") && (minDate == "Invalid Date")) {

                        $("#filterdateform").prepend( " <label class='control-label' for='datepickerfiltermin'>Red alert: Empty fields!</label>" );
                        $("#filterdateform").addClass("has-error");
                        return; 
        } 

        if (maxDate < minDate) {
                var temp = maxDate;
                maxDate = minDate;
                minDate = temp;
                
        }

                //console.log("max:" + maxDate + " min: " + minDate)

                //console.log("Date: " + Date.parse(minDate.getMonth() + "/" + minDate.getDate() + "/" + minDate.getYear())); 
                //< Date.parse(maxDate.getMonth() + "/" + maxDate.getDate() + "/" + maxDate.getYear())
                 

                var filterdatedata = $('#filterdateform').serialize();
                console.log(filterdatedata);
                // $.post( "http://ancient-lake-4187.herokuapp.com/FILTERDATE", filterdatedata, function( data ) {
                //         console.log( "data is back!");
                //         console.log( data );
                // }, "json");                               
});

// app.get('/filterDate', function(request, response) {
//         response.set('Content-Type', 'text/html');

//         var minDate = request.query.minDate;
//         var maxDate = request.query.maxDate;
           // if (minDate > maxDate) {
           //      response.send();
           // }

//         db.collection('fooditems', function(er, collection) {
//                 collection.find().toArray(function(err, cursor) {
//                         if (!err) {
//                                 indexPage += "<!DOCTYPE HTML><html><head><title>What Did You Feed Me?</title></head><body><h1>What Did You Feed Me?</h1>";
//                                 for (var count = 0; count < cursor.length; count++) {
//                                         indexPage += "<p>You fed me " + cursor[count].fooditem + "!</p>";
//                                 }
//                                 indexPage += "</body></html>"
//                                 response.send(indexPage);
//                         } else {
//                                 response.send('<!DOCTYPE HTML><html><head><title>What Did You Feed Me?</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
//                         }
//                 });
//         });
// });

