"use strict";

/*
the API used for this program can be found here: http://deckofcardsapi.com/
All the information needed to make calls are found in the link above
 */


const generateBtn = document.getElementById("generate-cards"),
    drawBtn = document.getElementById("draw-cards"),
    inputDecks = document.getElementById("deck-no"),
    inputDraw = document.getElementById("draw"),
    deckIdSpan = document.getElementById("deck-id"),
    drawnCardsDiv = document.getElementById("drawn-cards"),
    remainingCardsSpan = document.getElementById("remaining-cards"),
    reshuffleBtn = document.getElementById("reshuffle");


generateBtn.addEventListener("click", () => {
    const xhr = new XMLHttpRequest();           // create object
    let deckCount = Number(inputDecks.value);   // "deckCount" is equal to the input value of "inputDecks"

    // if value of "inputDecks" is not convertible to a number or is an empty string then it defaults to 1
    if (isNaN(Number(inputDecks.value)) || inputDecks.value === "") {
        deckCount = 1;
    }

    // reset the cards, by removing the "ul" elements (the already drawn cards)
    while (drawnCardsDiv.children.length > 0) {
        drawnCardsDiv.children[0].remove();
    }

    // make the call based on how many decks you want. 1 deck contains 52 cards
    xhr.open("GET", `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${deckCount}`, true);

    // in case of error throw alert
    xhr.onerror = function () {
        alert(`Something went wrong during the transaction: \n ${this.responseText}`);
    };

    xhr.onload = function () {
        if (this.status !== 200) {
            // if status code is not success throw error
            alert(`Something went wrong. the code is ${this.status} with the following: ${this.responseText}`);
        }
        const data = JSON.parse(this.responseText);         // parse the response text to JSON

        deckIdSpan.textContent = data.deck_id;              // grab the ID of the deck (we need it to be able to draw cards)
        remainingCardsSpan.textContent = data.remaining;    // grab the remaining cards in deck
    };

    xhr.send();     // send request
});


drawBtn.addEventListener("click", () => {

    // if "remainingCardsSpan" is 0, throw alert because no more cards in deck
    if (remainingCardsSpan.textContent === "0") {
        alert("No more cards left in deck");
        return;
    }

    const xhr = new XMLHttpRequest();
    let drawCount = Number(inputDraw.value);    // "drawCount" is equal to the input value of "inputDraw"

    // if value of "inputDraw" is not convertible to a number or is an empty string then it defaults to 1
    if (isNaN(Number(inputDraw.value)) || inputDraw.value === "") {
        drawCount = 1;
    }

    xhr.open("GET", `https://deckofcardsapi.com/api/deck/${deckIdSpan.textContent}/draw/?count=${drawCount}`, true);

    // in case of error throw alert
    xhr.onerror = function () {
        alert("Something went wrong during the transaction");
    };

    xhr.onload = function () {
        if (this.status !== 200) {
            // if status code is not success throw error
            alert(`Something went wrong. the code is ${this.status} with the following: ${this.statusText}`);
        }

        const data = JSON.parse(this.responseText);         // parse the response text to JSON
        remainingCardsSpan.textContent = data.remaining;    // for every card drawn reduce remainingCards quantity (this is based on the API)

        let output = "";

        // for every card drawn, make an "ul" with its image as first "li", and its value and suit as second "li"
        for (let i in data.cards) {
            output += `<hr>
                       <ul>
                        <li>${data.cards[i].value} of ${data.cards[i].suit}</li>
                        <li><img src="${data.cards[i].image}" alt="Card image not available"/></li>
                       </ul>`
        }
        drawnCardsDiv.innerHTML += output;  // keep appending the "<ul>s" to the "div"
    };
    xhr.send();
});

reshuffleBtn.addEventListener("click", () => {

    if (drawnCardsDiv.children.length > 0) {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", `https://deckofcardsapi.com/api/deck/${deckIdSpan.textContent}/shuffle/`, true);

        xhr.onload = function () {
            if (this.status !== 200) {
                // if status code is not success throw error
                alert(`Something went wrong. the code is ${this.status} with the following: ${this.statusText}`);
            }

            const data = JSON.parse(this.responseText);         // parse the response text to JSON
            remainingCardsSpan.textContent = data.remaining;    // reshuffle the cards, getting back the entire pack(s)

            // reset the cards, by removing the "ul" elements (the already drawn cards)
            while (drawnCardsDiv.children.length > 0) {
                drawnCardsDiv.children[0].remove();
            }
        };
        xhr.send();
    }
});