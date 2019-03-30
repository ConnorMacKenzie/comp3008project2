
const animal_names = ['bird', 'cat', 'cow', 'dog', 'horse', 'lion']

const N = animal_names.length;

// Start animation and get game info
$(document).ready(function(){

    console.log("function: document.ready");

    for(let i=0; i<N; i++){

        $("#td"+i).append("<img "
            + "src='assets/images/"
            + animal_names[i]
            + ".png'"
            + ">")

    }

})