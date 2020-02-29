"use strict";

const startBtn = document.getElementById("startBtn");
const scoreSpan = document.getElementById("score");
const submitBtn = document.getElementById("submitAnswer");
const timeSpan = document.getElementById("timeLeft");
const inputText = document.getElementById("input");
const word = document.getElementById("game");
const radioBtns = document.getElementsByClassName("difficulty");

// the actual words used to generate the random word
const words = ["red", "green", "yellow", "grey", "blue", "cyan", "orange",
    "black", "white", "purple", "pink", "aqua", "indigo", "brown",
    "maroon", "violet"];

let timeLeft = 0;   // the actual time for a challenge round. it is set to 0 as it is grabbed from the difficulty choice
let winCounter = 0; // the counts of how many times the word from input text matches the word generated

// generate random color by adding a random number/letter from the 'letters' variable to the 'color' variable
function createRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
        color += letters[Math.trunc(Math.random() * 16)];
    }
    return color;   // returns a hexadecimal color such as #3B21A7
}

// returns the exact value of the radio button which was checked
const checkedRadioBtn = function () {
    for (let i = 0; i < radioBtns.length; i++) {
        if (radioBtns[i].checked) {
            return parseInt(radioBtns[i].value);
        }
    }
};

function changeColors() {
    // set new word from the 'words' array, change bg color and word text color
    word.textContent = words[Math.trunc(Math.random() * (words.length - 1))];
    word.style.color = createRandomColor();
    if (checkedRadioBtn() >= 5) {                       // i noticed the game is trickier if the bg color is only white
        word.style.background = createRandomColor();    // easy or medium get to change the bg color as well
    } else {
        word.style.background = "#FFFFFF";              // when hard or nightmare the bg color is white
        word.style.fontWeight = "normal";               // when hard or nightmare the text is not bold
    }
}


startBtn.addEventListener("click", function () {
    if (parseInt(timeSpan.textContent) === 0) {  // avoid setInterval to activate again during gameplay

        changeColors();

        timeLeft = checkedRadioBtn();   // set the timeLeft to difficulty level the player chose
        timeSpan.textContent = "";        // set the displayed time to empty string
        scoreSpan.textContent = "0";      // set the displayed score to 0

        // set the time limit. in this case it is 5 seconds
        const time = setInterval(function () {
            if (timeLeft <= 0) {

                // if time gets to 0 then it's game over
                clearInterval(time);
                timeSpan.textContent = "0";
                alert(`Game Over! Your score is ${scoreSpan.textContent}`);
            } else {

                // keep counting down
                timeSpan.textContent = String(timeLeft);
            }
            timeLeft -= 1;
        }, 1000);   // set interval to one second countdown
    }
});


function submitAction() {
    // in case the game is already over or the user didn't start the game yet throw alert
    if (parseInt(timeSpan.textContent) === 0) {
        alert("Please start a new game");
        return;
    }

    // grab the colored word
    const gameWord = word.textContent;

    // in case the submitted word is correct
    if (inputText.value === gameWord) {
        winCounter++;
        scoreSpan.textContent = String(winCounter);   // increment winCounter with 1
        if (checkedRadioBtn() >= 5) {
            timeLeft += Math.trunc(checkedRadioBtn() / 2);   // for easy and medium you get original time divided by 2 added to your left time
        } else {
            timeLeft = checkedRadioBtn();                       // for hard and nightmare, the time is not added, instead it is set to original value
        }

        changeColors();

    } else {    // in case the submitted word is incorrect then it's game over
        alert("Wrong color");
        timeLeft = 0;   // timer set to 0, means the game is over
    }

    // set the input text back to blank
    inputText.value = "";
}

// submit by pressing or tapping enter key on keyboard
inputText.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        submitAction();
    }
});

// submit by clicking submit button
submitBtn.addEventListener("click", function () {
    submitAction();
});