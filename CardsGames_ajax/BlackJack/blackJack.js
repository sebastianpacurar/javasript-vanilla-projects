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
    "9": 9,
    "0": 10
};

const playerPoints = [],
    dealerPoints = [],
    hiddenCardImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRjc1IAS39hgUEEyR_LwzIVJiSc8o6MGXR9_k3Z9K7g4DVcF1JR";

let hiddenDealerCard1 = null,
    hiddenDealerCard2 = null,
    hitCount = 2;       // this will be used when "Hit" button is pressed in order to calculate the points from the third card and beyond


const startBtn = document.getElementById("generate-cards"),
    playBtn = document.getElementById("play"),
    deckIdSpan = document.getElementById("deck-id"),
    remainingCardsSpan = document.getElementById("remaining-cards"),
    difficultyRadioBtns = document.getElementsByClassName("difficulty"),
    dealerCards = document.getElementById("dealer-cards"),
    playerCards = document.getElementById("player-cards"),
    hitBtn = document.getElementById("draw"),
    playerPointsSpan = document.getElementById("your-points"),
    dealerPointsSpan = document.getElementById("dealer-points");


// grab the difficulty value in order to make the AJAX call return x number of decks
let getDifficulty = () => {
    for (let i = 0; i < difficultyRadioBtns.length; i++) {
        if (difficultyRadioBtns[i].checked === true) {
            return difficultyRadioBtns[i].value;
        }
    }
};

// generate the cards
function generateDeck() {
    startBtn.disabled = true;

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

// start the game by drawing 2 cards for the dealer and 2 cards for the player
function drawTwoCards() {
    playBtn.disabled = true;

    const xhr = new XMLHttpRequest();

    // the AJAX request to retrieve 4 cards - 2 for the dealer and 2 for the player (game starts with 2 cards for both)
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
            childElement.src = `${data.cards[i].image}`;    // grab the card "image" from the API request and assign it as src
            childElement.alt = `${data.cards[i].value}`;    // grab the card "value" from the API request and assign it as alt
            const score = childElement.alt;                 // in case there is an ACE, which can be 1 or 11, we go with the 11

            if (dealerCards.children.length < 2) {
                // append 2 cards to dealer
                dealerCards.appendChild(childElement);
                if (score === "ACE" && dealerPoints[0] !== 11) {
                    dealerPoints.push(Number(cards[score][1]))      // append 11 instead of 1
                } else {
                    // add the value of the cards object relevant to the card value into the "dealerPoints" array
                    dealerPoints.push(parseInt(cards[score][0]) ? cards[score] instanceof Array : cards[score]);
                }
            } else {
                // after that append 2 cards to player
                playerCards.appendChild(childElement);
                if (score === "ACE" && dealerPoints[0] !== 11) {
                    playerPoints.push(parseInt(cards[score][1]));   // append 11 instead of 1
                } else {
                    // add the value of the cards object relevant to the card value into the "playerPoints" array
                    playerPoints.push(parseInt(cards[score][0]) ? cards[score] instanceof Array : cards[score]);
                }
            }
        }

        // calculate the accumulated score for both dealer and player
        playerPointsSpan.textContent = String(playerPoints.reduce((a, b) => a + b));
        dealerPointsSpan.textContent = String(dealerPoints.reduce((a, b) => a + b));

        // hide the cards which belong to the dealer
        hideDealerCards();
    };
}


hitBtn.addEventListener("click", () => {
    const xhr = new XMLHttpRequest();

    // the AJAX request method to retrieve 1 card per each "hit" button click
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
            output += `<img src="${data.cards[i].image}" alt="${data.cards[i].value}"/>`;
        }
        playerCards.innerHTML += output;  // keep appending the images until you wish to press "Stand"

        // in order to add the points from the third we need to set a variable to keep track of the cards added eventually
        playerPoints.push(parseInt(cards[playerCards.children[hitCount].alt]));
        hitCount++;

        // calculate the accumulated points from the "playerPoints" array
        playerPointsSpan.textContent = String(playerPoints.reduce((a, b) => a + b));

        if(playerPointsSpan.textContent > 21) {
            alert("You went over 21. BUST")
        }
    };
});


// hide the cards which the dealer has by temporary switching the image src with a different link
function hideDealerCards() {
    hiddenDealerCard1 = dealerCards.children[0].src;
    hiddenDealerCard2 = dealerCards.children[1].src;

    dealerCards.children[0].src = hiddenCardImg;
    dealerCards.children[1].src = hiddenCardImg;
}

// show the dealer cards. this function is called after hitting the "Stand" button or when Bust (you get over 21 points)
function showDealerCards() {
    dealerCards.children[0].src = hiddenDealerCard1;
    dealerCards.children[1].src = hiddenDealerCard2;
}


startBtn.addEventListener("click", generateDeck);
playBtn.addEventListener("click", drawTwoCards);