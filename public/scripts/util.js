/*
*  This is script responsible for:
*
*      Displaying custom alerts
*      Styling associated with custom alert
*      Calling callback functions
*
* */

// jQuery to dim background and display white message box with black text and OK button
function customAlert(message, callback=null){
    console.log("function: customAlert");

    // Dim background
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

    // Add white message area
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

    // Add black text
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

    // Adds OK button
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

    // Adds callback to OK button click
    if(callback !== null){
        $("#alertButton").click(callback);
    }
}

// Clears all elements related to custom alert
function removeCustomAlert() {
    console.log("function: removeCustomAlert");

    let alertElements = $(".customAlert")

    for (let i=0; i<alertElements.length; i++){
        alertElements[i].remove();
    }
}

// See if elements exist with custom alert class
function customAlertFinished() {
    return ($(".customAlert").length === 0)
}
