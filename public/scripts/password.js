
const animal_names = ['bird', 'cat', 'cow', 'dog', 'horse', 'lion'];

const animal_enum =
  {
    'bird_short': 0,
    'bird_long': 1,
    'cat_short': 2,
    'cat_long': 3,
    'cow_short': 4,
    'cow_long': 5,
    'dog_short': 6,
    'dog_long': 7,
    'horse_short': 8,
    'horse_long': 9,
    'lion_short': 10,
    'lion_long': 11,
  }

const passwords_enum = {
  bank: ["dog_short", "dog_long", "cat_short", "cat_long", "bird_short", "bird_short"],
  email: ["horse_short", "horse_long", "horse_long", "lion_short", "dog_short", "cat_short"],
  shop: ["dog_short", "dog_short", "cow_short", "cow_long", "horse_short", "horse_long"]
}

const accounts = ['bank', 'email', 'shop']

const N = animal_names.length;

let password = [];
let start;
let end;
let currentAccount;
let session = sessionID(36);

// Add animals pictures and buttons
$(document).ready(function(){
    console.log("function: document.ready");

    currentAccount = accounts[getRandomInt(3)]

    // Animal pictures
    for(let i=0; i<N; i++){

        let curr_tDiv = $("#tDiv"+i);

        // Animal picture
        curr_tDiv.append("<img "
            + "src='assets/images/"
            + animal_names[i]
            + ".png'"
            + ">");
    }


    // Long short buttons
    for(let i=0; i<N; i++) {

        let curr_tData = $("#tData" + i)

        // Short
        curr_tData.append("<button " +
            "class='short lengthButton allButtons text'" +
            "onclick='animalClick(\"" + animal_names[i] + "\",\"short\")'>" +
            "Short" +
            "</button>");

        // Long
        curr_tData.append("<button " +
            "class='long lengthButton allButtons text'" +
            "onclick='animalClick(\"" + animal_names[i] + "\",\"long\")'>" +
            "Long" +
            "</button>");
    }

    let body = $("body");

    // Reset button
    body.append("<button " +
        "id='reset' " +
        "class='allButtons text barButtons'" +
        "onclick='reset()'>" +
        "Reset" +
        "</button>");

    // Done button
    body.append("<button " +
        "id='done' " +
        "class='allButtons text barButtons'" +
        "onclick='done()'>" +
        "Done" +
        "</button>");
});

// Add entry bar after load
$(window).on('load', function() {
    console.log("function: window.load");

    let entry_bar_done = false;
    entry_bar_done = entry_bar();

    // Move reset and done buttons and give
    // instructions after entry bar done moving
    let interID = setInterval(() => {
        if (entry_bar_done === true){

            entry_buttons();
            customAlert("Please enter the password of the " + currentAccount + " account.", startCallback);
            clearInterval(interID);
        }
    }, 100);
});

// TODO entry buttons and bar need to be placed dynamically better

// This is just for prototyping
function entry_buttons(){

    let entry =  $("#entry");
    let entry_height = entry.height();

    let reset_button = $("#reset");
    let done_button = $("#done");

    let top_offset = entry.offset().top;
    let entry_left_offset = entry.offset().left;

    reset_button.height(entry_height);
    done_button.height(entry_height);

    let reset_left_offset = entry_left_offset - reset_button.width() - 16 - 20;
    reset_button.offset({top:top_offset, left:reset_left_offset});

    let done_left_offset = entry_left_offset + entry.width() + 20;
    done_button.offset({top:top_offset, left:done_left_offset});

}

// Places entry bar
function entry_bar() {
    console.log("function: entry_bar");

    let entry = $("#entry");
    let table = $("#table")

    let table_top_offset = table.offset().top;
    let body_width = $("body").width();

    entry.height(table_top_offset/2)
    entry.width(body_width/3)
    entry.offset({top:table_top_offset/4, left:body_width/3})

    return true;
}

function reset() {
    console.log("function: reset");
    password = [];
    // TODO send server reset post

    $("#entryText").html("");
}


function done() {
    end = Date.now();
    console.log("function: done");

    let success = isPassCorrect();

    let postData = {
        user: "test",
        success: success,
        password: password,
        end: end,
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


    $("#entryText").html("");
    password = [];

    if(success){
      start = null;
      customAlert("You have entered the correct password!", correctCallback)
    }
    else {
      customAlert("You have entered the incorrect password!", incorrectCallback)
    }

    // TODO what happens after done?

    // TODO only clickable after length === 6
}

// Deals with click
function animalClick(animal, length) {
    console.log("function: animalClick");

    let entry_text = $("#entryText")

    let path = 'assets/mp3s/'
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
      if(password[i] != correctPass[i]){
        return false;
      }
  }
  return true;
}

// Moves entry bar on resize
function windowResize() {
    console.log("function: windowResize");

    entry_bar();
    entry_buttons();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function sessionID() {
  return '_' + Math.random().toString(36).substr(2, 9);
};
