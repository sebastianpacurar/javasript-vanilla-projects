"use strict";

const startBtn = document.getElementById("startBtn");
const scoreSpan = document.getElementById("score");
const submitBtn = document.getElementById("submitAnswer");
const timeSpan = document.getElementById("timeLeft");
const inputText = document.getElementById("input");
const word = document.getElementById("game");

// the actual words used to generate the random word
const words = ["red", "green", "yellow", "grey", "blue", "cyan", "orange",
    "black", "white", "purple", "pink", "aqua", "indigo", "brown",
    "maroon", "violet"];

let timeLeft = 5;   // the actual time for a challenge round is set to 5 seconds
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


function changeColors() {
    // set new word from the 'words' array, change bg color and word text color
    word.innerHTML = words[Math.trunc(Math.random() * (words.length - 1))];
    word.style.color = createRandomColor();
    word.style.background = createRandomColor();
}


startBtn.addEventListener("click", function () {
    changeColors();

    timeLeft = 5;               // set the timeLeft to 5 in case we want to play a new game
    timeSpan.innerHTML = "";    // set the displayed time to empty string
    scoreSpan.innerHTML = "0";  // set the displayed score to 0

    // set the time limit. in this case it is 5 seconds
    const time = setInterval(function () {
        if (timeLeft <= 0) {

            // if time gets to 0 then it's game over
            clearInterval(time);
            timeSpan.innerHTML = "0";
            alert(`Game Over! Your score is ${scoreSpan.innerHTML}`);
        } else {

            // keep counting down
            timeSpan.innerHTML = String(timeLeft);
        }
        timeLeft -= 1;
    }, 1000);   // set interval to one second countdown
});


submitBtn.addEventListener("click", function () {

    // in case the game is already over or the user didn't start the game yet throw alert
    if (parseInt(timeSpan.innerHTML) === 0 || timeSpan.innerHTML === "") {
        alert("Please start a new game");
        timeSpan.innerHTML = "";
        return;
    }

    // grab the colored word
    const gameWord = word.innerHTML;

    // in case the submitted word is correct
    if (inputText.value === gameWord) {
        winCounter++;
        scoreSpan.innerHTML = String(winCounter);   // increment winCounter with 1
        timeLeft = 5;                               // timer set back to 5 seconds
        changeColors();
        // in case the submitted word is incorrect then it's game over
    } else {
        alert("Wrong color");
        timeLeft = 0;   // timer set to 0, means the game is over
    }

    // set the input text back to blank
    inputText.value = "";
});