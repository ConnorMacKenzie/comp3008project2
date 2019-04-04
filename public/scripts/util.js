

function customAlert(message, callback=null){
    console.log("function: customAlert");

    $('body').prepend(
        "<div id='overlay' class='customAlert' " +
        "style='" +
            "position:fixed;" +
            "height:100%;" +
            "width:100%; " +
            "background-color:rgba(0, 0, 0, 0.6);" +
            "z-index:1;" +
        "'></div>"
    );

    $('#overlay').append(
        "<div id='messageBox' class='customAlert' " +
        "style='" +
            "background-color:white;" +
            "z-index:2; " +
            "position: absolute;" +
            "top: 50%;" +
            "left: 50%;" +
            "transform: translate(-50%, -50%);" +
            "border-radius:3%;" +
            "padding-bottom: 1%;" +
        "'></div>"
    );

    $('#messageBox').append(
        "<h1 id='messageText' class='customAlert text'" +
        "style='" +
            "padding-left: 3%;" +
            "padding-right: 3%;" +
            "text-align: center;" +
        "'>" +
        message +
        "</h1>"
    );

    $('#messageBox').append(
        "<button id='alertButton' class='customAlert text'" +
        "onclick='removeCustomAlert()'" +
        "style='" +
            "font-size: 2em;"+
            "margin:0 auto; "+
            "display:block; " +
            "text-align:center; " +
        "'>OK" +
        "</button>"
    );

    $(document).keypress(function(event){

        console.log($("#alertButton"))

        let keycode = (event.keyCode ? event.keyCode : event.which);

        if (keycode === 13) {
            $("#alertButton").click();
            $(document).off()
        }
    });

    if(callback !== null){
        $("#alertButton").click(callback);
    }

}

// Clears all elements related to custom alert
function removeCustomAlert() {
    let alertElements = $(".customAlert")

    for (let i=0; i<alertElements.length; i++){
        alertElements[i].remove();
    }
}

// See if elements exist with custom alert class
function customAlertFinished() {
    return ($(".customAlert").length === 0)
}

function startCallback() {
    let postData = {
      user: "test",
      start: Date.now(),
      session: session
    }

    $.ajax({
      type: "POST",
      url: "/password",
      data: JSON.stringify(postData),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data){console.log(data);},
      failure: function(errMsg) {
          console.log(errMsg);
      }
    });
}

function correctCallback(){
    console.log("function: correct");
    location.reload();
}

function incorrectCallback() {
    console.log("function: incorrect");
}
