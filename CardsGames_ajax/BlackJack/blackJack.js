"use strict";

// the cards points used to calculate the points during gameplay
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
    "10": 10
};

// the arrays used to calculate the sum of the points during gameplay
let playerPoints = [],
    dealerPoints = [];

// this is the image used to hide the first 2 cards of the dealer until "Stand" button is clicked or player goes bust
const hiddenCardImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRjc1IAS39hgUEEyR_LwzIVJiSc8o6MGXR9_k3Z9K7g4DVcF1JR";

// the first 2 dealer cards are hidden from the player as rules state
let hiddenDealerCard1 = null,
    hiddenDealerCard2 = null,

    // this will be used when "Hit" button is pressed in order to calculate the points from the third card and beyond
    playerHitCount = 2,
    dealerHitCount = 2,

    // the actual score incremented by one after each round depending on who won
    playerScore = 0,
    dealerScore = 0;


const startBtn = document.getElementById("generate-cards"),
    playBtn = document.getElementById("play"),
    hitBtn = document.getElementById("draw"),
    standBtn = document.getElementById("stand"),
    deckIdSpan = document.getElementById("deck-id"),
    remainingCardsSpan = document.getElementById("remaining-cards"),
    difficultyRadioBtns = document.getElementsByClassName("difficulty"),
    dealerCards = document.getElementById("dealer-cards"),
    playerCards = document.getElementById("player-cards"),
    playerPointsSpan = document.getElementById("your-points"),
    dealerPointsSpan = document.getElementById("dealer-points"),
    playerScoreSpan = document.getElementById("your-score"),
    dealerScoreSpan = document.getElementById("dealer-score");


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
    playBtn.disabled = false;

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

// clear all the cards for starting a new game
function cleanUpCards() {

    // remove cards for dealer
    while (dealerCards.children.length > 0) {
        dealerCards.children[0].remove();
    }

    // remove cards for player
    while (playerCards.children.length > 0) {
        playerCards.children[0].remove();
    }

    // empty dealerPoints array
    dealerPoints = [];

    // empty playerPoints array
    playerPoints = [];

    // reset player and dealer hit counter back to 2
    playerHitCount = 2;
    dealerHitCount = 2;
}

// start the game by drawing 2 cards for the dealer and 2 cards for the player
function drawTwoCards() {

    cleanUpCards();

    // disable "Play" Button and enable "Hit" and "Stand" buttons until the game is over
    playBtn.disabled = true;
    hitBtn.disabled = false;
    standBtn.disabled = false;
    dealerPointsSpan.style.display = "none";

    const xhr = new XMLHttpRequest();

    // the AJAX request to retrieve 4 cards - 2 for the dealer and 2 for the player (game starts with 2 cards for both)
    xhr.open("GET", `https://deckofcardsapi.com/api/deck/${deckIdSpan.textContent}/draw/?count=4`, true);
    xhr.send();

    xhr.onerror = function () {
        alert("Something went wrong during the transaction of drawing two cards for each player");
    };
    xhr.onload = function () {
        if (this.status !== 200) {
            alert(`Something went wrong. Status code is ${this.status}`);
        }
        const data = JSON.parse(this.responseText);         // parse the response text to JSON
        remainingCardsSpan.textContent = data.remaining;    // for every card drawn reduce remainingCards quantity

        // draw 2 cards for the dealer, and 2 cards for the player
        for (let i in data.cards) {
            const childElement = document.createElement("img");
            childElement.src = `${data.cards[i].image}`;    // grab the card "image" from the API request and assign it as src
            childElement.alt = `${data.cards[i].value}`;    // grab the card "value" from the API request and assign it as alt
            const cardPoints = childElement.alt;                 // in case there is an ACE, which can be 1 or 11, we go with the 11

            if (dealerCards.children.length < 2) {
                // append 2 cards to dealer
                dealerCards.appendChild(childElement);
                if (cardPoints === "ACE" && dealerPoints[0] !== 11) {
                    dealerPoints.push(Number(cards[cardPoints][1]))      // append 11 instead of 1
                } else {
                    // add the value of the cards object relevant to the card value into the "dealerPoints" array
                    dealerPoints.push(parseInt(cards[cardPoints][0]) ? cards[cardPoints] instanceof Array : cards[cardPoints]);
                }
            } else {
                // after that append 2 cards to player
                playerCards.appendChild(childElement);
                if (cardPoints === "ACE" && dealerPoints[0] !== 11) {
                    playerPoints.push(parseInt(cards[cardPoints][1]));   // append 11 instead of 1
                } else {
                    // add the value of the cards object relevant to the card value into the "playerPoints" array
                    playerPoints.push(parseInt(cards[cardPoints][0]) ? cards[cardPoints] instanceof Array : cards[cardPoints]);
                }
            }
        }

        // calculate the accumulated score for both dealer and player
        playerPointsSpan.textContent = String(playerPoints.reduce((a, b) => a + b));
        dealerPointsSpan.textContent = String(dealerPoints.reduce((a, b) => a + b));

        // hide the cards which belong to the dealer
        hideDealerCards();

        // if you get an ace and a card value of 10 you are already having 21 points
        if (parseInt(playerPointsSpan.textContent) === 21) {
            hitBtn.disabled = true;
            finishGame();
        }
    };
}

hitBtn.addEventListener("click", () => {

    // if you went over 21 you lost. if you get 21 the dealer plays his cards
    if (parseInt(playerPointsSpan.textContent) === 21) {
        while (parseInt(dealerPointsSpan.textContent) < 17) {
            finishGame();
        }
    }
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
            alert(`Something went wrong. Status code is ${this.status}`);
        }

        const data = JSON.parse(this.responseText);
        let output = "";

        // for every card drawn, append an image child to "player-cards" div
        for (let i in data.cards) {
            output += `<img src="${data.cards[i].image}" alt="${data.cards[i].value}"/>`;
        }
        playerCards.innerHTML += output;  // keep appending the images until you wish to press "Stand"

        // in order to add the points from the third we need to set a variable to keep track of the cards added eventually
        playerPoints.push(parseInt(cards[playerCards.children[playerHitCount].alt]));
        playerHitCount++;


        if (playerPoints.reduce((a, b) => a + b) > 21) {
            // player is BUST if he goes over 21 points
            playerPointsSpan.textContent = "BUST";
            finishGame();
        } else {
            // calculate the accumulated points from the "playerPoints" array
            playerPointsSpan.textContent = String(playerPoints.reduce((a, b) => a + b));

            // if player has 21 points from the very first 2 drawn cards, automatically hit "Stand" button
            if(parseInt(playerPointsSpan.textContent) === 21) {
                finishGame()
            }
        }
    };
});

function finishGame() {

    // hide "Hit" button
    hitBtn.disabled = true;

    // reveal the dealer's first two cards
    showDealerCards();

    // reveal dealer's points
    dealerPointsSpan.style.display = "block";

    const xhr = new XMLHttpRequest();

    // I calculated that you need exactly 5 cards on the table for a match. This might be faulty with 6-7 decks
    xhr.open("GET", `https://deckofcardsapi.com/api/deck/${deckIdSpan.textContent}/draw/?count=3`, true);
    xhr.send();

    // in case of error throw alert
    xhr.onerror = function () {
        alert("Something went wrong during the transaction of drawing a card for the dealer");
    };

    xhr.onload = function () {

        if (this.status !== 200) {
            // if status code is not success throw error
            alert(`Something went wrong. Status code is ${this.status}`);
        }

        const data = JSON.parse(this.responseText);
        let output = "";

        // for every card drawn, append an image child to "player-cards" div
        for (let i in data.cards) {

            // if dealer is BUST or it has exactly 17 points or higher from the very first 2 cards, break iteration
            if (dealerPointsSpan.textContent === "BUST" || parseInt(dealerPointsSpan.textContent) >= 17){
                break;
            }
            while (parseInt(dealerPointsSpan.textContent) < 17) {
                output += `<img src="${data.cards[i].image}" alt="${data.cards[i].value}"/>`;

                dealerCards.innerHTML += output;  // keep appending the images until you wish to press "Stand"

                // in order to add the points from the third we need to set a variable to keep track of the cards added eventually
                dealerPoints.push(parseInt(cards[dealerCards.children[dealerHitCount].alt]));
                dealerHitCount++;

                // calculate the accumulated points from the "playerPoints" array. if dealer gets over 21 he goes BUST
                if (dealerPoints.reduce((a, b) => a + b) > 21) {
                    // break while loop if dealer goes BUST
                    dealerPointsSpan.textContent = "BUST";
                    break;
                } else {
                    dealerPointsSpan.textContent = String(dealerPoints.reduce((a, b) => a + b));
                }
            }
        }

        // save the dealer and player points in 2 variables to be able to make conditions below easier to read
        const dealerPointsValue = Number(dealerPointsSpan.textContent);
        const playerPointsValue = Number(playerPointsSpan.textContent);

        // if dealer wins add increment score with 1, same goes for player. if they both get BUST, no incrementation
        if (isNaN(playerPointsValue) && dealerPointsValue <= 21){
            dealerScore += 1;
        } else if (isNaN(dealerPointsValue) && playerPointsValue <= 21){
            playerScore += 1;
        } else if (dealerPointsValue < playerPointsValue && playerPointsValue <= 21) {
            playerScore += 1;
        } else if (playerPointsValue < dealerPointsValue && playerPointsValue <= 21) {
            dealerScore += 1;
        }

        // make Play Button clickable again since the game is over
        playBtn.disabled = false;

        // disable "Hit" and "Stand" buttons
        hitBtn.disabled = true;
        standBtn.disabled = true;

        // display score
        playerScoreSpan.textContent = playerScore;
        dealerScoreSpan.textContent = dealerScore;
    }
}

// hide the cards which the dealer has by temporary switching the image src with a different link
function hideDealerCards() {
    hiddenDealerCard1 = dealerCards.children[0].src;
    hiddenDealerCard2 = dealerCards.children[1].src;

    dealerCards.children[0].src = hiddenCardImg;
    dealerCards.children[1].src = hiddenCardImg;
}

// show the dealer cards. this function is called after hitting the "Stand" button or when Bust (player gets over 21 points)
function showDealerCards() {
    dealerCards.children[0].src = hiddenDealerCard1;
    dealerCards.children[1].src = hiddenDealerCard2;
}

startBtn.addEventListener("click", generateDeck);
playBtn.addEventListener("click", drawTwoCards);
standBtn.addEventListener("click", finishGame);