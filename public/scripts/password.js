/*
*  This is script responsible for:
*
*      Adding all of the images to the password table
*      Adding all buttons to the web page
*      Defining the behaviour of the buttons
*      Storing and validating the practice and testing passwords
*      Generating session IDs
*      Taking the user through the practice and test phases
*      Keeping track of the time it takes a user to enter a password
*      Keeping track of the number of attempts a user has made at a password
*      Switching passwords during practice and testing
*
* */

// Animal names for accessing files and displaying password text
const animal_names = ['bird', 'cat', 'cow', 'dog', 'horse', 'lion'];

// Password types and corresponding passwords
let accounts = ['bank', 'email', 'shop'];
const passwords_enum = {
  bank: ["dog_short", "dog_long", "cat_short", "cat_long", "bird_short", "bird_short"],
  email: ["horse_short", "horse_long", "horse_long", "lion_short", "dog_short", "cat_short"],
  shop: ["dog_short", "dog_short", "cow_short", "cow_long", "horse_short", "horse_long"]
};

// N animals
const N = animal_names.length;

// Current password
let password = [];

// Start and end time
let start;
let end;

// Account being practiced or tested
let currentAccount;

// Session ID
let session = sessionID(36);

// Only let user start test after all three passwords seen (during practice)
let switched_count = 0;

// Only allow three attempts (during testing)
let attempt_count = 0;

// Toggle for test mode
let test_mode = false;

// Used to ensure different order during testing
let practice_start_account;

// Add animals pictures and buttons
$(document).ready(function(){
    console.log("function: document.ready");

    // Selects first account randomly (for practice)
    currentAccount = accounts[getRandomInt(3)];

    // Used to ensure different order during testing
    practice_start_account = currentAccount;

    // Shows which password is being asked for
    let mode_text = $("#mode_text");
    mode_text.html(mode_text.html()+ currentAccount.toUpperCase());

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

        let curr_tData = $("#tData" + i);

        // Short
        curr_tData.append("<button " +
            "class='left lengthButton allButtons text' " +
            "onclick='animal_button(\"" + animal_names[i] + "\",\"short\")'>" +
            "Short" +
            "</button>");

        // Long
        curr_tData.append("<button " +
            "class='right lengthButton allButtons text' " +
            "onclick='animal_button(\"" + animal_names[i] + "\",\"long\")'>" +
            "Long" +
            "</button>");
    }

    let entry_buttons_div = $("#entry_buttons_tDiv");

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

// Shows welcome message
$(window).on('load', function() {
    console.log("function: on window.load");

    customAlert("Welcome to our password testing schema. " +
        "There are three passwords to practice and be tested on. " +
        "Once you have cycled through the three passwords at least once the start test button will appear. " +
        "You may practice as long as you like and start the test at your leisure. Thank you for your participatation.", new_account_type);
});

// Displays password for when accounts are switched
function new_account_type() {
    console.log("function: new_account_type");

    // User has now seen one account password
    switched_count ++;

    customAlert("Please enter the password " +
                          hint(true)    +
                         "<br><br>");
}

// For Long and Short animal buttons
function animal_button(animal, length) {
    console.log("function: animal_button");

    // Gets entry test to style later
    let entry_text = $("#entryText");

    // Sets audio path and inits variable
    let path = 'assets/mp3s/';
    let audio;

    // Sets audio to error if 6 sounds already present)
    // and does not add sound to password attempt
    if (entry_text.html().length > 5) {
        audio = new Audio(path + "/error.mp3");
    }

    // Less than 6 values in password attempt
    else {
        // Adds dot to entry are to show sound added to password attempt
        entry_text.html("&#8226;" + entry_text.html());

        // Adds password code to password array for future validation
        password.push(animal + '_' + length);

        // Sets sound to animal sound
        audio = new Audio(path + animal + '_' + length + '.mp3');
    }

    // Plays sound
    audio.play();
}

// For reset button
// clears password on screen and in variable
function reset() {
    console.log("function: reset");

    // Reset password variable
    password = [];

    // Reset dots in entry area
    $("#entryText").html("");
}

// For done button
function done() {
    console.log("function: done");

    // Stop timer
    end = Date.now();

    // Test if password is correct
    let success = is_password_correct();

    // Reset dots in entry area
    $("#entryText").html("");

    // More complex code for when test is running
    if (test_mode === true) {

        // Prepares object to be sent for CSV
        let postData = {
            user: "test",
            success: success,
            "time elapsed (s)": ((end - start) / 1000), // Shift milliseconds to seconds
            "attempt number": attempt_count++,
            "account type": currentAccount,
            session: session,
            password: password
        };

        // Send CSV data to server
        $.ajax({
            type: "POST",
            url: "/password",
            data: JSON.stringify(postData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){console.log(data);},
        });

        // Reset password after sending to server
        password = [];

        // Password is correct
        if(success === true) {

            // All passwords finished message, reload on OK
            if (accounts.length === 0) {
                customAlert("You have entered the correct password!<br>" +
                    "You have been tested on all three passwords." +
                    " Thank you for your participation. Click OK to reload the page", () => location.reload())
            }

            // Correct password with more to go, OK starts next test on next password
            else {
                customAlert("You have entered the correct password! Switching account type.", test)
            }
        }

        // Password is not correct
        else {

            // Init callback and attempt string
            let callback = null;
            let attempt_string = "";

            // Means 3rd attempt just happened
            if(attempt_count > 3){

                // Incorrect last attempt of last password finished message, reload on OK
                if (accounts.length === 0) {
                    customAlert("Max attempts exceeded.<br>" +
                        "You have been tested on all three passwords." +
                        " Thank you for your participation. Click OK to reload the page", () => location.reload());
                }

                // Incorrect password with more to go, OK starts next test on next password
                else {
                    callback = test;
                    attempt_string = " Max attempts exceeded, switching account type.";
                }
            }

            customAlert("You have entered the incorrect password!" +
                attempt_string // Add special cases attempt string from above
                , callback)
        }
    }

    // Practice mode
    else{

        // Reset password variable (password validation already done)
        password = [];

        // Correct password auto switch passwords
        if(success === true){
            customAlert("You have entered the correct password! Switching account type.", switch_password)
        }

        // Incorrect password, attempt as many times as user would like
        customAlert("You have entered the incorrect password!")
    }

}

// Shows correct password for current account (during practice)
function hint(string_return=false){
    console.log("function: hint");

    // Draw attention to account name
    let alert_string = currentAccount.toUpperCase();

    // Two new lines when hint is being returned as a string
    alert_string += ((string_return === true) ? ":<br><br>" : ":<br>");

    let path = 'mp3s/'
    let audio;
    // Modify password test representation for user
    for (let i in passwords_enum[currentAccount]){

        // Remove underscores
        alert_string += passwords_enum[currentAccount][i].replace("_", " ");

        // Add comma and space unless last value
        alert_string += ((i != 5) ? ", " : "");
    }

    // Used string builder for other custom alert
    if (string_return === true){
        return alert_string;
    }

    // Used as actual custom alert
    else {
        customAlert(alert_string);
    }
}

// Switches password (during practice)
function switch_password() {
    console.log("function: switch_password");

    // Show Test button after all passwords seen
    if (++switched_count > 2){
        $(".hidden").removeClass("hidden")
    }

    // Rotate through accounts (with mod 3)
    for (let i in accounts){
        if (currentAccount === accounts[i]){

            // Increment mod 3
            currentAccount = accounts[(i+1)%3];
            break;
        }
    }

    // Update password type text
    $("#mode_text").html("Practice Mode: " + currentAccount.toUpperCase());

    // new_account_type shows new account password
    new_account_type();
}

// For start test button
// and to start next account internally
function test(){
    console.log("function: test");

    // Alert string to be constructed
    let alert_string = "";

    // Starting test mode style
    if (test_mode === false) {

        // Remove practice buttons
        $("#start_test_button").remove();
        $("#switch_password_button").remove();
        $("#password_hint").remove();

        // Set test mode boolean
        test_mode = true;

        // First part of alert string on test start
        alert_string = "You have now entered test mode. ";

        // Makes sure order is different
        while (true) {
            currentAccount = accounts[getRandomInt(accounts.length)];

            // Start on different account than practice
            if (currentAccount !== practice_start_account){
                break;
            }
        }
    }

    // Set current account normally on not first test account
    else{
        currentAccount = accounts[getRandomInt(accounts.length)];
    }


    // Remove account each time
    accounts.splice(accounts.indexOf(currentAccount), 1);

    // Style password type display for test mode
    $("#mode_text").html("Test Mode: " + currentAccount.toUpperCase());

    // Starts attempt count
    attempt_count = 1;

    // Shows new account test message and starts timer on OK (with callback)
    customAlert(alert_string + "The timer starts when you press OK.", timer_callback);
}

// Used as callback on OK click to start timer
function timer_callback() {
    console.log("function: timer_callback");

    start = new Date();
}

// Tests if password is correct
function is_password_correct(){
    console.log("function: is_password_correct");

    let correctPass = passwords_enum[currentAccount];
  for(let i = 0; i < 6; i++){

      // Checks all password attempt values
      if(password[i] !== correctPass[i]){
        return false;
      }
  }
  return true;
}

// Returns random int in range of [0, max)
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Generates new sessionID
function sessionID() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
