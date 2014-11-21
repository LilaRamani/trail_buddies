$( document ).ready(function() {
    console.log("ready!");
});

var request = new XMLHttpRequest();
function submit_click() {



        var isFormValid = true;

        $(".txtBox").each(function(){
                if ($.trim($(this).val()).length == 0){
                        $(this).addClass("highlight");
                        isFormValid = false;
                }
                else{
                        $(this).removeClass("highlight");
                }
        });
        if (isFormValid == true) {
                request.open("POST", "http://OURHEROKU.herokuapp.com/sendLocation", true);
                parameters = "name=" + $("#name").val() + "&email=" $("#email").val() + "&address=" +
                                $("#address").val() + "&date_time=" + $("#date_time").val() + "&hike_length=" +
                                $("#hike_length").val() + "&description=" + $("#description").val();
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.send(parameters);
                
                $("#popup_message").css("color", "purple");
                $("#popup_message").text("You Have Succesfully Added 1 Hike!");
                setTimeout( "window.location.assign('index.html');",2000 );
        } else {
                $("#popup_message").css("color", "red");
                $("#popup_message").text("One or more fields are empty");
        }
}