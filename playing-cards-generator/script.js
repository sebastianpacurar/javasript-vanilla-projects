'use strict';

const inputsContainer = document.getElementById('inputs-container'),
    cardsTable = document.getElementById('cards-table');
let deckNumber = ''


inputsContainer.addEventListener('click', e => {

    const deckCount = document.getElementById('deck-no').value;
    const drawCount = document.getElementById('draw').value;

    let url = '';

    switch (e.target.id) {
        case 'generate-deck':
            url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${deckCount}`;
            break;
        case 'draw-cards':
            url = `https://deckofcardsapi.com/api/deck/${deckNumber}/draw/?count=${drawCount}`;
            break;
        case 'reshuffle':
            url = `https://deckofcardsapi.com/api/deck/${deckIdSpan}/shuffle/`;
            break;
        default:
            return;
    }

    const xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);
    xhr.send();

    xhr.onerror = () => {
        alert("Something went wrong during the transaction");
    };

    xhr.onload = function () {
        if (this.status !== 200) {
            alert(`Something went wrong. the code is ${this.status} with the following: ${this.responseText}`);
        }
        const data = JSON.parse(this.responseText);
        deckNumber = data.deck_id;

        if (url.includes('/draw/')) {
            for (let card of data.cards) {
                const cardImage = document.createElement('IMG');
                cardImage.src = card.image;
                cardImage.value = card.value;
                cardImage.name = card.suit;
                cardImage.alt = card.code;

                cardsTable.appendChild(cardImage);
            }
        } else if (url.includes('shuffle')) {
            //TODO
        }
    };

});