'use strict';

const inputsContainer = document.getElementById('inputs-container'),
    cardsTable = document.getElementById('cards-table'),
    cardsLeftMessage = document.getElementById('remaining-cards'),
    drawContainerBtns = document.querySelectorAll('#button-area button'),
    inputs = document.querySelectorAll('input[type="number"]');
let deckNumber = '';


// the function used to grab data from the api based on an url argument
const fetchData = async (url) => {
    const response = await fetch(url);
    return await response.json();
}

// calculate how many decks are left after drawing each time
const getDecksNumber = (numOfCards) => {
    let count = 0;
    while (numOfCards > 0) {
        numOfCards -= 52
        count++;
    }
    return count;
}

inputsContainer.addEventListener('click', e => {

    /*
        i used Number and to string, in case there will be cases of 0 as first digit,
          Number converts an empty string to 0, while parseInt('') returns NaN
     */
    const deckCount = parseInt(document.getElementById('deck-no').value) > 0 ?
        parseInt(document.getElementById('deck-no').value) : 1;
    const drawCount = parseInt(document.getElementById('draw').value) > 0 ?
        parseInt(document.getElementById('draw').value) : 1
    let url = '';

    // if deck input is empty string, then default to 1 deck of card
    switch (e.target.id) {
        case 'generate-deck':
            url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${deckCount > 20 ? 20 : deckCount}`;
            break;
        case 'draw-cards':
            url = `https://deckofcardsapi.com/api/deck/${deckNumber}/draw/?count=${drawCount}`;
            break;
        case 'reshuffle':
            url = `https://deckofcardsapi.com/api/deck/${deckNumber}/shuffle/`;
            break;
        default:
            return;
    }

    // fetch data from the api and populate the page with cards based on the request
    fetchData(url).then(data => {
        deckNumber = data.deck_id;

        if (url.includes('/draw/')) {
            for (let card of data.cards) {
                const cardImage = document.createElement('IMG');
                cardImage.src = card.image;
                cardImage.value = card.value;
                cardImage.name = card.suit;
                cardImage.alt = card.code;

                const cardInfo = document.createElement('DIV');
                cardInfo.classList.add('card-title');
                cardInfo.textContent = `${isNaN(card.value) ? card.value[0] : card.value} of ${card.suit}`;

                const cardsDetails = document.createElement('DIV');
                cardsDetails.classList.add('card-details');

                cardsDetails.appendChild(cardInfo);
                cardsDetails.appendChild(cardImage);
                cardsTable.appendChild(cardsDetails);
            }
        } else if (url.includes('shuffle')) {

            // remove all the cards when url includes shuffle, or when generate deck button is clicked again
            while (cardsTable.children.length > 0) {
                cardsTable.removeChild(cardsTable.firstElementChild);
            }
        }
        const numberOfDecks = getDecksNumber(data.remaining);

        // enable draw and reshuffle buttons if there are decks on table
        if (parseInt(deckCount) >= 0) {
            drawContainerBtns.forEach(item => item.disabled = false);
        }

        /*
           if there are no remaining cards to draw, disable draw button and show message.
             the show message will appear when there are no cards to draw, as well
         */
        if (data.remaining >= 0) {
            if (data.remaining === 0) {
                cardsLeftMessage.textContent = `Remaining cards: ${data.remaining}`;
                document.querySelector('#draw-cards').disabled = true;

            } else if (data.remaining > 0) {
                cardsLeftMessage.textContent = `Remaining cards in ${numberOfDecks} decks: ${data.remaining}`;
            }
            cardsLeftMessage.style.visibility = 'visible';
        }

    }).catch(err => {
        cardsLeftMessage.style.visibility = 'visible';
        cardsLeftMessage.textContent = `Error: ${err}`;
    });
});


inputs.forEach(item => {
    item.addEventListener('focusin', (e) => {
        e.target.classList.toggle('outline');
    })
});


inputs.forEach(item => {
    item.addEventListener('focusout', (e) => {
        e.target.classList.toggle('outline');
    })
});