"use strict";

const cards = {
    "ACE": [1, 11],
    "JACK": 10,
    "QUEEN": 10,
    "KING": 10,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9
};

const playerPoints = [],
    dealerPoints = [];


const startBtn = document.getElementById("generate-cards"),
    playBtn = document.getElementById("play"),
    resultsBtn = document.getElementById("show-results"),
    deckIdSpan = document.getElementById("deck-id"),
    remainingCardsSpan = document.getElementById("remaining-cards"),
    difficultyRadioBtns = document.getElementsByClassName("difficulty"),
    dealerCards = document.getElementById("dealer-cards"),
    playerCards = document.getElementById("player-cards"),
    hitBtn = document.getElementById("draw");


let getDifficulty = () => {
    for (let i = 0; i < difficultyRadioBtns.length; i++) {
        if (difficultyRadioBtns[i].checked === true) {
            return difficultyRadioBtns[i].value;
        }
    }
};


// generate the cards
function generateDeck() {
    resultsBtn.disabled = true;     // make "Show results" button unclickable until you press the "Stand" button

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${getDifficulty()}`, true);
    xhr.send();

    xhr.onerror = function () {
        alert("Something went wrong during the transaction of generating the deck");
    };
    xhr.onload = function () {
        if (this.status !== 200) {
            alert("Something went wrong.");
        }
        const data = JSON.parse(this.responseText);         // parse the response text to JSON
        deckIdSpan.textContent = data.deck_id;              // grab the ID of the deck (we need it to be able to draw cards)
        remainingCardsSpan.textContent = data.remaining;    // grab the remaining cards in deck

    };
}

function drawTwoCards() {

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://deckofcardsapi.com/api/deck/${deckIdSpan.textContent}/draw/?count=4`, true);
    xhr.send();

    xhr.onerror = function () {
        alert("Something went wrong during the transaction of drawing two cards for each player");
    };
    xhr.onload = function () {
        if (this.status !== 200) {
            alert("Something went wrong.");
        }
        const data = JSON.parse(this.responseText);         // parse the response text to JSON
        remainingCardsSpan.textContent = data.remaining;    // for every card drawn reduce remainingCards quantity

        // draw 2 cards for the dealer, and 2 cards for the player
        for (let i in data.cards) {
            const childElement = document.createElement("img");
            childElement.src = `${data.cards[i].image}`;
            childElement.alt = "Card Image not Available";

            if (dealerCards.children.length < 2) {
                dealerCards.appendChild(childElement);
            } else {
                playerCards.appendChild(childElement);
            }
        }
    };
}


hitBtn.addEventListener("click", () => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", `https://deckofcardsapi.com/api/deck/${deckIdSpan.textContent}/draw/?count=1`, true);
    xhr.send();

    // in case of error throw alert
    xhr.onerror = function () {
        alert("Something went wrong during the transaction of drawing a card for the player");
    };

    xhr.onload = function () {
        if (this.status !== 200) {
            // if status code is not success throw error
            alert(`Something went wrong. the code is ${this.status} with the following: ${this.statusText}`);
        }

        const data = JSON.parse(this.responseText);

        let output = "";

        // for every card drawn, append an image child to "player-cards" div
        for (let i in data.cards) {
            output += `<img src="${data.cards[i].image}" alt="Card image not available"/>`;
        }
        playerCards.innerHTML += output;  // keep appending the images until you wish to press "Stand"
    };
});

startBtn.addEventListener("click", generateDeck);
playBtn.addEventListener("click", drawTwoCards);