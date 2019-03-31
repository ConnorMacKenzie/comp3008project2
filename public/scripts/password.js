
const animal_names = ['bird', 'cat', 'cow', 'dog', 'horse', 'lion'];

const N = animal_names.length;

// Add animals pictures and buttons
$(document).ready(function(){
    console.log("function: document.ready");

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
            customAlert("Please make a password of length six by clicking long or short animal sounds.");
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

    // TODO send server reset post

    $("#entryText").html("");
}


function done() {
    console.log("function: done");

    // TODO send server done post

    // TODO what happens after done?

    // TODO only clickable after length === 6

    $("#entryText").html("");
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

        audio = new Audio(path + animal + '_' + length + '.mp3');
    }

    audio.play();
}

// Moves entry bar on resize
function windowResize() {
    console.log("function: windowResize");

    entry_bar();
    entry_buttons();
}