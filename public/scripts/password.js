
const animal_names = ['bird', 'cat', 'cow', 'dog', 'horse', 'lion']

const N = animal_names.length;

// Add animals pictures and buttons
$(document).ready(function(){
    console.log("function: document.ready");

    for(let i=0; i<N; i++){

        let curr_tDiv = $("#tDiv"+i);

        // Animal picture
        curr_tDiv.append("<img "
            + "src='assets/images/"
            + animal_names[i]
            + ".png'"
            + ">");
    }

    for(let i=0; i<N; i++) {

        let curr_tData = $("#tData" + i)

        // Short
        curr_tData.append("<button " +
            "class='short lengthButton'" +
            "onclick='animalClick(\"" + animal_names[i] + "\",\"short\")'>" +
            "Short" +
            "</button>");

        // Long
        curr_tData.append("<button " +
            "class='long lengthButton'" +
            "onclick='animalClick(\"" + animal_names[i] + "\",\"long\")'>" +
            "Long" +
            "</button>");
    }
});

// Add entry bar after load
$(window).on('load', function() {
    console.log("function: window.load");

    let entry_bar_done = false
    entry_bar_done = entry_bar()

    setInterval(() => {
        if (entry_bar_done === true){
            customAlert("Please make a passowrd of length six by clicking long or short animal sounds.");
        }
    }, 100);
});

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
    entry_bar()
}