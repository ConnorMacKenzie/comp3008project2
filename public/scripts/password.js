
const animal_names = ['bird', 'cat', 'cow', 'dog', 'horse', 'lion'];

const passwords_enum = {
  bank: ["dog_short", "dog_long", "cat_short", "cat_long", "bird_short", "bird_short"],
  email: ["horse_short", "horse_long", "horse_long", "lion_short", "dog_short", "cat_short"],
  shop: ["dog_short", "dog_short", "cow_short", "cow_long", "horse_short", "horse_long"]
}

const N = animal_names.length;

let accounts = ['bank', 'email', 'shop']

let password = [];
let start;
let end;
let currentAccount;
let session = sessionID(36);

// Only let user start test after all three passwords seen
let switched_count = 0;

let attempt_count = 0;
let test_mode = false;

// Add animals pictures and buttons
$(document).ready(function(){
    console.log("function: document.ready");

    currentAccount = accounts[getRandomInt(3)];

    // Shows which password is being asked for
    let mode_text = $("#mode_text")
    mode_text.html(mode_text.html()+ currentAccount.toUpperCase())

    // Animal pictures
    for(let i=0; i<N; i++){

        let curr_tDiv = $("#tDiv"+i);

        // Animal picture
        curr_tDiv.append("<img "
            + "alt='" + animal_names[i] +" image' "
            + "src='/images/"
            + animal_names[i]
            + ".png'"
            + ">");
    }

    // Long and Short buttons
    for(let i=0; i<N; i++) {

        let curr_tData = $("#tData" + i)

        // Short
        curr_tData.append("<button " +
            "class='left lengthButton allButtons text'" +
            "onclick='animalClick(\"" + animal_names[i] + "\",\"short\")'>" +
            "Short" +
            "</button>");

        // Long
        curr_tData.append("<button " +
            "class='right lengthButton allButtons text'" +
            "onclick='animalClick(\"" + animal_names[i] + "\",\"long\")'>" +
            "Long" +
            "</button>");
    }

    let entry_buttons_div = $("#entry_buttons_tDiv")

    // Reset button
    entry_buttons_div.append("<button " +
        "id='reset' " +
        "class='left allButtons text barButtons' " +
        "onclick='reset()'>" +
        "Reset" +
        "</button>");

    // Done button
    entry_buttons_div.append("<button " +
        "id='done' " +
        "class='right allButtons text barButtons' " +
        "onclick='done()'>" +
        "Done" +
        "</button>");
});

// Add entry bar after load
$(window).on('load', function() {
    console.log("function: window.load");

    customAlert("Welcome to our password testing schema. " +
        "There are three passwords to practice and be tested on. " +
        "Once you have cycled through the three passwords at least once the start test button will appear. " +
        "You may practice as long as you like and start the test at your leisure. Thank you for your participatation.", new_account_type)
});

// Displays password and it's type with warning about timer starting on OK
function new_account_type() {
    // User has now seen one account password
    switched_count ++;

    customAlert("Please enter the password " +
                          hint(true)    +
                         "<br><br>");
}

function reset() {
    console.log("function: reset");
    password = [];

    $("#entryText").html("");
}

function hint(string_return=false){

    currentAccount.toUpperCase()

    let alert_string = currentAccount.toUpperCase();

    // Two new lines when hint is being returned as a string
    alert_string += ((string_return === true) ? ":<br><br>" : ":<br>");

    for (let i in passwords_enum[currentAccount]){
        alert_string += passwords_enum[currentAccount][i].replace("_", " ")
        alert_string += ((i != 5) ? ", " : "");
    }

    if (string_return === true){
        return alert_string;
    }else {
        customAlert(alert_string);
    }
}

function switch_password() {


    if (++switched_count > 2){
        $(".hidden").removeClass("hidden")
    }

    for (let i in accounts){
        if (currentAccount === accounts[i]){
            // Rotate through accounts
            currentAccount = accounts[(i+1)%3];
            break;
        }
    }

    $("#mode_text").html("Practice Mode: " + currentAccount.toUpperCase());

    new_account_type();
}

function test(){

    let alert_string = "";

    if (test_mode === false) {
        $("#start_test_button").remove();

        $("#switch_password_button").remove();

        $("#password_hint").remove();

        test_mode = true;

        alert_string = "You have now entered test mode. "

    }


    currentAccount = accounts[getRandomInt(accounts.length)];

    // Remove account each time
    accounts.splice(accounts.indexOf(currentAccount), 1)

    $("#mode_text").html("Test Mode: " + currentAccount.toUpperCase());
    customAlert(alert_string + "The timer starts when you press OK.", timer);
    attempt_count = 1;

}

function timer() {
    start = new Date();
}

function done() {

    console.log("function: done");

    end = Date.now();
    let success = isPassCorrect();
    $("#entryText").html("");

    if (test_mode === true) {


        let postData = {
            user: "test",
            success: success,
            "time elapsed (s)": ((end - start) / 1000), // Shift milliseconds to seconds
            "attempt number": attempt_count++,
            "account type": currentAccount,
            session: session,
            password: password
        }

        $.ajax({
            type: "POST",
            url: "/password",
            data: JSON.stringify(postData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){console.log(data);},
        });

        password = [];

        if(success === true) {

            if (accounts.length === 0) {
                customAlert("You have entered the correct password!<br>" +
                    "You have been tested on all three passwords." +
                    " Thank you for your participation. Click OK to reload the page", () => location.reload())
            } else {
                customAlert("You have entered the correct password! Switching account type.", test)
            }
        }
        else {
            let callback = null;
            let attempt_string = "";

            // Means 3rd attempt just happened
            if(attempt_count > 3){

                if (accounts.length === 0) {
                    customAlert("Max attempts exceeded.<br>" +
                    "You have been tested on all three passwords." +
                    " Thank you for your participation. Click OK to reload the page", () => location.reload());
                } else {
                    callback = test;
                    attempt_string = " Max attempts exceeded, switching account type.";
                }
            }

            customAlert("You have entered the incorrect password!" +
                attempt_string
                , callback)
        }
    }
    else{

        password = [];

        if(success === true){
            customAlert("You have entered the correct password! Switching account type.", switch_password)
        }

        customAlert("You have entered the incorrect password!")
    }

}

// Deals with click
function animalClick(animal, length) {
    console.log("function: animalClick");

    let entry_text = $("#entryText")

    let path = 'mp3s/'
    let audio;

    if (entry_text.html().length > 5) {

        audio = new Audio(path + "/error.mp3");
    }

    else {
        entry_text.html("&#8226;" + entry_text.html())
        password.push(animal + '_' + length)
        audio = new Audio(path + animal + '_' + length + '.mp3');
    }

    audio.play();
}

function isPassCorrect(){
  let correctPass = passwords_enum[currentAccount];
  for(let i = 0; i < 6; i++){
      if(password[i] !== correctPass[i]){
        return false;
      }
  }
  return true;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function sessionID() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
