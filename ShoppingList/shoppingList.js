'use strict';

const addButton = document.getElementById("addBtn");
const clearButton = document.getElementById("clearBtn");
const totalPriceButton = document.getElementById("calcSum");
const totalPriceParagraph = document.querySelector("p");
const buyList = document.getElementById("buyList");
const inputElement = document.getElementById("input");
const clearList = document.getElementById("completedList");
const table = document.getElementById("historyTable");

let products = {};


// if item already in list, only add random number to the already existing one
// arguments should be in this order: element, listItem, button
function overRideExistingItem() {
    let verified = false;
    for (let i = 0; i < arguments[0].children.length; i++) {
        if (arguments[0].children[i].firstChild.textContent.split(" ")[0] === inputElement.value) {
            let initialNum = parseInt(arguments[0].children[i].textContent.split(" ")[1]);
            const finalNum = String(initialNum += Math.floor(Math.random() * 100));
            arguments[0].children[i].firstChild.textContent = inputElement.value + ' ' + finalNum;

            if (arguments[0].id === 'buyList') {
                arguments[1].appendChild(arguments[2]);
            }
            inputElement.value = "";
            verified = true;
        }
    }
    return verified;
}

addButton.addEventListener("click", function () {
    const listItem = document.createElement("li");
    const itemName = document.createElement("div");
    const itemString = inputElement.value;
    const itemPrice = Math.trunc(Math.random() * 100);

    itemName.textContent = itemString + ' ' + itemPrice;

    // if inserted value is empty, alert and exit function
    if (itemString === "") {
        alert("Please add proper item");
        return;
    }

    // add remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = " Clear";

    if (overRideExistingItem(buyList, listItem, removeBtn)) {
        return;
    }

    // append item name and remove button to list item, and then append the item to existent list in DOM
    listItem.appendChild(itemName);
    listItem.appendChild(removeBtn);
    buyList.appendChild(listItem);

    // remove button deletes an element from Items needed to buy and appends it to Completed list
    removeBtn.addEventListener("click", function (e) {
        e = e.target;
        const clearItem = document.createElement("li");
        clearItem.textContent = e.parentElement.children[0].textContent;
        document.getElementById("completedList").appendChild(clearItem);
        e.parentElement.remove();
    });

    inputElement.value = "";
});

clearButton.addEventListener("click", function () {
    if (clearList.hasChildNodes()) {
        while (clearList.children.length !== 0) {
            const row = table.insertRow(1);
            const nameRow = row.insertCell(0);
            const priceRow = row.insertCell(1);
            const data = clearList.children[0].textContent.split(" ");
            nameRow.textContent = data[0];
            priceRow.textContent = data[1];
            clearList.children[0].remove();
            if (products[nameRow.textContent] !== undefined) {
                for (let prop in products) {
                    if (prop === nameRow.textContent) {
                        products[prop] += parseInt(priceRow.textContent);
                    }
                }
            } else {
                products[nameRow.textContent] = parseInt(priceRow.textContent);
            }
        }
    } else {
        alert("List is empty");
    }
});

totalPriceButton.addEventListener("click", function () {
    const prices = [];
    for (let prop in products) {
        prices.push(products[prop]);
    }

    // if no items in history throw alert; or if the price button is pressed twice without adding any items
    if (prices.length < 1) {
        alert("No items in history");
        return;
    } else if (parseInt(totalPriceParagraph.children[0].textContent) === prices.reduce((a, b) => a + b)) {
        alert("No new items added to history");
    }

    // calculate total sum
    totalPriceParagraph.style.display = "block";
    totalPriceParagraph.children[0].textContent = prices.reduce((a, b) => a + b);
});

